import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, locals: { api } }) => {
    const form = await request.formData();
    const name = form.get("name");
    if (typeof name !== "string")
      return fail(400, { name, error: "Invalid input" });

    try {
      await api.newGroup(name);

      redirect(303, `/g/${name}/members`);
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { name, error: e.message });
      } else {
        throw e;
      }
    }
  },
};
