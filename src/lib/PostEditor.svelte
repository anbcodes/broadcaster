<script>
  import { enhance } from "$app/forms";
  import { Editor } from "@tiptap/core";
  import Placeholder from "@tiptap/extension-placeholder";
  import StarterKit from "@tiptap/starter-kit";
  import { onDestroy, onMount } from "svelte";
  import { Markdown } from "tiptap-markdown";
  import ChipInput from "./ChipInput.svelte";

  /**
   * @type {{
   *    viewableAutocomplete: string[],
   *    content: string | undefined,
   *    include: string | undefined,
   *    exclude: string | undefined,
   *    user: string,
   * }}
   */
  let { viewableAutocomplete, content, include, exclude, user } = $props();
  /** @type {Editor|undefined} */
  let editor = $state();
  let element = $state();
  let textarea = $state();
  let formEl = $state();
  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Markdown.configure({
          linkify: true,
        }),
        Placeholder.configure({ placeholder: "Start typing..." }),
      ],
      content: content,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        textarea.textContent = editor.storage.markdown.getMarkdown();
      },
    });
    textarea.textContent = content;
  });

  $effect(() => {
    if (editor) {
      editor.setOptions({
        content: content,
      });
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div bind:this={element} class="prose w-full max-w-full jsShown"></div>
<textarea
  bind:this={textarea}
  name="content"
  placeholder="Next post"
  class="jsHidden textarea textarea-bordered"
></textarea>
<label
  class="input input-bordered flex items-center gap-2 mt-2"
  id="include-label"
  for="include"
>
  Visibility
  <ChipInput
    class="flex-grow"
    chipOptions={["just you", "everyone", ...viewableAutocomplete]}
    value={include ?? "just you"}
    placeholder="just you"
    name="include"
    labelid="include-label"
  ></ChipInput>
  <div class="text-sm text-center">
    <a href="/u/{user}/groups">Manage Groups</a>
  </div>
  <datalist id="include-list">
    <option value="just you"></option>
    <option value="everyone"></option>
    {#each viewableAutocomplete as autocomplete}
      <option value={autocomplete}></option>
    {/each}
  </datalist>
</label>
<div>Prefix groups with '#' and users with '@'. Ex: @anbcodes, #school</div>
<details
  class="dropdown [&_.isopenhidden]:open:hidden [&_.isopenshown]:open:inline mt-1"
>
  <summary class="btn btn-link btn-xs">
    <span class="isopenhidden">Show exclude list</span>
    <span class="hidden isopenshown">Hide exclude list</span>
  </summary>
  <ChipInput
    class="input input-bordered inline-flex items-center gap-2"
    chipOptions={["everyone", ...viewableAutocomplete]}
    value={exclude ?? ""}
    placeholder=""
    name="exclude"
    labelid="none"
  ></ChipInput>
  <!-- <input type="text" list="exclude-list" name="exclude" value={exclude ?? ''} class="input input-bordered" /> -->
</details>

<style>
  :global(.tiptap) {
    @apply textarea textarea-bordered py-0;
  }

  :global(.tiptap h1:nth-child(1)) {
    @apply pt-6;
  }
</style>
