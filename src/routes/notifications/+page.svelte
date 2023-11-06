<script>
  import FollowNotification from 'components/FollowNotification.svelte';
  import GiftNotification from 'components/GiftNotification.svelte';
  import ShareNotification from 'components/ShareNotification.svelte';
  import TextXS from 'components/TextXS.svelte';

  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let profileFollowNotifications = $page.data.profileFollow;
  let profileShareNotifications = $page.data.profileShare;
  let profileGiftNotifications = $page.data.profileGift;

  onMount(() => {
    if (!$page.data.session) return;

    const profileFollow = $page.data.supabase.channel('profile-follow-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'profile_follow', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      async (payload) => {
        const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').match({ id: payload.new.sender_profile_id });
        payload.new.sender_profile_id = profileRecords[0];
        profileFollowNotifications.unshift(payload.new);
        profileFollowNotifications = profileFollowNotifications;
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'profile_follow', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      (payload) => {
        const notificationIndex = profileFollowNotifications.findIndex(notification => notification.id === payload.old.id);
        profileFollowNotifications?.splice(notificationIndex, 1);
        profileFollowNotifications = profileFollowNotifications;
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profile_follow', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      (payload) => {
        const notificationIndex = profileFollowNotifications.findIndex(notification => notification.id === payload.new.id);
        profileFollowNotifications[notificationIndex].status = payload.new.status;
        profileFollowNotifications = profileFollowNotifications;
      }
    )
    .subscribe()
  });

  onMount(() => {
    if (!$page.data.session) return;

    const profileShare = $page.data.supabase.channel('profile-share-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'profile_share', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      async (payload) => {
        const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').match({ id: payload.new.sender_profile_id });
        payload.new.sender_profile_id = profileRecords[0];
        profileShareNotifications.unshift(payload.new);
        profileShareNotifications = profileShareNotifications;
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'profile_share', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      (payload) => {
        const notificationIndex = profileShareNotifications.findIndex(notification => notification.id === payload.old.id);
        profileShareNotifications?.splice(notificationIndex, 1);
        profileShareNotifications = profileShareNotifications;
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profile_share', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      (payload) => {
        const notificationIndex = profileShareNotifications.findIndex(notification => notification.id === payload.new.id);
        profileShareNotifications[notificationIndex].status = payload.new.status;
        profileShareNotifications = profileShareNotifications;
      }
    )
    .subscribe()
  });

  onMount(() => {
    if (!$page.data.session) return;

    const profileGift = $page.data.supabase.channel('profile-gift-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'profile_gift', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      async (payload) => {
        const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').match({ id: payload.new.sender_profile_id });
        payload.new.sender_profile_id = profileRecords[0];
        profileGiftNotifications.unshift(payload.new);
        profileGiftNotifications = profileGiftNotifications;
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'profile_gift', filter: `receiver_profile_id=eq.${$page.data.session.user.id}` },
      (payload) => {
        const notificationIndex = profileGiftNotifications.findIndex(notification => notification.id === payload.old.id);
        profileGiftNotifications?.splice(notificationIndex, 1);
        profileGiftNotifications = profileGiftNotifications;
      }
    )
    .subscribe()
  });
</script>

{#if $page.data.session}
  <div class="flex flex-col gap-4">
    <div class="flex bg-slate-900 rounded-lg p-4">
      <a class={`hover:underline hover:text-sky-500 px-2 py-1 font-bold self-start ${$page.url.search === '?view=follows' ? 'text-sky-500 pointer-events-none' : ''}`} href="/notifications?view=follows">Follows</a>
      <a class={`hover:underline hover:text-sky-500 px-2 py-1 font-bold self-start ${$page.url.search === '?view=shares' ? 'text-sky-500 pointer-events-none' : ''}`} href="/notifications?view=shares">Shares</a>
      <a class={`hover:underline hover:text-sky-500 px-2 py-1 font-bold self-start ${$page.url.search === '?view=gifts' ? 'text-sky-500 pointer-events-none' : ''}`} href="/notifications?view=gifts">Gifts</a>
    </div>

    {#if $page.url.search === '' || $page.url.search === '?view=follows'}
      <div class="flex flex-col gap-4">
        {#if profileFollowNotifications.length > 0}
          {#each profileFollowNotifications as profileFollowNotification}
            <FollowNotification profileFollow={profileFollowNotification} profile={$page.data.session.profile} />
          {/each}
        {:else}
          <div class="w-60 sm:w-80">
            <TextXS>No Notifications</TextXS>
          </div>
        {/if}
      </div>
    {:else if $page.url.search === '?view=shares'}
      <div class="flex flex-col gap-4">
        {#if profileShareNotifications.length > 0}
          {#each profileShareNotifications as profileShareNotification}
            <ShareNotification profileShare={profileShareNotification} profile={$page.data.session.profile} />
          {/each}
        {:else}
          <div class="w-60 sm:w-80">
            <TextXS>No Notifications</TextXS>
          </div>
        {/if}
      </div>
    {:else if $page.url.search === '?view=gifts'}
      <div class="flex flex-col gap-4">
        {#if profileGiftNotifications.length > 0}
          {#each profileGiftNotifications as profileGiftNotification}
            <GiftNotification profileGift={profileGiftNotification} profile={$page.data.session.profile} />
          {/each}
        {:else}
          <div class="w-60 sm:w-80">
            <TextXS>No Notifications</TextXS>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{:else}
<div class="flex flex-col gap-4 w-60 sm:w-80">
  <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view</p>
</div>
{/if}