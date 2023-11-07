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

<!--
  <div class="flex flex-col gap-4">
    <PostSearch />
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
  </div> -->

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