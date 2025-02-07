import { fail, redirect } from "@sveltejs/kit";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, fetch, params }) => {
    const form = await request.formData();
    const username = form.get("username");

    const result = await fetch(`/g/${params.group}/members/remove.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (result.status !== 200) {
      return fail(result.status, { username, ...(await result.json()) });
    }

    return redirect(303, `/g/${params.group}/members`);
  },
};

/** @type {import('./$types').PageServerLoad}*/
export const load = async ({ url }) => {
  return {
    member: url.searchParams.get("m"),
  };
};
