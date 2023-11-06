<script lang="ts">
  import PostPreview from 'components/PostPreview.svelte';
  import ProfilePreview from 'components/ProfilePreview.svelte';
  import { goto } from '$app/navigation';

  import { page } from '$app/stores';
  import Searchbar from 'components/Searchbar.svelte';

  $: {
    let sort = $page.url.searchParams.get('sort');
    let date = $page.url.searchParams.get('date');

    if (sortOptions.includes(sort)) {
      selectedSortOption = sort;

      if (sort !== 'Latest') {
        selectedSortDateOption = 'Today';
        showSortDateOptions = true;
      }

      if (sort === 'Latest') {
        selectedSortDateOption = 'Today';
        showSortDateOptions = false;
      }

      if (sortDateOptions.includes(date)) {
        selectedSortDateOption = date;

        if (sort !== 'Latest') {
          selectedSortDateOption = date;
          showSortDateOptions = true;
        }

        if (sort === 'Latest') {
          selectedSortDateOption = 'Today';
          showSortDateOptions = false;
        }
      }
    } else {
      selectedSortOption = 'Latest';
      selectedSortDateOption = 'Today';
      showSortDateOptions = false;
    }
  }

  const handleFilter = async (sortDateOption) => {
    selectedSortDateOption = sortDateOption;

    let _url = '/p';

    if (selectedSortOption) {
      _url = `?sort=${selectedSortOption}`;
    }

    if (selectedSortDateOption) {
      _url = _url + `&date=${selectedSortDateOption}`;
    }

    goto(_url);
  }

  const handleSort = async (sortOption) => {
    selectedSortOption = sortOption;

    if (selectedSortOption === 'Latest') {
      selectedSortDateOption = 'Today';
      showSortDateOptions = false;
    } else {
      showSortDateOptions = true;
    }

    let _url = '/p';

    if (selectedSortOption) {
      _url = `?sort=${selectedSortOption}`;
    }

    if (selectedSortDateOption) {
      _url = _url + `&date=${selectedSortDateOption}`;
    }

    goto(_url);
  }

  let sortOptions = [
    'Latest',
    'Buys',
    'Shares',
    'Gifts',
    'Replies',
  ];
  let selectedSortOption = 'Latest';

  let showSortDateOptions = false;
  let sortDateOptions = [
    'Today',
    'This Week',
    'This Month',
    'This Year',
    'All Time',
    // Custom
  ];
  let selectedSortDateOption = 'Today';
</script>

<!-- {#if $page.data.session}
  <div class="flex flex-col gap-4">
    <PostSearch />
    <div class="flex gap-2 justify-between items-center">
      <TextXL>Posts</TextXL>
      <div class="flex gap-2">
        <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={() => invalidate('app:posts')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>
    <div id="sort" class="flex flex-col gap-4 bg-slate-900 rounded-lg p-4">
      <div class="flex flex-col gap-2 sm:items-center sm:flex-row">
        <span>Sort</span>
        <div class="flex flex-col sm:flex-row w-full">
          {#each sortOptions as sortOption}
            <button
              class={`font-bold first:rounded-t-lg last:rounded-b-lg sm:first:rounded-none sm:last:rounded-none sm:first:rounded-tl-lg sm:first:rounded-bl-lg sm:last:rounded-tr-lg sm:last:rounded-br-lg px-2 py-1 ${selectedSortOption === sortOption ? 'bg-slate-700' : 'bg-slate-800'}`}
              on:click={() => handleSort(sortOption)}
            >{sortOption}</button>
          {/each}
        </div>
      </div>
      {#if showSortDateOptions}
        <div class="flex flex-col gap-2 sm:items-center sm:flex-row">
          <span>Date</span>
          <div class="flex flex-col sm:flex-row w-full">
            {#each sortDateOptions as sortDateOption}
              <button
                class={`font-bold first:rounded-t-lg last:rounded-b-lg sm:first:rounded-none sm:last:rounded-none sm:first:rounded-tl-lg sm:first:rounded-bl-lg sm:last:rounded-tr-lg sm:last:rounded-br-lg px-2 py-1 ${selectedSortDateOption === sortDateOption ? 'bg-slate-700' : 'bg-slate-800'}`} 
                on:click={() => handleFilter(sortDateOption)}
              >{sortDateOption}</button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
    {#each $page.data.posts as post}
      <PostPreview {post} showParentPost />
    {/each}
  </div>
{:else}
  <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view posts</p>
{/if} -->

{#if $page.data.session}
  <div class="flex flex-col gap-4">
    <div class="flex bg-slate-900 rounded-lg p-4">
      <a class={`hover:underline hover:text-sky-500 px-2 py-1 font-bold self-start ${$page.url.search === '?view=posts' ? 'text-sky-500 pointer-events-none' : ''}`} href="/search?view=posts">Posts</a>
      <a class={`hover:underline hover:text-sky-500 px-2 py-1 font-bold self-start ${$page.url.search === '?view=users' ? 'text-sky-500 pointer-events-none' : ''}`} href="/search?view=users">Users</a>
    </div>
    {#if $page.url.search === '' || $page.url.search === '?view=posts' || $page.url.search.includes('?term=')}
      {#each $page.data.posts as post}
        <PostPreview {post} showParentPost />
      {/each}
    {:else if $page.url.search === '?view=users'}
      {#each $page.data.profiles as profile}
        <ProfilePreview {profile} />
      {/each}
    {/if}
  </div>
  <div class="flex flex-col gap-4">
    <Searchbar />
  </div>
{:else}
<div class="flex flex-col gap-4 w-60 sm:w-80">
  <p><a class="text-sky-500 hover:underline" href="/login">Sign in</a> to view</p>
</div>
{/if}