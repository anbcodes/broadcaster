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
   *    clear?: () => void,
   * }}
   */
  let {
    viewableAutocomplete,
    content,
    include,
    exclude,
    user,
    clear = $bindable(),
  } = $props();
  /** @type {Editor|undefined} */
  let editor = $state();
  let element = $state();
  /** @type {HTMLTextAreaElement | undefined} */
  let textarea = $state();
  let formEl = $state();

  clear = () => {
    editor?.commands.setContent("");
    if (textarea) textarea.textContent = "";
    formEl?.reset();
  };

  onMount(() => {
    editor = new Editor({
      element: element,
      injectCSS: false,
      editorProps: {
        attributes: {
          class: "",
        },
      },
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
        if (!textarea) return;
        textarea.textContent = editor.storage.markdown.getMarkdown();
      },
    });
    if (!textarea) return;
    textarea.textContent = content ?? null;
    textarea.addEventListener("change", () => {
      editor?.commands.setContent(textarea?.textContent ?? "");
    });
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

<div
  bind:this={element}
  class="prose leading-tight w-full max-w-full jsVisible"
></div>
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
    value={include ?? ""}
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
    class="input input-bordered inline-flex items-center gap-2 max-w-[300px]"
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
    @apply textarea textarea-bordered py-0 prose leading-tight max-w-full;
  }

  :global(.tiptap h1:nth-child(1)) {
    @apply pt-6;
  }
</style>
