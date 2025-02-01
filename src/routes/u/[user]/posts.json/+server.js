import { db } from '$lib/db.js';
import { asyncFilter } from '$lib/util';
import { checkViewable } from '$lib/util.server.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    /** @type {import('pg').QueryResult<import('$lib/db.js').Post>} */
    const posts = await db.query('SELECT * FROM posts WHERE username = $1', [params.user]);

    const viewablePosts = locals.session?.username !== params.user
        ? await asyncFilter(posts.rows, post => checkViewable(post.viewableto, locals.session?.username ?? ''))
        : posts.rows;

    return json(viewablePosts);
}