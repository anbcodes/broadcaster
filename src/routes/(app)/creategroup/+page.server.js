import { fail, redirect } from "@sveltejs/kit";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, fetch }) => {
    const form = await request.formData();
    const name = form.get("name");

    const result = await fetch("/creategroup.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (result.status !== 200) {
      return fail(result.status, await result.json());
    }

    return redirect(303, `/g/${name}/members`);
  },
};
