import { db } from "$lib/db.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler}*/
export async function POST({ locals }) {
  if (locals.session) {
    db.query("DELETE FROM sessions WHERE id = $1", [locals.session.id]);
    return json({ success: true });
  }

  return json({ error: "No session" }, { status: 401 });
}
