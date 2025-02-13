import { db } from "$lib/db.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ params, locals: { api, session } }) {
  const loggedInUser = session?.username;
  const userForPosts = params.user;

  const groups = loggedInUser ? await api.getGroups() : [];

  /** @type {import('pg').QueryResult<import('$lib/db.js').Post>} */
  const posts = await db.query(
    "SELECT * FROM posts WHERE username = $1 AND ((($2) && posts.include AND NOT(($2) && posts.exclude)) OR username = $3) ORDER BY created DESC",
    [
      userForPosts,
      [
        "everyone",
        `@${loggedInUser}`,
        ...groups.map((group) => "#" + group.name),
      ],
      loggedInUser,
    ],
  );

  const viewablePosts = posts.rows;

  return json(viewablePosts);
}
