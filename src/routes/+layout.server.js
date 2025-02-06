export function load({ cookies, locals }) {
  return {
    theme: cookies.get("theme") || "system",
    user: locals.session?.username,
  };
}
