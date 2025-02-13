<script>
  import { invalidateAll } from "$app/navigation";
  import Post from "$lib/Post.svelte";
  import { onMount } from "svelte";

  const { data } = $props();

  onMount(() => {
    const newPosts = new EventSource(`/u/${data.user}/watch.json`);
    newPosts.addEventListener("message", () => {
      invalidateAll();
    });
  });
</script>

<div class="prose w-full max-w-full pt-10">
  <h1>{data.user}'s Posts</h1>

  {#each data.posts as post}
    <Post {post} showname editable={data.user === post.username}></Post>
  {/each}
</div>
