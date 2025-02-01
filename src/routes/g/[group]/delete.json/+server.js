import { db } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ params, locals }) {
    // Check group permissions
    const groupQuery = await db.query('SELECT * FROM groups WHERE name = $1', [params.group]);
    if (groupQuery.rows.length === 0) {
        return json({ error: 'Group does not exist' }, { status: 404 });
    }
    const group = groupQuery.rows[0];

    if (locals.session?.username !== group.owner) {
        return json({ error: 'Not owner' }, { status: 401 });
    }

    // Delete group
    const result = await db.query('DELETE FROM groups WHERE name = $1 RETURNING *', [params.group]);

    return json(result.rows[0]);
}