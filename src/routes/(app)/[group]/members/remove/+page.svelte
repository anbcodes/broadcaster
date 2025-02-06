<script>
  let { data, form } = $props();
</script>

<div class="prose w-full max-w-[400px] mx-auto pt-10">
  <div class="text-sm pb-4"><a href="./">Back</a></div>

  <h1 class="text-center mb-0 pb-0">Remove {data.member}?</h1>

  <form class="form-control" method="POST">
    <input type="hidden" value={data.member} name="username" />
    <button class="btn mt-5">Remove</button>
    {#if form?.error}
      <p class="text-red-500 text-center mt-5">{form.error}</p>
    {/if}
  </form>
</div>
