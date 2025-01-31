import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const cookie = event.cookies.get('session');
    const query = new URL(event.request.url).searchParams.get('s');
    const session = query ?? cookie;
	event.locals.session = (await db.query('SELECT * FROM sessions WHERE id = $1', [session])).rows[0];
    console.log(session, event.locals.session);

	const response = await resolve(event);

	return response;
}