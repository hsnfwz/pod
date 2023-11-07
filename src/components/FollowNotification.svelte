<script>
  import { page } from '$app/stores';
    import TextBase from 'components/TextBase.svelte';
    import TextXS from 'components/TextXS.svelte';

  export let profile;
  export let profileFollow;

  let notificationDate;
  let notificationDateTimeUTC;
  let notificationDateUTC;

  $: {
    notificationDate = new Date(profileFollow.created_at);
    notificationDateTimeUTC = notificationDate.getTime();
    notificationDateUTC = new Date(notificationDateTimeUTC);
  }

  const handleAcceptClick = async () => {
    await Promise.all([
      $page.data.supabase.from('profile_follow').update({ status: 'CONFIRMED' }).match({ id: profileFollow.id }),
      $page.data.supabase.rpc('profile_increment', { row_id: profileFollow.sender_profile_id.id, row_column: 'following_count', increment_amount: 1 }),
      $page.data.supabase.rpc('profile_increment', { row_id: profileFollow.receiver_profile_id, row_column: 'follower_count', increment_amount: 1 }),
    ]);
  }

  const handleRejectClick = async () => {
    await $page.data.supabase.from('profile_follow').delete().match({ id: profileFollow.id });
  }
</script>

<div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 w-60 sm:w-80">
  {#if profileFollow.status === 'CONFIRMED'}
    <p class="self-start">
      <a class="group/profile flex self-start items-center gap-2" href={`/u/${profileFollow.sender_profile_id.username}`}>
        <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
        <span>{profileFollow.sender_profile_id.display_name}</span>
        {#if profileFollow.sender_profile_id.is_verified}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        {/if}
        <span class={`text-slate-500 ${profileFollow.sender_profile_id.username.length > 20 ? 'w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis' : ''} group-hover/profile:underline`}>@{profileFollow.sender_profile_id.username}</span>
      </a> followed you
    </p>
  {/if}
  {#if profileFollow.status === 'PENDING'}
    <p class="self-start">
      <a class="group/profile flex self-start items-center gap-2" href={`/u/${profileFollow.sender_profile_id.username}`}>
        <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
        <span>{profileFollow.sender_profile_id.display_name}</span>
        {#if profileFollow.sender_profile_id.is_verified}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        {/if}
        <span class={`text-slate-500 ${profileFollow.sender_profile_id.username.length > 20 ? 'w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis' : ''} group-hover/profile:underline`}>@{profileFollow.sender_profile_id.username}</span>
      </a> wants to follow you
    </p>
    <div class="flex gap-2">
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleAcceptClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>          
        <span>Confirm</span>
      </button>
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleRejectClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>          
        <span>Delete</span>
      </button>
    </div>
  {/if}
  <TextXS class="text-xs text-slate-500">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(notificationDateUTC))}</TextXS>
</div>