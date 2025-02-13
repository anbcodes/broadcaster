import { text } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ params, locals: { api } }) {
  const { user } = params;
  const posts = await api.getPosts(user);
  return text(
    "# " +
      user +
      "\n\n" +
      posts.map((post) => `${post.content}`).join("\n\n---\n\n"),
  );
}
