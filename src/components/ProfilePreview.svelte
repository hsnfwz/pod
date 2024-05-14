<script>
  import TextBase from 'components/TextBase.svelte';
  
  export let user;
</script>

<a href={`/u/${user.username}`} class="group">
  <div class="rounded-lg bg-slate-900 group-hover:rainbow p-1">
    <div class="flex flex-col p-4 gap-4 rounded-md bg-black">
      <div class="flex items-center gap-2">
        <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
        <span>{user.display_name}</span>
        {#if user.is_verified}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        {/if}
        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-sky-500">
          <path fill-rule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75zm4.196 5.954a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg> -->
        <span class="text-slate-500 w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis group-hover/profile:underline">@{user.username}</span>
      </div>
      <div class="flex gap-2">
        <TextBase><span class="font-bold">{user.follower_count}</span> <span class="text-slate-500">Followers</span></TextBase>
        <TextBase><span class="font-bold">{user.following_count}</span> <span class="text-slate-500">Following</span></TextBase>
      </div>
    </div>
  </div>
</a>