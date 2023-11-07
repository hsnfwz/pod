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
  - redesign website to be even simpler and not look like every twitter alternative out there
  - mark button as "sent" after a post is shared to the user AND insert a "confirmed" profile_share record instead of a "pending" profile_share record when resharing same post that has already been confirmed before by the receiver
  - change gifting to super coins instead of regular coins
  - create the super coin store
  - create report feature and post stats for safety
  - if user bought a post, let them see the full body in the post preview
  - show 12 and 24 hour time all around the app or maybe just a profile setting for preference

  LOW PRIORITY
  - live data updates throughout the app
  - update posts (require tracking edit history)
  - delete profiles (currently hiding on delete)
  - pause profiles (currently hiding on delete)
  - filter by custom date range
  - broadcast and broadcast count for each post
  - upload media files, create polls
  - fix problems with logging in using magic email - seems to never work on first attempt
  - supabase error handling
  - supabase RLS
  - optimize fetching/refreshing of data everywhere (limits, updating/loading state, etc.)
  - fetch data in batches (either paginate or infinite scroll)
-->
