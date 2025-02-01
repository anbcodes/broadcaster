import { db } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
    // Check group permissions
    const groupQuery = await db.query('SELECT * FROM groups WHERE name = $1', [params.group]);
    if (groupQuery.rows.length === 0) {
        return json({ error: 'Group does not exist' }, { status: 404 });
    }
    const group = groupQuery.rows[0];

    if (locals.session?.username !== group.owner) {
        return json({ error: 'Not owner' }, { status: 401 });
    }

    const { username } = await request.json();

    // Check if user exists
    const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length === 0) {
        return json({ error: 'User does not exist' }, { status: 404 });
    }

    // Check if user is actually a member
    const memberQuery = await db.query('SELECT * FROM group_members WHERE groupname = $1 AND username = $2', [params.group, username]);
    if (memberQuery.rows.length === 0) {
        return json({ error: 'User is not in group' }, { status: 409 });
    }

    // Remove user from group
    const result = await db.query('DELETE FROM group_members WHERE groupname = $1 AND username = $2 RETURNING *', [params.group, username]);

    return json(result.rows[0]);
}