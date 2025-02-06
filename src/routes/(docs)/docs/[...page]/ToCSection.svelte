<script>
  /** @type {{title: string, children: import('svelte').Snippet}}*/
  let { title, children } = $props();
</script>

<li>
  <details>
    <summary>{title}</summary>
    <ul>
      {@render children()}
    </ul>
  </details>
</li>
