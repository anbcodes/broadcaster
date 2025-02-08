import { db } from "$lib/db.js";
import { json } from "@sveltejs/kit";

/**
 * @typedef {{
 *  error: string;
 * } | {
 *  groupname: string;
 * }} POSTRes
 */

/**
 *
 * @param {POSTRes} v
 * @param {{status?: number}} [options]
 */
const tjson = (v, options) => json(v, options);

export async function POST({ params, request, locals }) {
  // Check group permissions
  const groupQuery = await db.query("SELECT * FROM groups WHERE name = $1", [
    params.group,
  ]);
  if (groupQuery.rows.length === 0) {
    return tjson({ error: "Group does not exist" }, { status: 404 });
  }
  const group = groupQuery.rows[0];

  if (locals.session?.username !== group.owner) {
    return tjson({ error: "Not owner" }, { status: 401 });
  }

  const { username } = await request.json();

  // Check if user exists
  const userQuery = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (userQuery.rows.length === 0) {
    return tjson({ error: "User does not exist" }, { status: 404 });
  }

  // Check if user is already a member
  const memberQuery = await db.query(
    "SELECT * FROM group_members WHERE groupname = $1 AND username = $2",
    [params.group, username]
  );
  if (memberQuery.rows.length > 0) {
    return tjson({ error: "User already in group" }, { status: 409 });
  }

  // Add user to group
  /** @type {import('pg').QueryResult<import('$lib/db.js').GroupMember>} */
  const result = await db.query(
    "INSERT INTO group_members (groupname, username) VALUES ($1, $2) RETURNING *",
    [params.group, username]
  );

  return tjson(result.rows[0]);
}
