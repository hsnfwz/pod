<script lang="ts">
  import { page } from '$app/stores';

  import PostPreview from 'components/PostPreview.svelte';
  import TextXS from 'components/TextXS.svelte';
  import PostTextEditor from 'components/PostTextEditor.svelte';
</script>

<div class="flex flex-col gap-4 w-60 sm:w-80">
  {#if $page.data.posts.length > 0}
    {#each $page.data.posts as post}
      <PostPreview {post} />
    {/each}
  {:else}
    <TextXS>No posts</TextXS>
  {/if}
</div>
<div class="sticky top-4 h-min">
  <PostTextEditor />
</div>