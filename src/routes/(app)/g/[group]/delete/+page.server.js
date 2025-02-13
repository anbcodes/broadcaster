import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @type {import('./$types').PageServerLoad}*/
export async function load({ locals: { api, session }, params }) {
  return {
    user: session?.username,
    group: params.group,
    members: session?.username ? await api.getGroupMembers(params.group) : [],
  };
}

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ locals: { api, session }, params }) => {
    try {
      await api.deleteGroup(params.group);

      return redirect(303, `/u/${session?.username}/groups`);
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { error: e.message });
      } else {
        throw e;
      }
    }
  },
};
