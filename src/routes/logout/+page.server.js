import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ fetch, params }) => {
    const result = await fetch(`/logout.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status !== 200) {
      return fail(result.status, { ...(await result.json()) });
    }

    return redirect(303, `/`);
  },
};

export const load = async ({ url }) => {
  return {
    member: url.searchParams.get("m"),
  };
};
