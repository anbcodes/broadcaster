import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, locals: { api } }) => {
    const form = await request.formData();
    const content = form.get("content") ?? "";
    const include = form.get("include") ?? "";
    const exclude = form.get("exclude") ?? "";
    console.log({ content });

    if (
      typeof content !== "string" ||
      typeof include !== "string" ||
      typeof exclude !== "string"
    ) {
      return fail(400, {
        content: "",
        include: "",
        exclude: "",
        error: "Invalid input",
      });
    }

    try {
      await api.post({
        content,
        include: include.split(",").filter((v) => v.trim()),
        exclude: exclude.split(",").filter((v) => v.trim()),
      });

      redirect(303, "/");
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { content, include, exclude, error: e.message });
      } else {
        throw e;
      }
    }
  },
};

/** @type {import('./$types').PageServerLoad}*/
export async function load({ locals: { api, session }, request }) {
  const user = session?.username;

  if (user && request.headers.get("user-agent")?.includes("curl")) {
    redirect(307, "/index.md");
  }

  return {
    posts: user ? await api.feed() : [],
    user: user,
    groups: user ? await api.getGroups() : [],
  };
}
