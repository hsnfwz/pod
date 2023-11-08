<script>
    import TextBase from 'components/TextBase.svelte';
    import TextXS from 'components/TextXS.svelte';

  export let profile;
  export let profileGift;

  let notificationDate;
  let notificationDateTimeUTC;
  let notificationDateUTC;

  $: {
    notificationDate = new Date(profileGift.created_at);
    notificationDateTimeUTC = notificationDate.getTime();
    notificationDateUTC = new Date(notificationDateTimeUTC);
  }
</script>

<div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4">
  <p class="self-start">
    You received a super coin from
    <a class="group/profile flex self-start items-center gap-2" href={`/u/${profileGift.sender_profile_id.username}`}>
      <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
      <span>{profileGift.sender_profile_id.display_name}</span>
      {#if profileGift.sender_profile_id.is_verified}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
      {/if}
      <span class={`text-slate-500 ${profileGift.sender_profile_id.username.length > 20 ? 'w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis' : ''} group-hover/profile:underline`}>@{profileGift.sender_profile_id.username}</span>
    </a>
    for your <a class="hover:text-sky-500 hover:underline" href={`/p/${profileGift.post_id}`}>post <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-5 h-5">
      <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
      <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
    </svg></a>
  </p>
  <TextXS class="text-xs text-slate-500">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(notificationDateUTC))}</TextXS>
</div>