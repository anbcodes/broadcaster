<script>
  import { enhance } from "$app/forms";

  let { form } = $props();
</script>

<div class="prose w-full max-w-[400px] mx-auto pt-10">
  <h1 class="text-center mb-0 pb-0">Logout?</h1>

  <form class="form-control" method="POST" use:enhance>
    <button class="btn mt-5">Logout</button>
    {#if form?.error}
      <p class="text-red-500 text-center mt-5">{form.error}</p>
    {/if}
  </form>
</div>
