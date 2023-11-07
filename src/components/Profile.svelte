<script>
  import { page } from '$app/stores';
  import TextBase from 'components/TextBase.svelte';
  import TextXS from 'components/TextXS.svelte';
  
  export let profile;

  const handleFollowClick = async () => {
    if (profile.is_private) {
      await $page.data.supabase.from('profile_follow').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: profile.id, status: 'PENDING' }]);
    } else {
      await Promise.all([
        $page.data.supabase.from('profile_follow').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: profile.id, status: 'CONFIRMED' }]),
        $page.data.supabase.rpc('profile_increment', { row_id: $page.data.session.user.id, row_column: 'following_count', increment_amount: 1 }),
        $page.data.supabase.rpc('profile_increment', { row_id: profile.id, row_column: 'follower_count', increment_amount: 1 }),
      ]);
    }
  }

  const handleCancelClick = async () => {
    await $page.data.supabase.from('profile_follow').delete().match({ sender_profile_id: $page.data.session.user.id, receiver_profile_id: profile.id });
  }

  const handleUnfollowClick = async () => {
    await Promise.all([
      $page.data.supabase.from('profile_follow').delete().match({ sender_profile_id: $page.data.session.user.id, receiver_profile_id: profile.id }),
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'following_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('profile_decrement', { row_id: profile.id, row_column: 'follower_count', decrement_amount: 1 }),
    ]);
  }

  const handleRemoveFollowerClick = async() => {
    await Promise.all([
      $page.data.supabase.from('profile_follow').delete().match({ id: profile.isFollower.id }),
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'follower_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('profile_decrement', { row_id: profile.isFollower.sender_profile_id, row_column: 'following_count', decrement_amount: 1 }),
    ]);
  }

  let profileDate;
  let profileDateTimeUTC;
  let profileDateUTC;

  $: {
    profileDate = new Date(profile.created_at);
    profileDateTimeUTC = profileDate.getTime();
    profileDateUTC = new Date(profileDateTimeUTC);
  }
</script>

<div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 w-60 sm:w-80">
  <div class="flex items-center gap-2">
    <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
    <span>{profile.display_name}</span>
    {#if profile.is_verified}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    {/if}
    <span class="text-slate-500 w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis group-hover/profile:underline">@{profile.username}</span>
  </div>
  <TextXS class="text-xs text-slate-500">Joined {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(profileDateUTC))}</TextXS>
  <TextBase>{profile.is_private ? 'Private Account' : 'Public Account'}</TextBase>
  <div class="flex gap-2">
    <TextBase><span class="font-bold">{profile.follower_count}</span> <TextXS><span class="text-slate-500">Followers</span></TextXS></TextBase>
    <TextBase><span class="font-bold">{profile.following_count}</span> <TextXS><span class="text-slate-500">Following</span></TextXS></TextBase>
  </div>
  {#if $page.data.session.user.id !== profile.id && !profile.isFollowing}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleFollowClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
      </svg>      
      <span>Follow</span>
    </button>
  {/if}
  {#if $page.data.session.user.id !== profile.id && profile.isFollowing && profile.isFollowing.status === 'PENDING'}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleCancelClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>      
      <span>Cancel</span>
    </button>
  {/if}
  {#if $page.data.session.user.id !== profile.id && profile.isFollowing && profile.isFollowing.status === 'CONFIRMED'}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleUnfollowClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0zM12.75 7.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
      </svg>      
      <span>Unfollow</span>
    </button>
  {/if}
  {#if $page.data.session.user.id !== profile.id && profile.isFollower && profile.isFollower.status === 'CONFIRMED'}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleRemoveFollowerClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0zM12.75 7.75a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
      </svg>      
      <span>Remove</span>
    </button>
  {/if}
</div>