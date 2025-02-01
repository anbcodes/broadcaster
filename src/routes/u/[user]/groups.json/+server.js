import { db } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    if (locals.session?.username !== params.user) {
        return json({ error: 'Not logged in' }, { status: 401 });
    }

    const groupQuery = await db.query('SELECT * FROM group_members JOIN groups ON group_members.groupname = groups.name WHERE username = $1', [params.user]);
    const groups = groupQuery.rows.map((/** @type {import('$lib/db').Group & import('$lib/db').GroupMember} */ v) => ({
        name: v.groupname,
        owner: v.owner,
    }));

    return json(groups);
}