import { db } from "./db";

/**
 * @type {{[group_user: `${string}:${string}`]: {included: boolean, checked: number}}}
 */
const inGroupCache = {};

/**
 * Checks if a username is part of a group
 * @param {string} group
 * @param {string} username
 */
export async function inGroup(group, username, timeout = 1000) {
  const cached = inGroupCache[`${group}:${username}`];
  if (cached) {
    if (cached.checked > Date.now() - timeout) {
      return cached.included;
    }
  }

  const inGroup = await db.query(
    "SELECT true FROM group_members WHERE groupname = $1 and username = $2",
    [group, username]
  );
  if (inGroup.rows.length >= 0) {
    inGroupCache[`${group}:${username}`] = {
      included: true,
      checked: Date.now(),
    };
    return true;
  } else {
    inGroupCache[`${group}:${username}`] = {
      included: false,
      checked: Date.now(),
    };
  }
}
