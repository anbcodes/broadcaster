<script>
  import ToCItem from "./ToCItem.svelte";
  import ToCSection from "./ToCSection.svelte";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  /** @type {{mode: string}} */
  let { mode } = $props();
  mode = "json";
  /**
   * @param {string} s
   */
  const tech = (s) => (mode !== "user" ? s : "");
</script>

<ul class="menu">
  <div class="flex gap-2 items-center pb-3">
    Mode:
    <form method="POST" class="flex gap-2" use:enhance>
      <input type="hidden" name="url" value={page.url.href} />
      <!-- <button
        class="btn btn-outline btn-sm disabled:btn-active"
        disabled={mode === "user"}
        name="mode"
        value="user">User</button
      > -->
      <button
        class="btn btn-outline btn-sm disabled:btn-active"
        disabled={mode === "json"}
        name="mode"
        value="json">JSON</button
      >
      <!-- <button
        class="btn btn-outline btn-sm disabled:btn-active"
        disabled={mode === "text"}
        name="mode"
        value="text">Text</button
      > -->
    </form>
  </div>
  <ToCItem href="/docs/">Overview</ToCItem>
  <ToCItem href="/docs/{mode}">Getting Started</ToCItem>
  <ToCSection open title="Users">
    <ToCItem href="/docs/{mode}/users">Overview</ToCItem>
    <ToCItem href="/docs/{mode}/users#register">Registering</ToCItem>
    <ToCItem href="/docs/{mode}/users#login"
      >Logging In {tech("(Creating a session)")}</ToCItem
    >
    <ToCItem href="/docs/{mode}/users#logout"
      >Logging Out {tech("(Deleting a session)")}</ToCItem
    >
  </ToCSection>
  <ToCItem href="/docs/{mode}/feed">The Feed</ToCItem>
  <ToCSection open title="Posting">
    <ToCItem href="/docs/{mode}/posting">Overview</ToCItem>
    <ToCItem href="/docs/{mode}/posting#get">View a user's posts</ToCItem>
    <ToCItem href="/docs/{mode}/posting#create">Create a post</ToCItem>
    <ToCItem href="/docs/{mode}/posting#edit">Edit a post</ToCItem>
    <ToCItem href="/docs/{mode}/posting#permissions"
      >Setting the visibility of a post</ToCItem
    >
  </ToCSection>
  <ToCSection open title="Groups">
    <ToCItem href="/docs/{mode}/groups">Overview</ToCItem>
    <ToCItem href="/docs/{mode}/groups#create">Create a group</ToCItem>
    <ToCItem href="/docs/{mode}/groups#get-user">Get a user's groups</ToCItem>
    <ToCItem href="/docs/{mode}/groups#add-member">Add a member</ToCItem>
    <ToCItem href="/docs/{mode}/groups#remove-member">Remove a member</ToCItem>
    <ToCItem href="/docs/{mode}/groups#delete">Delete a group</ToCItem>
  </ToCSection>
</ul>
