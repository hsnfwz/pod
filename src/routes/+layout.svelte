<script>
  import '../app.css';

  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import Navbar from 'components/Navbar.svelte';

  onMount(() => {
    const {
      data: { subscription },
    } = $page.data.supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== $page.data.session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => subscription.unsubscribe()
  });
</script>

<main class="flex justify-center gap-4 p-4">
  <Navbar />
  <slot />
</main>

<!--
  RESOURCES
    - https://vercel.com/guides/how-to-setup-cron-jobs-on-vercel
    - https://vercel.com/docs/functions/serverless-functions
    - https://vercel.com/docs/functions/edge-functions
    - free plan for vervel allows server functions that run up to 60s max



  HIGH PRIORITY
  - mark button as "sent" after a post is shared to the user AND insert a "confirmed" profile_share record instead of a "pending" profile_share record when resharing same post that has already been confirmed before by the receiver
  - auto-generate username/display name on sign up
  - update display name
  - update username
  - charge coin per search
  - if user bought a post, let them see the full body in the post preview
  - profile followers/following scroll with posts once they reach a certain length


  LOW PRIORITY
  - update posts (require tracking edit history)
  - delete profiles (currently hiding on delete)
  - filter by custom date range
  - broadcast and broadcast count for each post
  - upload media files, create polls
  - fix problems with logging in using magic email - seems to never work on first attempt
  - 404 page - handle call cases where post id or profile id provided does not exist, page does not exist, etc., loading pages to render when fetching/loading state, loading state when button clicked to avoid multiple clicks
  - supabase error handling
  - supabase RLS
  - optimize fetching/refreshing of data everywhere (limits, updating state, etc.)
  - fetch data in batches (either paginate or infinite scroll)
-->
