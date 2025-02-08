import { db } from "$lib/db.js";
import { generateRandomId } from "$lib/util";
import { json } from "@sveltejs/kit";
import { verify } from "argon2";
import { Temporal } from "temporal-polyfill";

/** @type {import('./$types').RequestHandler}*/
export async function POST({ request }) {
  const { username, password } = await request.json();
  const user = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (user.rows.length === 0) {
    return json({ error: "User does not exist" }, { status: 409 });
  }

  if (await verify(user.rows[0].hash, password)) {
    const id = generateRandomId();
    const result = await db.query(
      "INSERT INTO sessions (username, id, created) VALUES ($1, $2, $3) RETURNING *",
      [username, id, Temporal.Now.zonedDateTimeISO().toString()],
    );

    return json(result.rows[0]);
  }

  return json({ error: "Invalid password" }, { status: 401 });
}
