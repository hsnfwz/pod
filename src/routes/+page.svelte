<script lang="ts">
  import { page } from '$app/stores';

  import TextXL from 'components/TextXL.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import TextXS from 'components/TextXS.svelte';
  import { invalidate } from '$app/navigation';

  import PostTextEditor from 'components/PostTextEditor.svelte';
</script>

{#if $page.data.session}
  <div class="flex flex-col gap-4">
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
{:else}
  <div class="flex flex-col gap-4 w-60 sm:w-80">
    <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view</p>
  </div>
{/if}