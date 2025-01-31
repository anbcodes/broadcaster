<script>
    import { enhance } from "$app/forms";
    import { Editor } from "@tiptap/core";
    import Placeholder from "@tiptap/extension-placeholder";
    import StarterKit from "@tiptap/starter-kit";
    import { onDestroy, onMount } from "svelte";
    import { Markdown } from "tiptap-markdown";

    /**
     * @type {{
     *    viewableAutocomplete: string[],
     *    content: string | undefined,
     *    viewableTo: string | undefined,
     *    user: string,
     * }}
     */
    let {viewableAutocomplete, content, viewableTo, user} = $props();
    /** @type {Editor|undefined} */
    let editor = $state();
    let element = $state();
    let textarea = $state();
    let formEl = $state();
    onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Markdown.configure({
                linkify: true,
            }), Placeholder.configure({ placeholder: 'Start typing...' })],
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
<textarea bind:this={textarea} name="content" placeholder="Next post" class="jsHidden textarea textarea-bordered"></textarea>
<label class="label pt-3" for="viewableTo">
    <span class="label-text">Viewable To</span>
    <div>
        <input type="text" list="viewable" name="viewableTo" value={viewableTo ?? 'none'} class="input input-bordered" />
        <div class="text-sm text-center"><a href="/u/{user}/groups">Manage Groups</a></div>
    </div>
    <datalist id="viewable">
        <option value="none"></option>
        <option value="all"></option>
        {#each viewableAutocomplete as autocomplete}
            <option value={autocomplete}></option>
        {/each}
    </datalist>
</label>


<style>
    :global(.tiptap) {
        @apply textarea textarea-bordered py-0;
    }

    :global(.tiptap h1:nth-child(1)) {
        @apply pt-6;
    }

</style>