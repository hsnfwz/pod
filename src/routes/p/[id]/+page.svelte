<script lang="ts">
  import Post from 'components/Post.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import PostTextEditor from 'components/PostTextEditor.svelte';
  import TextXL from 'components/TextXL.svelte';

  import { page } from '$app/stores';
  import { profile } from 'stores/profile';
    import ProfilePreview from 'components/ProfilePreview.svelte';

  const handleSendClick = async (follower) => {
    await $page.data.supabase.from('profile_share').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: follower.sender_profile_id.id, post_id: $page.data.post.id, status: 'PENDING' }]);
  }
</script>

{#if $page.data.post}
  <div class="w-[500px] flex flex-col gap-4">
    <Post post={$page.data.post} />
    {#if $page.data.session.user.id === $page.data.post.profile_id.id || $page.data.post.isBought || ($page.data.post.isShared && $page.data.post.isShared.status === 'CONFIRMED')}
      <div class="flex flex-col gap-4">
        <PostTextEditor post={$page.data.post} />
        {#if $page.data.followers.length > 0}
          <TextXL>Followers</TextXL>
          {#each $page.data.followers as follower}
            <ProfilePreview user={follower.sender_profile_id} />
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => await handleSendClick(follower)} disabled={$profile.coin_count === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
              </svg>
              <span>Send</span>
            </button>
          {/each}
        {/if}
      </div>
    {/if}
    {#if $page.data.postReplies.length > 0}
      <TextXL>Replies</TextXL>
      <div class="flex flex-col gap-4">
        {#each $page.data.postReplies as postReply}
          <PostPreview post={postReply} showParentPost={false} />
        {/each}
      </div>
    {/if}
  </div>
{/if}