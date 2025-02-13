import { createEventSource } from "eventsource-client";

export class BError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} code
   */
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/** @typedef {{id: number, username: string, content: string, include: string[], exclude: string[], created: string, updated: string}} BPost */

/**
 * @typedef {{
 *  groupname: string,
 *  username: string
 * }} BGroupMember
 */

/**
 * @typedef {{
 *   name: string,
 *   owner: string,
 * }} BGroup
 */

export class BClient {
  /** @type {typeof fetch} */
  #baseFetch;

  constructor({
    url = "https://b.anb.codes",
    fetch = globalThis.fetch,
    session = "",
    user = "",
  } = {}) {
    this.url = url;
    this.session = session;
    this.user = user;
    this.#baseFetch = fetch;
  }

  /**
   * Performs a request (throws errors)
   * @param {string} method
   * @param {string} url
   * @param {any} body
   * @returns {Promise<any>}
   */
  async req(method, url, body) {
    let opts = {};
    if (body) {
      opts = {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
    let res = await this.fetch(url, {
      method,
      ...opts,
    });

    if (!res.headers.get("Content-Type").startsWith("application/json")) {
      throw new BError(await res.text(), res.status);
    } else if (!res.ok) {
      throw new BError((await res.json()).error, res.status);
    } else {
      return await res.json();
    }
  }

  /**
   * GET Request
   * @param {string} url
   */
  GET(url) {
    return this.req("GET", url);
  }
  /**
   * POST Request
   * @param {string} url
   * @param {any} body
   */
  POST(url, body) {
    return this.req("POST", url, body);
  }

  /**
   * Performs a relative fetch
   * @param {string} url
   * @param {RequestInit} [init]
   * @returns {Promise<Response>}
   */
  fetch(url, init) {
    let headers = new Headers(init.headers);
    if (this.session) {
      headers.append("Cookie", `session=${this.session}`);
    }
    return this.#baseFetch(`${this.url}${url}`, {
      ...init,
      headers: headers,
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  /**
   * Logs in a user and returns the session if successful.
   * The session is saved in the client.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{id: string, username: string, created: string}>}
   */
  async login(username, password) {
    const data = await this.POST("/login.json", { username, password });
    this.session = data.id;
    this.user = data.username;
    return data;
  }

  /**
   * Registers a new user. Does not log in.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{username: string, created: string}>}
   */
  async register(username, password) {
    return await this.POST("/register.json", { username, password });
  }

  /**
   * Logs out the current user.
   * @returns {Promise<{success: boolean}>}
   */
  async logout() {
    const data = await this.POST("/logout.json", {});
    this.session = "";
    return data;
  }

  /**
   * Gets the feed of the current user.
   * @returns {Promise<BPost[]>}
   */
  async feed() {
    return await this.GET("/index.json");
  }

  /**
   * Watches the feed of the current user
   * @param {(post: BPost) => void} callback
   */
  async watchFeed(callback) {
    const es = createEventSource({
      url: `${this.url}/watch.json`,
      onMessage: (e) => {
        const post = JSON.parse(e.data);
        callback(post);
      },
    });
  }

  /**
   * Posts a new message to the feed.
   * @param {string | {content: string, include?: string[], exclude?: string[]}} contentOrPost
   * @returns {Promise<BPost>}
   */
  async post(contentOrPost) {
    if (typeof contentOrPost === "string") {
      contentOrPost = { content: contentOrPost };
    }
    let { content, include = [], exclude = [] } = contentOrPost;
    const data = await this.POST(`/u/${this.user}/p/new.json`, {
      content,
      include,
      exclude,
    });
    return data;
  }

  /**
   * Edits a post
   * @overload
   * @param {number} idOrPost
   * @param {string} [content]
   * @param {string[]} [include]
   * @param {string[]} [exclude]
   * @returns {Promise<BPost>}
   */
  /**
   * Edits a post
   * @overload
   * @param {{id: number, content?: string, include?: string[], exclude?: string[]}} idOrPost
   * @returns {Promise<BPost>}
   */
  async editPost(idOrPost, content, include, exclude) {
    /** @type {Partial<BPost>} */
    let post = {};
    if (typeof idOrPost === "number") {
      post.id = idOrPost;
      post.content = content;
      post.include = include;
      post.exclude = exclude;
    } else {
      post = idOrPost;
    }
    const data = await this.POST(
      `/u/${this.user}/p/${post.id}/edit.json`,
      post,
    );
    return data;
  }

  /**
   * Gets the posts by a user.
   * @param {string} user
   * @returns {Promise<BPost[]>}
   */
  async getPosts(user) {
    const data = await this.GET(`/u/${user}.json`);
    return data;
  }

  /**
   * Creates a group
   * @param {string} name
   * @returns {Promise<BGroup>}
   */
  async newGroup(name) {
    const data = await this.POST(`/newgroup.json`, { name });
    return data;
  }

  /**
   * Gets the groups of the current user
   * @returns {Promise<BGroup[]>}
   */
  async getGroups() {
    const data = await this.GET(`/u/${this.user}/groups.json`);
    return data;
  }

  /**
   * Gets the members of a group
   * @param {string} group
   * @returns {Promise<string[]>}
   */
  async getGroupMembers(group) {
    const data = await this.GET(`/g/${group}/members.json`);
    return data;
  }

  /**
   * Adds a user to a group
   * @param {string} group
   * @param {string} user
   * @returns {Promise<BGroupMember>}
   */
  async addUserToGroup(group, user) {
    const data = await this.POST(`/g/${group}/members/add.json`, {
      username: user,
    });
    return data;
  }

  /**
   * Removes a user from a group
   * @param {string} group
   * @param {string} user
   * @returns {Promise<BGroupMember>}
   */
  async removeUserFromGroup(group, user) {
    const data = await this.POST(`/g/${group}/members/remove.json`, {
      username: user,
    });
    return data;
  }

  /**
   * Deletes a group
   * @param {string} group
   * @returns {Promise<BGroup>}
   */
  async deleteGroup(group) {
    const data = await this.POST(`/g/${group}/delete.json`, {});
    return data;
  }
}

export const broadcaster = new BClient();
