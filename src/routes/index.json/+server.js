import { db } from "$lib/db.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
  const user = locals.session?.username;
  if (!user) {
    return json({ error: "Not logged in" }, { status: 401 });
  }

  /** @type {import('pg').QueryResult<import('$lib/db.js').GroupMember>} */
  const groups = await db.query(
    "SELECT * FROM group_members WHERE username = $1",
    [user]
  );

  console.log(
    [`@${user}`, ...groups.rows.map((group) => "#" + group.groupname)],
    user
  );

  /** @type {import('pg').QueryResult<import('$lib/db.js').Post>} */
  const posts = await db.query(
    "SELECT * FROM posts WHERE username = $2 OR (($1) && posts.include AND NOT(($1) && posts.exclude)) ORDER BY created DESC",
    [[`@${user}`, ...groups.rows.map((group) => "#" + group.groupname)], user]
  );

  return json(posts.rows);
}
