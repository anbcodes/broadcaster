import { db } from "$lib/db";
import { json } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";

export async function POST({ params, request, locals }) {
  const { user } = params;
  if (locals.session?.username !== user) {
    return json({ error: "Not logged in" }, { status: 401 });
  }

  let { content, include = null, exclude = null } = await request.json();

  if (include?.length === 1 && include[0] === "just you") {
    include = [];
  }

  if (exclude?.length === 1 && exclude[0] === "just you") {
    exclude = [];
  }

  const result = await db.query(
    "UPDATE posts SET content = $1, include = COALESCE($2, include), exclude = COALESCE($3, exclude), updated = $4 WHERE id=$5 RETURNING *",
    [
      content,
      include,
      exclude,
      Temporal.Now.zonedDateTimeISO().toString(),
      params.post,
    ]
  );

  return json(result.rows[0]);
}
