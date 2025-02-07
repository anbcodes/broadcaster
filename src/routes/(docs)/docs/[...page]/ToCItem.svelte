<script>
  import { page } from "$app/stores";
  /** @type {{href: string, children: import('svelte').Snippet}} */
  let { href, children } = $props();
  let isActive = $derived(
    $page.url.pathname + $page.url.hash === href.replace(/(\/$)|(\/#)/, "")
  );
</script>

<li>
  <a class={isActive ? "active" : ""} {href}>{@render children()}</a>
</li>
