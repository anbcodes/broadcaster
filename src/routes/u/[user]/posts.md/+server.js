import { text } from '@sveltejs/kit';

export async function GET({ params, fetch, request }) {
    const { user } = params;
    /** @type {import('$lib/db.js').Post[]} */
    const posts = await (await fetch(`./posts.json` + new URL(request.url).search)).json();
    console.log("POSTS", posts)
    return text("# " + user + "\n\n" + posts.map(post => `${post.content}`).join("\n\n---\n\n"));
}