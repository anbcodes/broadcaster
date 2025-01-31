import { db } from '$lib/db';
import { json } from '@sveltejs/kit';
import { Temporal } from 'temporal-polyfill';

export async function POST({ params, request, locals }) {
    const { user } = params;
    if (locals.session?.username !== user) {
        return json({ error: 'Not logged in' }, { status: 401 });
    }

    const { content, viewableTo = null } = await request.json();

    const result = await db.query('UPDATE posts SET content = $1, viewableto = COALESCE($2, viewableto), updated = $3 WHERE id=$4 RETURNING *',
        [content, viewableTo, Temporal.Now.zonedDateTimeISO().toString(), params.post]
    );

    console.log(result);

    return json(result.rows[0]);
}