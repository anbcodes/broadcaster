<script>
  let { data } = $props();
</script>

<div class="prose w-full max-w-full pt-10">
  <div class="text-sm pb-4"><a href="/u/{data.user}/groups">Back</a></div>
  <h1>Members of {data.group}</h1>
  <ul>
    {#each data.members as member}
      <li>
        <a href="/u/{member}">{member}</a> (<a
          href="/g/{data.group}/members/remove?m={member}">Remove</a
        >)
      </li>
    {/each}
  </ul>
  <a href="/g/{data.group}/members/add">Add member</a>
</div>
