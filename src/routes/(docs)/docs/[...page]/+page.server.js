import { redirect } from "@sveltejs/kit";

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const mode = data.get("mode") ?? "";
    const url = data.get("url") ?? "";
    if (typeof mode !== "string" || typeof url !== "string") {
      return {
        status: 400,
        body: "Invalid request",
      };
    }
    const oldMode = cookies.get("doc-mode") || "user";

    cookies.set("doc-mode", mode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 4,
    });

    if (url) {
      const newUrl = new URL(url.replace(`/docs/${oldMode}`, `/docs/${mode}`));
      return redirect(303, `${newUrl.pathname}${newUrl.search}${newUrl.hash}`);
    }
  },
};

/** @type {import('./$types').PageServerLoad}*/
export async function load({ params, cookies, locals }) {
  const pages = import.meta.glob("../../../../docs/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  let imported =
    /** @type {string} */
    (
      pages[`../../../../docs/${params.page}.md`] ??
        pages[
          `../../../../docs/${params.page}${
            params.page === "" ? "" : "/"
          }index.md`
        ] ??
        pages["../../../../docs/404.md"]
    );

  let replaceRules = {
    USER: locals.session?.username || "[your username]",
    // URL: "https://b.anb.codes",
    URL: "https://localhost:5173",
  };

  imported = Object.entries(replaceRules).reduce(
    (acc, [key, value]) => acc.replaceAll(`%${key}%`, value),
    imported,
  );

  return {
    content: imported,
    theme: cookies.get("theme") || "system",
    mode: cookies.get("doc-mode") || "user",
  };
}
