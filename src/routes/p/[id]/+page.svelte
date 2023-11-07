<script lang="ts">
  import Post from 'components/Post.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import PostTextEditor from 'components/PostTextEditor.svelte';
  import TextXS from 'components/TextXS.svelte';
  import TextXL from 'components/TextXL.svelte';
  import TextBase from 'components/TextBase.svelte';

  import { page } from '$app/stores';
  import { profile } from 'stores/profile';

  const handleSendClick = async (follower) => {
    await $page.data.supabase.from('profile_share').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: follower.sender_profile_id.id, post_id: post.id, status: 'PENDING' }]);
  }
</script>

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
    <div class="flex flex-col gap-4 sticky top-4 h-min">
      <PostTextEditor post={$page.data.post} />
      {#if $page.data.followers.length > 0}
        <TextXL>Followers</TextXL>
        <div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4">
          {#each $page.data.followers as follower}
            <div class="flex space-between gap-2">
              <div class="flex flex-grow">
                <a class="hover:underline flex items-center gap-2" href={`/u/${follower.sender_profile_id.username}`}>
                  <div class="w-8 h-8 rounded-full bg-slate-500"></div>
                  <TextBase>{follower.sender_profile_id.username}</TextBase>
                  {#if follower.sender_profile_id.is_verified}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                </a>
              </div>
              <div>
                <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => await handleSendClick(follower)} disabled={$profile.coin_count === 0}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                  </svg>
                  <span>Send</span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <TextXS>No followers</TextXS>
      {/if}
    </div>
  {/if}
{/if}