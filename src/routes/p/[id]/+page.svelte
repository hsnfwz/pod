<script lang="ts">
  import Post from 'components/Post.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import PostTextEditor from 'components/PostTextEditor.svelte';
  import TextXS from 'components/TextXS.svelte';

  import { page } from '$app/stores';
</script>

{#if $page.data.session}
  {#if $page.data.post}
    <div class="flex flex-col gap-4">
      <Post post={$page.data.post} />
      {#if $page.data.postReplies.length > 0}
        <div class="flex flex-col gap-4">
          {#each $page.data.postReplies as postReply}
            <PostPreview post={postReply} showParentPost={false} />
          {/each}
        </div>
      {:else}
        <TextXS>No Replies</TextXS>
      {/if}
    </div>
    {#if $page.data.session.user.id === $page.data.post.profile_id.id || $page.data.post.isBought || ($page.data.post.isShared && $page.data.post.isShared.status === 'CONFIRMED')}
      <div class="sticky top-4 h-min">
        <PostTextEditor post={$page.data.post} />
      </div>
    {/if}
  {/if}
{:else}
<div class="flex flex-col gap-4 w-60 sm:w-80">
  <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view</p>
</div>
{/if}