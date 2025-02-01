<script>
  import { Temporal } from "temporal-polyfill";
  import markdownit from "markdown-it";
  import { getAutoCompleteList, getRelativeTime } from "$lib/util";
  import PostEditor from "$lib/PostEditor.svelte";

  const { data, form } = $props();

  let error = $state("");
  /** @type {import('$lib/db.js').Post[]}*/
  let posts = $state("error" in data.posts ? [] : data.posts);

  if ("error" in data.posts) {
    error = data.posts.error;
  }

  const sortedPosts = posts.sort((a, b) => {
    return Temporal.ZonedDateTime.compare(b.created, a.created);
  });

  const viewableList = getAutoCompleteList(
    data.user,
    posts,
    "error" in data.groups ? [] : data.groups
  );

  const md = markdownit({
    linkify: true,
  });

  /** @type {HTMLFormElement | undefined} */
  let formEl = $state();

  /**
   *
   * @param {Event} e
   */
  const postClipboard = async (e) => {
    e.preventDefault();
    const text = await navigator.clipboard.readText();
    if (formEl) {
      formEl.getElementsByTagName("textarea")[0].textContent = text;
      formEl.submit();
    }
  };
</script>

<div class="prose w-full max-w-full pt-10">
  <div class="text-sm pb-4"><a href="/">Home</a></div>
  <h1>{data.user}'s Posts</h1>
  {#if data.self}
    <form bind:this={formEl} class="form-control" method="POST">
      <PostEditor
        content={form?.content}
        viewableAutocomplete={viewableList}
        include={form?.include ?? ""}
        exclude={form?.exclude ?? ""}
        user={data.user}
      ></PostEditor>
      <div class="flex gap-10">
        <button type="submit" class="btn mt-5 flex-grow">Post Content</button>
        <button onclick={postClipboard} class="btn mt-5 jsShown"
          >Post Clipboard</button
        >
      </div>
      {#if form?.error}
        <p class="text-red-500 text-center mt-5">{form?.error}</p>
      {/if}
    </form>
  {/if}

  {#if error}
    <p class="text-red-500 text-center mt-5">{error}</p>
  {:else if posts.length === 0}
    <p class="text-center mt-5">No posts.</p>
  {/if}

  {#each sortedPosts as post}
    <div class="mt-4 text-sm">
      {getRelativeTime(Temporal.ZonedDateTime.from(post.created))}
      {#if data.self}<a href={`./posts/${post.id}/edit`}>edit</a>{/if}
    </div>
    <div class="card card-bordered border-neutral p-4 mb-4">
      {@html md.render(post.content)}
    </div>
  {/each}
</div>
