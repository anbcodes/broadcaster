<script>
  let { form } = $props();
</script>

<div class="prose w-full max-w-[400px] mx-auto pt-10">
  <h1 class="text-center mb-0 pb-0">Create Group</h1>

  <form class="form-control" method="POST">
    <label class="label pt-3" for="name">
      <span class="label-text">Group name</span>
    </label>
    <input
      type="text"
      value={form?.name ?? ""}
      name="name"
      placeholder="Group name"
      class="input input-bordered"
    />
    <button class="btn mt-5">Create</button>
    {#if form?.error}
      <p class="text-red-500 text-center mt-5">{form.error}</p>
    {/if}
  </form>
</div>
