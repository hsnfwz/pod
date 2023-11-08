<script>
  import { page } from '$app/stores';

  import TextXL from 'components/TextXL.svelte';
  import { profile } from 'stores/profile';

  let isLoading = false;
  let isMagicLinkSent = false;

  let email = $page.data.session.user.email;
  let username = $profile.username;
  let displayName = $profile.display_name;
  let pauseAccountConfirmation = '';
  let deleteAccountConfirmation = '';

  let emailError = '';
  let usernameError = '';
  let showEmailError = false;
  let showUsernameError = false;
  let showUsernameMessage = false;
  let showDisplayNameMessage = false;

  const handleEmail = async () => {
    isLoading = true;

    const { data, error } = await $page.data.supabase.auth.updateUser({
      email,
      options: {
        emailRedirectTo: `${$page.url.origin}/settings`,
      },
    });

    if (error) {
      emailError = email;
      showEmailError = true;
    } else {
      isMagicLinkSent = true;
      showEmailError = false;
    }

    isLoading = false;
  }

  const handleUsername = async () => {
    isLoading = true;

    if (/^[a-zA-Z0-9_.-]+$/.test(username)) {
      const { data, error } = await $page.data.supabase.from('profile').update({ username }).match({ id: $page.data.session?.user.id });

      if (error) {
        usernameError = username;
        showUsernameError = true;
      } else {
        showUsernameMessage = false;
        showUsernameError = false;
      }
    } else {
      showUsernameMessage = true;
    }

    isLoading = false;
  }

  const handleDisplayName = async () => {
    isLoading = true;

    if (/^[a-zA-Z0-9 _.-]+$/.test(displayName)) {
      await $page.data.supabase.from('profile').update({ display_name: displayName }).match({ id: $page.data.session?.user.id });
      showDisplayNameMessage = false;
    } else {
      showDisplayNameMessage = true;
    }

    isLoading = false;
  }

  const handlePauseAccount = async () => {

  }

  const handleDeleteAccount = async () => {

  }

  $: if (showUsernameError) setTimeout(() => showUsernameError = false, 3000);
</script>

<div class="w-[500px] flex flex-col gap-4">
  <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
    <div class="flex flex-col gap-4">
      <TextXL><label for="email">Email</label></TextXL>
      <input minlength="3" maxlength="320" autocomplete="off" id="email" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={email} />
    </div>
    {#if email.length === 320}
      <span class="italic">Email limit reached (320 characters)</span>
    {/if}
    {#if showEmailError}
      <span class="italic text-rose-500">Email already exists</span>
    {/if}
    {#if isMagicLinkSent}
      <p>A magic link has been sent to <span class="font-bold">{email}</span>. Please click on the magic link sent to your email to complete updating your email</p>
    {/if}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || email.length === 0 || email.trim() === $page.data.session.user.email || email === emailError || isMagicLinkSent} on:click={handleEmail}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
      </svg>
      <span>Update Email</span>
    </button>
  </form>
  <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
    <div class="flex flex-col gap-4">
      <TextXL><label for="username">Username</label></TextXL>
      <input minlength="1" maxlength="40" autocomplete="off" id="username" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={username} />
    </div>
    {#if username.length === 40}
      <span class="italic">Username limit reached (40 characters)</span>
    {/if}
    {#if showUsernameMessage}
      <span class="italic text-rose-500">Username must only contain letters, numbers, underscores, periods, and hyphens</span>
    {/if}
    {#if showUsernameError}
      <span class="italic text-rose-500">Username already exists</span>
    {/if}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || username.length === 0 || username.trim() === $profile.username || username === usernameError} on:click={handleUsername}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
      </svg>
      <span>Update Username</span>
    </button>
  </form>
  <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
    <div class="flex flex-col gap-4">
      <TextXL><label for="displayName">Display Name</label></TextXL>
      <input minlength="1" maxlength="40" autocomplete="off" id="displayName" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={displayName} />
    </div>
    {#if displayName.length === 40}
      <span class="italic">Display name limit reached (40 characters)</span>
    {/if}
    {#if showDisplayNameMessage}
      <span class="italic text-rose-500">Display name must only contain letters, numbers, underscores, periods, hyphens, and spaces</span>
    {/if}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || displayName.length === 0 || displayName.trim() === $profile.display_name} on:click={handleDisplayName}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
      </svg>
      <span>Update Display Name</span>
    </button>
  </form>
  <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
    <TextXL><label for="pauseAccount">Pause Account</label></TextXL>
    <div class="flex flex-col gap-4">
      <label for="pauseAccount">Type <span class="font-bold text-sky-500">Pause Account</span> to pause account and all activity. You can unpause and restore your account and all activity when you are ready</label>
      <input autocomplete="off" id="pauseAccount" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={pauseAccountConfirmation} />
    </div>
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || pauseAccountConfirmation.length === 0 || pauseAccountConfirmation !== 'Pause Account'} on:click={handlePauseAccount}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
      </svg>
      <span>Pause Account</span>
    </button>
  </form>
  <form class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
    <TextXL><label for="deleteAccount">Delete Account</label></TextXL>
    <div class="flex flex-col gap-4">
      <label for="deleteAccount">Type <span class="font-bold text-rose-500">Delete Account</span> to delete account and all activity. This action cannot be undone</label>
      <input autocomplete="off" id="deleteAccount" type="text" placeholder="" class={`border-box rounded-lg bg-slate-800 p-2`} bind:value={deleteAccountConfirmation} />
    </div>
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" disabled={isLoading || deleteAccountConfirmation.length === 0 || deleteAccountConfirmation !== 'Delete Account'} on:click={handleDeleteAccount}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
      </svg>
      <span>Delete Account</span>
    </button>
  </form>
</div>
