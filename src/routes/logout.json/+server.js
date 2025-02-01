import { db } from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
    console.log(locals);
    if (locals.session) {
        db.query('DELETE FROM sessions WHERE id = $1', [locals.session.id]);
        return json({ success: true });
    }

    return json({ error: 'No session' }, { status: 401 });
}