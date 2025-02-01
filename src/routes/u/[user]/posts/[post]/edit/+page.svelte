<script>
  import { Temporal } from "temporal-polyfill";
  import PostEditor from "$lib/PostEditor.svelte";
  import { getAutoCompleteList } from "$lib/util.js";

  const { data, form } = $props();

  data.posts.sort((a, b) => {
    return Temporal.ZonedDateTime.compare(b.created, a.created);
  });

  const post = data.posts.find((v) => v.id === +data.post);

  const viewableList = getAutoCompleteList(
    data.user,
    data.posts,
    "error" in data.groups ? [] : data.groups
  );

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
  <h1>Edit Post</h1>
  {#if data.self && post}
    <form bind:this={formEl} class="form-control" method="POST">
      <PostEditor
        content={form?.content ?? post.content}
        viewableAutocomplete={viewableList}
        include={form?.include ?? post.include.join(",")}
        exclude={form?.exclude ?? post.exclude.join(",")}
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
  {:else}
    404 - Not found (or not logged in)
  {/if}
</div>
