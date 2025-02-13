import { onPost } from "$lib/watcher";
import { json } from "@sveltejs/kit";
import { produce } from "sveltekit-sse";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ locals: { session, api }, params }) {
  const user = session?.username;

  const forUser = params.user;

  const groups = user ? await api.getGroups() : [];

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
