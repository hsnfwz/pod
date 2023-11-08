<script>
  import '../app.css';

  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import Navbar from 'components/Navbar.svelte';
  import SessionMessage from 'components/SessionMessage.svelte';
  import { profile } from 'stores/profile';

  let isLoading = false;

  onMount(async () => {
    isLoading = true;

    const { data: { subscription } } = $page.data.supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== $page.data.session?.expires_at) {
        invalidate('supabase:auth')
      }
    });

    if ($page.data.session) {
      const { data } = await $page.data.supabase
      .from('profile')
      .select('*')
      .match({ id: $page.data.session.user.id });

      profile.set(data[0]);

      $page.data.supabase
      .channel('profile-channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profile', filter: `id=eq.${$page.data.session.user.id}` }, (payload) => profile.set(payload.new))
      .subscribe();
    }

    isLoading = false;

    return () => {
      subscription.unsubscribe();
    }
  });
</script>


<main class="flex justify-center gap-4 p-4">
  {#if isLoading}
    <p>Loading...</p>
  {:else if !isLoading && $page.data.session && $profile}
    <Navbar />
    <slot />
  {:else if !isLoading && !$page.data.session && !$profile}
    {#if $page.url.pathname.includes('/i')}
      <slot />
    {:else}
      <SessionMessage />
    {/if}
  {/if}
</main>

<!--
  HIGH PRIORITY
  - create the super coin store
  - create report feature and post stats for safety
  - live data updates/feedback throughout the app

  LOW PRIORITY
  - animations throughout

  - delete profiles (currently hiding on delete)
  - pause profiles (currently hiding on delete)

  - update posts (require tracking edit history)

  - show sort/filter
  - filter by custom date range
  - broadcast and broadcast count for each post
  - post media files and polls
  - show 12 or 24 hour time

  - if a user changes their username, then any mentions in posts will have their outdated username - how should we handle this??
  - when mentioning someone with a question mark for asking them a question how should we handle it??
  - combine share and bought into 1 table called "redeemed" and status type of redeemed = (unlocked, sent)

  - supabase error handling
  - supabase RLS
  - optimize fetching/refreshing of data everywhere (limits, updating/loading state, etc.)
-->
