<script>
  import { invalidateAll } from "$app/navigation";
  import Post from "$lib/Post.svelte";
  import { onMount } from "svelte";

  const { data } = $props();

  let error = $state("");
  /** @type {import('$lib/db.js').Post[]}*/
  let posts = $derived("error" in data.posts ? [] : data.posts);

  if ("error" in data.posts) {
    error = data.posts.error;
  }

  onMount(() => {
    const newPosts = new EventSource(`/u/${data.user}/watch.json`);
    newPosts.addEventListener('message', () => {
      invalidateAll();
    })
  })
</script>

<div class="prose w-full max-w-full pt-10">
  <h1>{data.user}'s Posts</h1>

  {#if error}
    <p class="text-red-500 text-center mt-5">{error}</p>
  {:else if posts.length === 0}
    <p class="text-center mt-5">No posts.</p>
  {/if}

  {#each posts as post}
    <Post {post} showname editable={data.user === post.username}></Post>
  {/each}
</div>
