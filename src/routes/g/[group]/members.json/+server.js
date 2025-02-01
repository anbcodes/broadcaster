import { db } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    const groupQuery = await db.query('SELECT * FROM groups WHERE name = $1', [params.group]);
    if (groupQuery.rows.length === 0) {
        return json({ error: 'Group does not exist' }, { status: 404 });
    }
    const group = groupQuery.rows[0];

    if (locals.session?.username !== group.owner) {
        return json({ error: 'Not owner' }, { status: 401 });
    }

    const members = await db.query('SELECT * FROM group_members WHERE groupname = $1', [params.group]);

    return json(members.rows.map((/** @type {{ username: any; }} */ v) => v.username));
}