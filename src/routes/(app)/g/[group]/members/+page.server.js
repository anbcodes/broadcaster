/** @type {import('./$types').PageServerLoad}*/
export async function load({ locals: { session, api }, params }) {
  return {
    user: session?.username,
    group: params.group,
    members: session?.username ? await api.getGroupMembers(params.group) : [],
  };
}
