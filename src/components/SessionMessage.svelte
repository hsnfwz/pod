<script lang="ts">
  import { page } from '$app/stores';
  import TextXL from 'components/TextXL.svelte';
    import TextXS from 'components/TextXS.svelte';
  import TextBase from './TextBase.svelte';

  let isLoading = false;
  let email = '';
  let isMagicLinkSent = false;

  const handleSignInClick = async () => {
    isLoading = true;

    const { error } = await $page.data.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${$page.url.origin}/auth/callback`,
      },
    });

    isLoading = false;
    isMagicLinkSent = true;
  }
</script>

<div class="w-full h-screen absolute top-0 left-0 flex flex-col gap-8 justify-center items-center">
  <div class="flex flex-col gap-4 w-60 sm:w-80">
    <TextXL>Welcome to <span class="text-amber-500">pod</span></TextXL>
    <TextBase>Sign in to get started</TextBase>
    <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
      {#if isMagicLinkSent}
        <p>A magic link has been sent to <span class="font-bold">{email}</span>. Please click on the magic link sent to your email to sign in</p>
      {:else}
        <div class="flex flex-col gap-2">
          <TextXL><label for="email">Email</label></TextXL>
          <input minlength="3" maxlength="320" autocomplete="off" id="email" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={email} />
        </div>
        {#if email.length === 320}
          <span class="italic">Email limit reached (320 characters)</span>
        {/if}
        <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || email.length < 3} on:click={handleSignInClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clip-rule="evenodd" />
          </svg>        
          <span>Sign In</span>
        </button>
      {/if}
    </form>
    <TextXS>By signing in, you agree to our <a class="text-sky-500 hover:underline" href="/info/terms-of-service">Terms of Service</a></TextXS>
  </div>
</div>
