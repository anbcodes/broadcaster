import { fail, redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad}*/
export async function load({ locals, params, fetch }) {
  return {
    user: locals.session?.username,
    group: params.group,
    members: await fetch(`/g/${params.group}/members.json`).then((r) =>
      r.json(),
    ),
  };
}

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, locals, params, fetch }) => {
    const form = await request.formData();

    const user = locals.session?.username;

    const result = await fetch(`/g/${params.group}/delete.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status !== 200) {
      return fail(result.status, { ...(await result.json()) });
    }

    return redirect(303, `/u/${user}/groups`);
  },
};
