import { redirect } from "@sveltejs/kit";

const themes = [
  "",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

/** @satisfies {import('./$types').Actions}*/
export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    let theme = data.get("theme") ?? "";
    if (typeof theme !== "string" || !themes.includes(theme)) {
      theme = "";
    }
    // const current = cookies.get("theme") ?? "";
    // const next = themes[(themes.indexOf(current) + 1) % themes.length];
    cookies.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return redirect(303, request.headers.get("referer") ?? "/");
  },
};
