import { db } from "$lib/db";
import { authFetch } from "$lib/util";
import { onPost } from "$lib/watcher";
import { json } from "@sveltejs/kit";
import { produce } from "sveltekit-sse";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ locals, fetch, params }) {
  fetch = authFetch(fetch, locals?.session?.id);

  const user = locals.session?.username;

  const forUser = params.user;

  /** @type {string[]} */
  const groups = user
    ? await fetch(`/u/${user}/groups.json`, { method: "GET" }).then((r) =>
        r.json(),
      )
    : [];

  return produce(async ({ emit }) => {
    onPost(
      forUser,
      ["everyone", `@${user}`, ...groups.map((v) => `#{v}`)],
      (post) => {
        emit("message", JSON.stringify(post));
      },
    );
  });
}
