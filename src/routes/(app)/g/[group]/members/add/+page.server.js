import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, params, locals: { api } }) => {
    const form = await request.formData();
    const username = form.get("username");

    if (typeof username !== "string") {
      return fail(400, { username, error: "Invalid input" });
    }

    try {
      await api.addUserToGroup(params.group, username);

      return redirect(303, `/g/${params.group}/members`);
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { error: e.message });
      } else {
        throw e;
      }
    }
  },
};
