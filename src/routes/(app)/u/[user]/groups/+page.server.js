/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, locals: { api, session } }) {
  return {
    user: params.user,
    /** @type {import('$lib/db.js').Group[]} */
    groups: session?.username ? await api.getGroups() : [],
    self: params.user === session?.username,
  };
}
