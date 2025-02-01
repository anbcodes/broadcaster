import { db } from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
    const { name: group } = await request.json();
    // Check if groupname is valid
    if (!group.match(/^[a-zA-Z0-9_]{3,100}$/)) {
        return json({ error: 'Invalid group name' }, { status: 400 });
    }
    // Check if group exists
    const groupQuery = await db.query('SELECT * FROM groups WHERE name = $1', [group]);
    if (groupQuery.rows.length !== 0) {
        return json({ error: 'Group already exists' }, { status: 404 });
    }

    if (!locals.session?.username) {
        return json({ error: 'Not logged in' }, { status: 401 });
    }

    // Add group
    const result = await db.query('INSERT INTO groups (name, owner) VALUES ($1, $2) RETURNING *',
        [group, locals.session.username]
    );

    // Add user to group
    const addRes = await db.query('INSERT INTO group_members (groupname, username) VALUES ($1, $2)',
        [group, locals.session.username]
    );
    if (addRes.rowCount === 0) {
        return json({ error: 'Failed to add user to group' }, { status: 500 });
    }

    return json(result.rows[0]);
}
