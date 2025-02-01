<script>
    import { Temporal } from "temporal-polyfill";
    import PostEditor from "$lib/PostEditor.svelte";

    const { data, form } = $props();

    data.posts.sort((a, b) => {
        return Temporal.ZonedDateTime.compare(b.created, a.created);
    });

    const post = data.posts.find(v => v.id === +data.post);

    console.log(post);
    
    const usersReferenced = data.posts.map(post => {
        const matches = post.viewableto.matchAll(/u:([a-zA-Z0-9]+)/g);
        if (matches) {
            return [...matches].map(match => match.slice(2));
        }
        return [];
    }).flat(2).filter((value, index, self) => {
        return self.indexOf(value) === index && value !== data.user;
    });

    const viewableList = usersReferenced.map(user => {
        return `u:${user}`;
    }).concat(data.groups.map(v=>`g:${v.name}`));

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
            formEl.getElementsByTagName('textarea')[0].textContent = text;
            formEl.submit();
        }
    }
</script>

<div class="prose w-full max-w-full pt-10">
    <h1>Edit Post</h1>
    {#if data.self && post}
    <form bind:this={formEl} class="form-control" method="POST">
        <PostEditor content={form?.content ?? post.content} viewableAutocomplete={viewableList} viewableTo={form?.viewableTo ?? post.viewableto} user={data.user}></PostEditor>
        <div class="flex gap-10">
            <button type="submit" class="btn mt-5 flex-grow">Post Content</button>
            <button onclick={postClipboard} class="btn mt-5 jsShown">Post Clipboard</button>
        </div>
        {#if form?.error}
            <p class="text-red-500 text-center mt-5">{form?.error}</p>
        {/if}
    </form>
    {:else}
        404 - Not found (or not logged in)
    {/if}
</div>
