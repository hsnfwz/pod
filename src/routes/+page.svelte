<script lang="ts">
  import { page } from '$app/stores';

  import PostPreview from 'components/PostPreview.svelte';
  import PostTextEditor from 'components/PostTextEditor.svelte';
</script>

<div class="w-[500px] flex flex-col gap-4">
  <PostTextEditor />
  {#if $page.data.posts && $page.data.posts.length > 0}
    <div class="flex flex-col gap-4">
      {#each $page.data.posts as post}
        <PostPreview {post} showParentPost />
      {/each}
    </div>
  {/if}
</div>