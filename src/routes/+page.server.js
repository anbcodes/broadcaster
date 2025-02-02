import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, fetch, locals }) => {
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
      await fetch(`/u/${locals.session?.username}/posts/add.json`, {
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

    return redirect(303, "/");
  },
};

export async function load({ params, fetch, locals, request }) {
  const user = locals.session?.username;

  if (user && request.headers.get("user-agent")?.includes("curl")) {
    redirect(307, "/index.md");
  }

  return {
    /** @type {import('$lib/db.js').Post[] | {error: string}} */
    posts: user ? await fetch(`/index.json`).then((r) => r.json()) : [],
    user: user,
    /** @type {import('$lib/db.js').Group[] | {error: string}} */
    groups: user
      ? await fetch(`/u/${user}/groups.json`).then((r) => r.json())
      : [],
  };
}
