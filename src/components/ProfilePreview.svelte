<script>
  import { page } from '$app/stores';
    import TextBase from 'components/TextBase.svelte';
    import TextXs from 'components/TextXS.svelte';
  
  export let profile;
</script>

<a href={`/u/${profile.username}`} class="group w-60 sm:w-80">
  <div class="flex flex-col bg-slate-900 border-2 border-slate-800 p-4 rounded-lg  gap-4 group-hover:border-sky-500">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-slate-500"></div>
      <TextBase>{profile.username}</TextBase>
      {#if profile.is_verified}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
      {/if}
    </div>
    <div class="flex gap-2">
      <TextBase><span class="font-bold">{profile.follower_count}</span> <span class="text-slate-500">Followers</span></TextBase>
      <TextBase><span class="font-bold">{profile.following_count}</span> <span class="text-slate-500">Following</span></TextBase>
    </div>
  </div>
</a>