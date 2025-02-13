import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ cookies, locals: { api } }) => {
    try {
      await api.logout();
      cookies.set("session", "", { path: "/", maxAge: 0 });

      redirect(303, `/`);
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { error: e.message });
      } else {
        throw e;
      }
    }
  },
};

/** @type {import('./$types').PageServerLoad}*/
export const load = async ({ url }) => {
  return {
    member: url.searchParams.get("m"),
  };
};
