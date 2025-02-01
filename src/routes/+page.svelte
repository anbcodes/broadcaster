<script>
    let {data} = $props();
</script>

<div class="prose w-full max-w-full pt-10">
    <h1 class="text-center mb-0 pb-0">Welcome to "The Broadcaster"</h1>
    <p class="text-center">If you need to remember something "broadcast" it to yourself</p>

    <p>This is essentially a website for sending things to yourself. For a long time I used things like Google Chat, but I wanted something quicker.</p>
    <p>Whether getting a link to your phone or sending a collaboration link. It just works.</p>

    <p>Plus it works from the command line or through a json api</p>

    {#if data.user}
    <p><a href='/u/{data.user}/posts'>Your posts</a></p>
    {:else}
    <p>To get started <a href="/createuser">create an account</a> or <a href="/login">login</a></p>
    {/if}
</div>
