<script>
  const { data } = $props();
</script>

<div class="prose w-full max-w-full pt-10">
  <h1>Your groups</h1>
  <ul>
    {#each data.groups as group}
      <li>#{group.name} {#if group.owner === data.user}
          <a class="pl-2" href="/g/{group.name}/members">(members)</a>
          <a class="pl-2" href="/g/{group.name}/delete">(delete)</a>
        {/if}
    </li>
    {/each}
  </ul>
  <a href="/newgroup">New group</a>
</div>
