/**
 * @type {Record<string, {visibleTo: string[], cb: (post: import('./db.js').Post) => void}[]>}
 */
const callbacks = {};

/**
 * Registers a listener for posts by a user.
 * @param {"*" | string} by
 * @param {string[]} visibleTo
 * @param {(post: import('./db.js').Post) => void} cb
 */
export function onPost(by, visibleTo, cb) {
  callbacks[by] ??= [];
  callbacks[by].push({
    visibleTo,
    cb,
  });
}

/**
 * Notifies everyone of a new post to everyone who can see it.
 * @param {import('./db.js').Post} post
 */
export function newPost(post) {
  const listeners = [...callbacks["*"], ...(callbacks[post.username] || [])];
  for (const { cb, visibleTo } of listeners) {
    if (
      visibleTo.includes("@" + post.username) ||
      (post.include.some((v) => visibleTo.includes(v)) &&
        !post.exclude.some((v) => visibleTo.includes(v)))
    ) {
      cb(post);
    }
  }
}
