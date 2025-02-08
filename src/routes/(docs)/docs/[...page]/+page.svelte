<script>
  import "../../../../app.css";
  import markdownit from "markdown-it";
  import TableOfContents from "./TableOfContents.svelte";
  import anchor from "markdown-it-anchor";
  import { slugify } from "$lib/util";
  import markdownItAttrs from "markdown-it-attrs";
  import hljs from "highlight.js";
  import "highlight.js/styles/atom-one-dark-reasonable.min.css";

  let { data } = $props();
  const md = markdownit({
    linkify: true,
    highlight: (str, lang) => {
      if (!lang || hljs.getLanguage(lang) == null) {
        return hljs.highlightAuto(str).value;
      }
      return hljs.highlight(str, { language: lang }).value;
    },
  }).use(markdownItAttrs, anchor, { slugify });
</script>

<div class="flex p-2 gap-4">
  <label for="my-drawer" class="btn btn-circle drawer-button lg:hidden"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  </label>
  <div class="text-3xl"><a href="/docs">Broadcaster Help</a></div>
  <div class="flex-grow"></div>
  <form method="POST" action="/changetheme">
    <button class="btn btn-sm">Theme: {data.theme}</button>
  </form>
</div>

<div class="drawer lg:drawer-open">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-side z-20">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <div
      class="flex flex-col py-4 px-2 lg:border-t border-t-base-300 lg:min-w-[400px] h-screen bg-base-100"
    >
      <TableOfContents mode={data.mode}></TableOfContents>
    </div>
  </div>

  <div class="drawer-content">
    <main class="p-5 prose !max-w-[800px] pb-40">
      {@html md.render(data.content)}
    </main>
  </div>
</div>
