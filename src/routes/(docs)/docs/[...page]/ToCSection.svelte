<script>
  /** @type {{title: string, open?: boolean, children: import('svelte').Snippet}}*/
  let { title, open, children } = $props();
</script>

<li>
  <details {open}>
    <summary>{title}</summary>
    <ul>
      {@render children()}
    </ul>
  </details>
</li>
