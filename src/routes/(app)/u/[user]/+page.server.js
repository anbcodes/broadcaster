/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, fetch, locals }) {
  return {
    /** @type {import('$lib/db.js').Post[] | {error: string}} */
    posts: await fetch(`/u/${params.user}.json`).then((r) => r.json()),
    user: params.user,
    /** @type {import('$lib/db.js').Group[] | {error: string}} */
    groups: await fetch(`/u/${params.user}/groups.json`).then((r) => r.json()),
    self: params.user === locals.session?.username,
  };
}
