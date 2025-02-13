import { fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ cookies, request, locals: { api } }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      return fail(400, { username, error: "Invalid username or password" });
    }
    try {
      const session = await api.login(username, password);

      cookies.set("session", session.id, {
        path: "/",
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });

      return redirect(303, `/`);
    } catch (e) {
      if (e instanceof BError) {
        return fail(e.code, { username, error: e.message });
      } else {
        throw e;
      }
    }
  },
};
