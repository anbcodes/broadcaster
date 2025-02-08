import { db } from "$lib/db";
import { json } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";

/** @type {import('./$types').RequestHandler}*/
export async function POST({ params, request, locals }) {
  const { user } = params;
  if (locals.session?.username !== user) {
    return json({ error: "Not logged in" }, { status: 401 });
  }

  let { content, include = [], exclude = [] } = await request.json();

  if (include?.length === 1 && include[0] === "just you") {
    include = [];
  }

  if (exclude?.length === 1 && exclude[0] === "just you") {
    exclude = [];
  }

  const result = await db.query(
    "INSERT INTO posts (username, content, include, exclude, created, updated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      user,
      content,
      include,
      exclude,
      Temporal.Now.zonedDateTimeISO().toString(),
      Temporal.Now.zonedDateTimeISO().toString(),
    ],
  );

  return json(result.rows[0]);
}
