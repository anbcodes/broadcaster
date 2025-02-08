import { fail, redirect } from "@sveltejs/kit";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, fetch }) => {
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

    const result = await (
      await fetch("./edit.json", {
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

    return redirect(303, "../");
  },
};

/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, fetch, locals }) {
  return {
    /** @type {import('$lib/db.js').Post[]} */
    posts: await fetch(`/u/${params.user}.json`).then((r) => r.json()),
    user: params.user,
    /** @type {import('$lib/db.js').Group[]} */
    groups: await fetch(`/u/${params.user}/g.json`).then((r) => r.json()),
    self: params.user === locals.session?.username,
    post: params.post,
  };
}
