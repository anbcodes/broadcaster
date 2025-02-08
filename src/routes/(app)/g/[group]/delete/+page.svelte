<script>
  import { enhance } from "$app/forms";

  let { data, form } = $props();
</script>

<div class="prose w-full max-w-[400px] mx-auto pt-10">
  <div class="text-sm pb-4"><a href="/u/{data.user}/groups">Back</a></div>
  <h1 class="text-center">Delete {data.group}?</h1>
  <p>
    Members: {#each data.members as member}
      <a href="/u/{member}">@{member}</a>
    {/each}
  </p>
  <form class="form-control" method="POST" use:enhance>
    <button class="btn mt-5">Delete</button>
    {#if form?.error}
      <p class="text-red-500 text-center mt-5">{form.error}</p>
    {/if}
  </form>
</div>
