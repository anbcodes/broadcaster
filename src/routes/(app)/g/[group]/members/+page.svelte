<script>
  let { data } = $props();
</script>

<div class="prose w-full max-w-full pt-10">
  {#if "error" in data.members}
      <h1>Not found</h1>
      <p>There was an error. You are likely not the owner of this group or this group doesn't exist.</p>

  {:else}
  <div class="text-sm pb-4"><a href="/u/{data.user}/groups">Back</a></div>
  <h1>Members of {data.group}</h1>
  <ul>
    {#each data.members as member}
      <li>
        <a href="/u/{member}">@{member}</a> {#if member !== data.user}(<a
          href="/g/{data.group}/members/remove?m={member}">Remove</a
        >){:else} (you) {/if}
      </li>
    {/each}
  </ul>
  <a href="/g/{data.group}/members/add">Add member</a>
  {/if}
</div>
