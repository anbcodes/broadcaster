<script>
  import Post from "$lib/Post.svelte";

  const { data } = $props();

  let error = $state("");
  /** @type {import('$lib/db.js').Post[]}*/
  let posts = $state("error" in data.posts ? [] : data.posts);

  if ("error" in data.posts) {
    error = data.posts.error;
  }
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
