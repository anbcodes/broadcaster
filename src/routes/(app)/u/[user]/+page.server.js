/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, locals: { api } }) {
  return {
    posts: await api.getPosts(params.user),
    user: params.user,
  };
}
