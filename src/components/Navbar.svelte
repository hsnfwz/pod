<script lang="ts">
  import { page } from '$app/stores';
  import { profile } from 'stores/profile';

  import TextXS from 'components/TextXS.svelte';

  let today = new Date();
  let tomorrow = new Date(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
    0,
    0,
    0,
    0,
  ));
  let coinsDate12Hour = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: true }).format(tomorrow);
  let coinsDate24Hour = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: false }).format(tomorrow);

  const handleSignOutClick = async () => {
    await $page.data.supabase.auth.signOut();
  }
</script>

<nav class="flex flex-col bg-slate-900 rounded-lg sticky top-4 h-min p-4 gap-4 w-[250px]">
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname === '/' ? 'pointer-events-none' : ''}`} href="/">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname === '/' ? 'fill-sky-500' : ''}`}>
      <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
    </svg>     
    <span class={`font-bold ${$page.url.pathname === '/' ? 'text-sky-500' : ''}`}>Home</span>
  </a>
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname === '/search' ? 'pointer-events-none' : ''}`} href="/search">  
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname === '/search' ? 'fill-sky-500' : ''}`}>
      <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
    </svg>
    <span class={`font-bold ${$page.url.pathname === '/search' ? 'text-sky-500' : ''}`}>Search</span>
  </a>
  {#if $page.url.pathname === '/search'}
    <div class="flex flex-col gap-2 ml-7">
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'posts' ? 'pointer-events-none text-sky-500' : ''}`} href="/search?view=posts">Posts</a>
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'users' ? 'pointer-events-none text-sky-500' : ''}`} href="/search?view=users">Users</a>
    </div>
  {/if}
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname.includes(`/u/${$profile.username}`) ? 'pointer-events-none' : ''}`} href={`/u/${$profile.username}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname.includes(`/u/${$profile.username}`) ? 'fill-sky-500' : ''}`}>
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
    <span class={`font-bold ${$page.url.pathname.includes(`/u/${$profile.username}`) ? 'text-sky-500' : ''}`}>Profile</span>
  </a>
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname === '/shop' ? 'pointer-events-none' : ''}`} href="/shop">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname === '/shop' ? 'fill-sky-500' : ''}`}>
      <path d="M2.879 7.121A3 3 0 007.5 6.66a2.997 2.997 0 002.5 1.34 2.997 2.997 0 002.5-1.34 3 3 0 104.622-3.78l-.293-.293A2 2 0 0015.415 2H4.585a2 2 0 00-1.414.586l-.292.292a3 3 0 000 4.243zM3 9.032a4.507 4.507 0 004.5-.29A4.48 4.48 0 0010 9.5a4.48 4.48 0 002.5-.758 4.507 4.507 0 004.5.29V16.5h.25a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5H3V9.032z" />
    </svg>
    <span class={`font-bold ${$page.url.pathname === '/shop' ? 'text-sky-500' : ''}`}>Shop</span>
  </a>
  {#if $page.url.pathname === '/shop'}
    <div class="flex flex-col gap-2 ml-7">
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'abilities' ? 'pointer-events-none text-sky-500' : ''}`} href="/shop?view=abilities">Abilities</a>
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'avatars' ? 'pointer-events-none text-sky-500' : ''}`} href="/shop?view=avatars">Avatars</a>
    </div>
  {/if}
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname === '/notifications' ? 'pointer-events-none' : ''}`} href="/notifications">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname === '/notifications' ? 'fill-sky-500' : ''}`}>
      <path fill-rule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clip-rule="evenodd" />
    </svg>
    <span class={`font-bold ${$page.url.pathname === '/notifications' ? 'text-sky-500' : ''}`}>Notifications</span>
  </a>
  {#if $page.url.pathname === '/notifications'}
    <div class="flex flex-col gap-2 ml-7">
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'follows' ? 'pointer-events-none text-sky-500' : ''}`} href="/notifications?view=follows">Follows</a>
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'shares' ? 'pointer-events-none text-sky-500' : ''}`} href="/notifications?view=shares">Shares</a>
      <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.searchParams.get('view') === 'gifts' ? 'pointer-events-none text-sky-500' : ''}`} href="/notifications?view=gifts">Gifts</a>
    </div>
  {/if}
  <a class={`flex gap-2 items-center px-2 py-1 hover:bg-slate-800 rounded-lg ${$page.url.pathname === '/settings' ? 'pointer-events-none' : ''}`} href="/settings">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={`w-5 h-5 ${$page.url.pathname === '/settings' ? 'fill-sky-500' : ''}`}>
      <path fill-rule="evenodd" d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd" />
    </svg>
    <span class={`font-bold ${$page.url.pathname === '/settings' ? 'text-sky-500' : ''}`}>Settings</span>
  </a>
  <button on:click={handleSignOutClick} type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
      <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" />
    </svg>      
    <span>Sign Out</span>
  </button>
  <div class="w-full h-[2px] bg-slate-800 rounded-full"></div>
  <div class="flex gap-2">
    <span class="flex items-center gap-2 px-2 py-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span class="font-bold text-xs">{$profile.coin_count}</span>
    </span>
    <span class="flex items-center gap-2 px-2 py-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span class="font-bold text-xs">{$profile.super_coin_count}</span>
    </span>
  </div>
  <div class="flex flex-col gap-2 px-2 py-1">
    <TextXS>You will receive 10 coins and 1 super coin every day at {coinsDate12Hour} | {coinsDate24Hour}</TextXS>
  </div>
</nav>
