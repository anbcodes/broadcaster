import { db } from '$lib/db.js';
import { json } from '@sveltejs/kit';
import { hash } from 'argon2';
import { Temporal } from 'temporal-polyfill';

export async function POST({ params, request }) {
    const { username, password } = await request.json();

    if (!username.match(/^[a-zA-Z0-9_]{3,40}$/)) {
        return json({ error: 'Invalid username' }, { status: 400 });
    }

    const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length > 0) {
        return json({ error: 'User already exists' }, { status: 409 });
    }

    const phash = await hash(password);

    const result = await db.query('INSERT INTO users (username, hash, created) VALUES ($1, $2, $3) RETURNING *',
        [username, phash, Temporal.Now.zonedDateTimeISO().toString()]
    );

    return json(result.rows[0]);
}