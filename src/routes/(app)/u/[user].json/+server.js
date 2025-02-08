import { db } from "$lib/db.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ params, locals, fetch }) {
  const loggedInUser = locals.session?.username;
  const userForPosts = params.user;

  /** @type {{name: string, owner: string}[]} */
  const groups = await fetch(`/u/${loggedInUser}/groups.json`).then((r) =>
    r.json(),
  );

  /** @type {import('pg').QueryResult<import('$lib/db.js').Post>} */
  const posts = await db.query(
    "SELECT * FROM posts WHERE username = $1 AND ((($2) && posts.include AND NOT(($2) && posts.exclude)) OR username = $3) ORDER BY created DESC",
    [
      userForPosts,
      [
        "everyone",
        `@${loggedInUser}`,
        ...(!("error" in groups)
          ? groups.map((group) => "#" + group.name)
          : []),
      ],
      loggedInUser,
    ],
  );

  console.log(posts.rows);

  const viewablePosts = posts.rows;

  return json(viewablePosts);
}
