export class BError extends Error {
    /**
     *
     * @param {string} message
     * @param {number} code
     */
    constructor(message: string, code: number);
    code: number;
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
    constructor({ url, fetch, session, user, }?: {
        url?: string;
        fetch?: typeof globalThis.fetch;
        session?: string;
        user?: string;
    });
    url: string;
    session: string;
    user: string;
    /**
     * Performs a request (throws errors)
     * @param {string} method
     * @param {string} url
     * @param {any} body
     * @returns {Promise<any>}
     */
    req(method: string, url: string, body: any): Promise<any>;
    /**
     * GET Request
     * @param {string} url
     */
    GET(url: string): Promise<any>;
    /**
     * POST Request
     * @param {string} url
     * @param {any} body
     */
    POST(url: string, body: any): Promise<any>;
    /**
     * Performs a relative fetch
     * @param {string} url
     * @param {RequestInit} [init]
     * @returns {Promise<Response>}
     */
    fetch(url: string, init?: RequestInit): Promise<Response>;
    /**
     * Logs in a user and returns the session if successful.
     * The session is saved in the client.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{id: string, username: string, created: string}>}
     */
    login(username: string, password: string): Promise<{
        id: string;
        username: string;
        created: string;
    }>;
    /**
     * Registers a new user. Does not log in.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{username: string, created: string}>}
     */
    register(username: string, password: string): Promise<{
        username: string;
        created: string;
    }>;
    /**
     * Logs out the current user.
     * @returns {Promise<{success: boolean}>}
     */
    logout(): Promise<{
        success: boolean;
    }>;
    /**
     * Gets the feed of the current user.
     * @returns {Promise<BPost[]>}
     */
    feed(): Promise<BPost[]>;
    /**
     * Watches the feed of the current user
     * @param {(post: BPost) => void} callback
     */
    watchFeed(callback: (post: BPost) => void): Promise<void>;
    /**
     * Posts a new message to the feed.
     * @param {string | {content: string, include?: string[], exclude?: string[]}} contentOrPost
     * @returns {Promise<BPost>}
     */
    post(contentOrPost: string | {
        content: string;
        include?: string[];
        exclude?: string[];
    }): Promise<BPost>;
    /**
     * Edits a post
     * @overload
     * @param {string} idOrPost
     * @param {string} [content]
     * @param {string[]} [include]
     * @param {string[]} [exclude]
     * @returns {Promise<BPost>}
     */
    editPost(idOrPost: string, content?: string, include?: string[], exclude?: string[]): Promise<BPost>;
    /**
     * Edits a post
     * @overload
     * @param {{id: string, content?: string, include?: string[], exclude?: string[]}} idOrPost
     * @returns {Promise<BPost>}
     */
    editPost(idOrPost: {
        id: string;
        content?: string;
        include?: string[];
        exclude?: string[];
    }): Promise<BPost>;
    /**
     * Gets the posts by a user.
     * @param {string} user
     * @returns {Promise<BPost[]>}
     */
    getPosts(user: string): Promise<BPost[]>;
    /**
     * Creates a group
     * @param {string} name
     * @returns {Promise<BGroup>}
     */
    newGroup(name: string): Promise<BGroup>;
    /**
     * Gets the groups of the current user
     * @returns {Promise<BGroup[]>}
     */
    getGroups(): Promise<BGroup[]>;
    /**
     * Gets the members of a group
     * @param {string} group
     * @returns {Promise<string[]>}
     */
    getGroupMembers(group: string): Promise<string[]>;
    /**
     * Adds a user to a group
     * @param {string} group
     * @param {string} user
     * @returns {Promise<BGroupMember>}
     */
    addUserToGroup(group: string, user: string): Promise<BGroupMember>;
    /**
     * Removes a user from a group
     * @param {string} group
     * @param {string} user
     * @returns {Promise<BGroupMember>}
     */
    removeUserFromGroup(group: string, user: string): Promise<BGroupMember>;
    /**
     * Deletes a group
     * @param {string} group
     * @returns {Promise<BGroup>}
     */
    deleteGroup(group: string): Promise<BGroup>;
    #private;
}
export const broadcaster: BClient;
export type BPost = {
    id: number;
    username: string;
    content: string;
    include: string[];
    exclude: string[];
    created: string;
    updated: string;
};
export type BGroupMember = {
    groupname: string;
    username: string;
};
export type BGroup = {
    name: string;
    owner: string;
};
//# sourceMappingURL=index.d.ts.map