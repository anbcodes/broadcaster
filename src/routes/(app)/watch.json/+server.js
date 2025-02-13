import { onPost } from "$lib/watcher";
import { json } from "@sveltejs/kit";
import { produce } from "sveltekit-sse";

/** @type {import('./$types').RequestHandler}*/
export async function GET({ locals: { api, session } }) {
  const user = session?.username;
  if (!user) {
    return json({ error: "Not logged in" }, { status: 403 });
  }

  const groups = user ? await api.getGroups() : [];

  return produce(async ({ emit }) => {
    onPost("*", [`@${user}`, ...groups.map((v) => `#${v.name}`)], (post) => {
      emit("message", JSON.stringify(post));
    });
  });
}
