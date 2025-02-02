<script>
  import { Temporal } from "temporal-polyfill";
  import { getRelativeTime } from "./util";
  import MarkdownIt from "markdown-it";

  /**
   * @type {{
   *  post: import('$lib/db.js').Post,
   *  editable?: boolean,
   *  showname?: boolean,
   * }}
   */
  let { post, editable, showname } = $props();

  const md = MarkdownIt({
    linkify: true,
  });
</script>

<div class="mt-4 text-sm">
  {#if showname}
    <a href={`/u/${post.username}`} class="link-hover pr-1">@{post.username}</a>
  {/if}
  {getRelativeTime(Temporal.ZonedDateTime.from(post.created))}
  {#if editable}<a href={`/u/${post.username}/p/${post.id}/edit`} class="link"
      >edit</a
    >{/if}
</div>
<div class="card card-bordered border-neutral p-4 mb-4">
  {@html md.render(post.content)}
</div>
