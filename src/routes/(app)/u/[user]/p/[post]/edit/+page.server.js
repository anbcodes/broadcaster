import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, params, locals: { api } }) => {
    const form = await request.formData();
    const content = form.get("content");
    const include = form.get("include") ?? "";
    const exclude = form.get("exclude") ?? "";

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
      await api.editPost({
        id: params.post,
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

    return redirect(303, `/`);
  },
};

/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, locals: { session, api } }) {
  return {
    posts: await api.getPosts(params.user),
    user: params.user,
    groups: session?.username ? await api.getGroups() : [],
    self: params.user === session?.username,
    post: params.post,
  };
}
