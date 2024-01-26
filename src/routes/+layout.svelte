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
  - if a post is nsfw or spoiler, user should click reveal before seeing the content
  - check abilities when doing any activity
  - decrement profile super coin count on redeem
  - disable button if profile super coin coin is less than cost
  - if an account is private, mark posts by them as private so that only followers can view them and no the general public
  - live data updates/feedback throughout the app



  REVISIT
    - problems with report system
    -- it can be easily abused for simply not agreeing with something
    -- needs people to review what was reported

    - problems with a vote system
    -- it can be easily abused for simply not agreeing with something
    -- not everyone will vote safe or unsafe

    - police system
    -- users can apply to be a police officer
    -- each officer would agree to the rules and that breaking them would result in an temporary ban
    -- each officer would specialize in a field (ex: hate speech, fake news, etc.)
    -- each officer would have access to a page containing all reported posts
    -- each officer would confirm (reward user) or reject (penalize and temporarily ban user) a report by a user
    -- each officer would go through a review process every period of time
    -- each officer would have a badge on their account
    -- each officer earns coins and super coins for their efforts
    -- officers can also report content for other officers to review
    -- each user can see which officer reviewed their post - helps in case an officer abuses power and needs to be reported by the user

    - problems with a police system
    -- needs people to review what was reported
    -- requires constant performance reviews of the officers to ensure rules are being followed



  LOW PRIORITY
  - profile customizations through the shop (inspired by reddit and discord)
  - animations throughout

  - delete profiles (currently hiding on delete)
  - pause profiles (currently hiding on delete)

  - update posts (require tracking edit history)

  - show sort/filter
  - filter by custom date range
  - broadcast and broadcast count for each post
  - post media files and polls
  - setting to show 12 or 24 hour time
  - setting to show/hide nsfw and spoiler content
  - dark mode scrollbar

  - if a user changes their username, then any mentions in posts will have their outdated username - how should we handle this??
  - when mentioning someone with a question mark for asking them a question how should we handle it??
  - combine share and bought into 1 table called "redeemed" and status type of redeemed = (unlocked, sent)

  - supabase error handling
  - supabase RLS
  - optimize fetching/refreshing of data everywhere (limits, updating/loading state, etc.)

  - organize code (components, layouts, sublayouts, etc.)
-->
