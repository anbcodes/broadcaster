import { redirect } from '@sveltejs/kit';

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
  ]

export const actions = {
    default: async ({cookies, request, fetch}) => {
        const current = cookies.get('theme') ?? '';
        const next = themes[(themes.indexOf(current) + 1) % themes.length];
        cookies.set('theme', next, { path: '/'});
        return redirect(303, request.headers.get('referer') ?? '/');
    }
}