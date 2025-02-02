import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, fetch }) => {
    const form = await request.formData();
    const content = form.get("content") ?? "";
    const include = form.get("include") ?? "none";
    const exclude = form.get("exclude") ?? "none";

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

    const result = await (
      await fetch("./posts/add.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          include: include.split(",").filter((v) => v.trim()),
          exclude: exclude.split(",").filter((v) => v.trim()),
        }),
      })
    ).json();

    if (result.error) {
      return fail(400, { content, include, exclude, error: result.error });
    }

    return redirect(303, "./posts");
  },
};

export async function load({ params, fetch, locals }) {
  return {
    /** @type {import('$lib/db.js').Post[] | {error: string}} */
    posts: await fetch(`/u/${params.user}/posts.json`).then((r) => r.json()),
    user: params.user,
    /** @type {import('$lib/db.js').Group[] | {error: string}} */
    groups: await fetch(`/u/${params.user}/groups.json`).then((r) => r.json()),
    self: params.user === locals.session?.username,
  };
}
