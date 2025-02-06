<script>
  const { data } = $props();
</script>

<div class="prose w-full max-w-full pt-10">
  <h1>Your groups</h1>
  <ul>
    {#each data.groups as group}
      <li><a href="/g/{group.name}/members">{group.name}</a></li>
    {/each}
  </ul>
  <a href="/creategroup">Add group</a>
</div>
