export async function load({ params, fetch, locals }) {
  return {
    user: params.user,
    /** @type {import('$lib/db.js').Group[]} */
    groups: await fetch(`/u/${params.user}/groups.json`).then((r) => r.json()),
    self: params.user === locals.session?.username,
  };
}
