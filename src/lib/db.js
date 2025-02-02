import { PG_URL } from "$env/static/private";
import pg from "pg";

/**
 * @typedef {{
 *  username: string,
 *  hash: string,
 *  created: string
 * }} User
 * */

/**
 * @typedef {{
 *  username: string,
 *  include: string[],
 *  exclude: string[],
 *  content: string,
 *  created: string,
 *  updated: string,
 *  id: number,
 * }} Post
 */

/**
 * @typedef {{
 *  groupname: string,
 *  username: string
 * }} GroupMember
 */

/**
 * @typedef {{
 *   name: string,
 *   owner: string,
 * }} Group
 */

const client = new pg.Client({
  connectionString: PG_URL,
});

client.connect();

export const db = client;
