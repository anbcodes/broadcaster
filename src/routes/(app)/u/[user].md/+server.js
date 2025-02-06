import { text } from "@sveltejs/kit";

export async function GET({ params, fetch, request }) {
  const { user } = params;
  /** @type {import('$lib/db.js').Post[]} */
  const posts = await (
    await fetch(`/u/${user}.json` + new URL(request.url).search)
  ).json();
  return text(
    "# " +
      user +
      "\n\n" +
      posts.map((post) => `${post.content}`).join("\n\n---\n\n")
  );
}
