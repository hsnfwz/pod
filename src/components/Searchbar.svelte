<script>
  import { page } from '$app/stores';
  import ProfilePreview from 'components/ProfilePreview.svelte';
  import PostPreview from 'components/PostPreview.svelte';
  import TextXL from 'components/TextXL.svelte';

  let searchTerm = '';

  let profileResults = [];
  let postResults = [];

  let profiles = [];
  let posts = [];

  $: {
    if ($page.url.searchParams.get('term')) {
      handleSearchTerm($page.url.searchParams.get('term'));
    }
  }

  const handleSearchTerm = async (term) => {
    const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').textSearch('fts', `'${term}'`);
    profiles = profileRecords;
    const { data: postRecords } = await $page.data.supabase.from('post').select('*, profile_id (*)').match({ is_hidden: false }).textSearch('fts', `'${term}'`);
    posts = postRecords;

    searchTerm = term;
  }

  const handleSearchInput = async () => {
    profiles = [];
    posts = [];

    if (searchTerm.length > 0) {
      const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').textSearch('fts', `'${searchTerm}'`).limit(5);
      profileResults = profileRecords;
      const { data: postRecords } = await $page.data.supabase.from('post').select('*, profile_id (*)').match({ is_hidden: false }).textSearch('fts', `'${searchTerm}'`).limit(5);
      postResults = postRecords;
    } else {
      profileResults = [];
      postResults = [];
    }
  }

  const handleSearchClick = async () => {
    profileResults = [];
    postResults = [];

    if (searchTerm.length > 0) {
      const { data: profileRecords } = await $page.data.supabase.from('profile').select('*').textSearch('fts', `'${searchTerm}'`);
      profiles = profileRecords;
      const { data: postRecords } = await $page.data.supabase.from('post').select('*, profile_id (*)').match({ is_hidden: false }).textSearch('fts', `'${searchTerm}'`);
      posts = postRecords;
    } else {
      profiles = [];
      posts = [];
    }
  }

  const handleClearClick = () => {
    searchTerm = '';
    postResults = [];
    profileResults = [];
    posts = [];
    profiles = [];
  }

  function debounce(func, timeoutMilliseconds = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeoutMilliseconds);
    };
  }

  const handleSearch = debounce(handleSearchInput, 1000);
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-4 bg-slate-900 p-4 rounded-lg">
    <input minlength="1" maxlength="1000" autocomplete="off" type="text" placeholder="Search" class="w-full border-box rounded-lg bg-slate-800 p-2" bind:value={searchTerm} on:input={handleSearch} />
    <div class="flex gap-2">
      <button type="button" class="w-full justify-center items-center flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleSearchClick} disabled={searchTerm.length === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
        <span>Search</span>
      </button>
      <button type="button" class="w-full justify-center items-center flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleClearClick} disabled={searchTerm.length === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
        <span>Clear</span>
      </button>
    </div>
  </div>
</div>

{#if postResults.length > 0}
  <TextXL>Posts</TextXL>
  <div class="flex flex-col gap-4">
    {#each postResults as postResult}
      <PostPreview post={postResult} showParentPost />
    {/each}
  </div>
{/if}

{#if profileResults.length > 0}
  <div class="flex flex-col gap-4">
    <TextXL>Users</TextXL>
    {#each profileResults as profileResult}
      <ProfilePreview user={profileResult} />
    {/each}
  </div>
{/if}

{#if posts.length > 0}
  <div class="flex flex-col gap-4">
    <TextXL>Posts</TextXL>
    {#each posts as post}
      <PostPreview {post} showParentPost />
    {/each}
  </div>
{/if}

{#if profiles.length > 0}
  <div class="flex flex-col gap-4">
    <TextXL>Users</TextXL>
    {#each profiles as profile}
      <ProfilePreview user={profile} />
    {/each}
  </div>
{/if}