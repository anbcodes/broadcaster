export async function load({ locals, params, fetch }) {
  return {
    user: locals.session?.username,
    group: params.group,
    members: await fetch(`/g/${params.group}/members.json`).then((r) =>
      r.json()
    ),
  };
}
