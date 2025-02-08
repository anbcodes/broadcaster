import { csrf } from "$lib/csrfProtection";
import { db } from "$lib/db";
import { redirect } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookie = event.cookies.get("session");
  const query = new URL(event.request.url).searchParams.get("s");
  const session = query ?? cookie;
  event.locals.session = (
    await db.query("SELECT * FROM sessions WHERE id = $1", [session])
  ).rows[0];

  return csrf([/^.*\.json$/g])({
    event,
    resolve: async (event) => {
      const response = await resolve(event, {
        transformPageChunk: ({ html }) =>
          html.replace("%theme%", event.cookies.get("theme") ?? ""),
      });

      return response;
    },
  });
}

export const init = async () => {
  console.info("Server created, registering shutdown hooks");

  process.on("sveltekit:shutdown", async (reason) => {
    console.info("SvelteKit has shutdown because of", reason);

    // Your custom logic for closing app specific resources
    await db.end();
    console.info("DB closed");
  });
};
