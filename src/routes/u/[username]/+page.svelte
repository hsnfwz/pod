<script>
  import Profile from 'components/Profile.svelte';
  import TextXS from 'components/TextXS.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import ProfilePreview from 'components/ProfilePreview.svelte';
  import TextXL from 'components/TextXL.svelte';

  import { page } from '$app/stores';
</script>

{#if $page.data.session}
  {#if $page.data.profile}
    <div class="flex flex-col gap-4">
      <Profile profile={$page.data.profile} />
      {#if !$page.data.profile.is_private || $page.data.profile.id === $page.data.session.user.id || ($page.data.profile.is_private && $page.data.profile.isFollowing && $page.data.profile.isFollowing.status === 'CONFIRMED')}
        {#if $page.data.posts.length === 0}
          <TextXS>No Posts</TextXS>
        {:else}
          {#each $page.data.posts as post}
            <PostPreview {post} showParentPost />
          {/each}
        {/if}
      {/if}
    </div>
    <div class="flex flex-col gap-4">
      {#if !$page.data.profile.is_private || $page.data.profile.id === $page.data.session.user.id || ($page.data.profile.is_private && $page.data.profile.isFollowing && $page.data.profile.isFollowing.status === 'CONFIRMED')}  
        <TextXL>Followers</TextXL>
        {#if $page.data.followers.length === 0}
          <TextXS>No Followers</TextXS>
        {:else}
          {#each $page.data.followers as follower}
            <ProfilePreview profile={follower.sender_profile_id} />
          {/each}
        {/if}
        <TextXL>Following</TextXL>
        {#if $page.data.following.length === 0}
          <TextXS>No Following</TextXS>
        {:else}
          {#each $page.data.following as following}
            <ProfilePreview profile={following.receiver_profile_id} />
          {/each}
        {/if}
      {/if}
    </div>
  {/if}
{:else}
<div class="flex flex-col gap-4 w-60 sm:w-80">
  <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view</p>
</div>
{/if}