<script>
  import { enhance } from "$app/forms";

  let { form } = $props();
</script>

<div class="prose w-full max-w-[400px] mx-auto pt-10">
  <h1 class="text-center mb-0 pb-0">Login</h1>

  <form class="form-control" method="POST" use:enhance>
    <label class="label pt-3" for="username">
      <span class="label-text">Username</span>
    </label>
    <input
      type="text"
      value={form?.username ?? ""}
      name="username"
      placeholder="Username"
      class="input input-bordered"
    />
    <label class="label pt-3" for="password">
      <span class="label-text">Password</span>
    </label>
    <input
      type="password"
      name="password"
      placeholder="Password"
      class="input input-bordered"
    />

    <button class="btn mt-5">Login</button>
    {#if form?.error}
      <p class="text-red-500 text-center mt-5">{form.error}</p>
    {/if}
  </form>
</div>
