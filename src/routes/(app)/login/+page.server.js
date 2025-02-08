import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ cookies, request, fetch }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    const session = await fetch("/login.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const sessionJson = await session.json();
    if (sessionJson.error) {
      return fail(400, { username, error: sessionJson.error });
    }

    cookies.set("session", sessionJson.id, { path: "/", sameSite: "lax" });

    return redirect(303, `/`);
  },
};
