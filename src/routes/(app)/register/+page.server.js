import { error, fail, redirect } from "@sveltejs/kit";
import { BError } from "thebroadcaster";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ cookies, request, locals: { api } }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      return fail(400, { username, error: "Passwords do not match" });
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return fail(400, { username, error: "Invalid input" });
    }

    try {
      await api.register(username, password);
      const session = await api.login(username, password);

      cookies.set("session", session.id, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });

      redirect(303, "/");
    } catch (e) {
      if (e instanceof BError) {
        return fail(400, { username, error: e.message });
      } else {
        throw e;
      }
    }
  },
};
