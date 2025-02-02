<script>
  import Post from "$lib/Post.svelte";
  import PostEditor from "$lib/PostEditor.svelte";
  import { getAutoCompleteList } from "$lib/util";
  import MarkdownIt from "markdown-it";

  let { data, form } = $props();

  const viewableList = getAutoCompleteList(
    data.user ?? "",
    "error" in data.posts ? [] : data.posts,
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

{#if data.user}
  <h1 class="text-center text-5xl pb-5">The Broadcaster</h1>
  <form class="form-control" method="POST">
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

  <h1 class="text-center text-4xl pt-5">Recent Messages</h1>

  {#each "error" in data.posts ? [] : data.posts as post}
    <Post {post} editable={post.username === data.user} showname></Post>
  {/each}
{:else}
  <div class="prose w-full max-w-full pt-10">
    <h1 class="text-center mb-0 pb-0">Welcome to "The Broadcaster"</h1>
    <p class="text-center">
      If you need to remember something "broadcast" it to yourself
    </p>

    <p>
      This is essentially a website for sending things to yourself. For a long
      time I used things like Google Chat, but I wanted something quicker.
    </p>
    <p>
      Whether getting a link to your phone or sending a collaboration link. It
      just works.
    </p>

    <p>Plus it works from the command line or through a json api</p>

    <p>
      To get started <a href="/createuser">create an account</a> or
      <a href="/login">login</a>
    </p>
  </div>
{/if}
