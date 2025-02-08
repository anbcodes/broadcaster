import { fail, redirect } from "@sveltejs/kit";

/** @satisfies {import('./$types').Actions}*/
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

    cookies.set("session", sessionJson.id, {
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });

    return redirect(303, `/`);
  },
};
