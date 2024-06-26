<script lang="ts">
  export let post;

  import { page } from '$app/stores';
  import { profile } from 'stores/profile';

  import TextXS from 'components/TextXS.svelte';
  import TextBase from 'components/TextBase.svelte';

  let postDate;
  let postDateTimeUTC;
  let postDateUTC;

  let yes = 0;
  let no = 0;

  $: {
    postDate = new Date(post.created_at);
    postDateTimeUTC = postDate.getTime();
    postDateUTC = new Date(postDateTimeUTC);
  }

  $: {
    yes = (post.safe_count / (post.safe_count + post.unsafe_count)) * 100 || 0;
    no = (post.unsafe_count / (post.safe_count + post.unsafe_count)) * 100 || 0;
  }

  let bodyPreview:any = '';

  $: {
    let newBodyLines: string[] = [];
    let newBodyWords: string[] = [];

    post.body.split('\n').forEach((line: string) => {

      line.split(' ').forEach((word: string) => {
        if (word.startsWith('@')) {
          const username = word.replace('@', '');
          const href = `/u/${username}`;
          const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

          newBodyWords.push(newBodyWord);
        } else if (word.startsWith('#')) {
          const hashtag = word.replace('#', '');
          const href = `/search?term=${hashtag}`;
          const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

          newBodyWords.push(newBodyWord);
        } else {
          newBodyWords.push(word);
        }
      });

      const newBodyLine = newBodyWords.join(' ');
      newBodyLines.push(newBodyLine);
      newBodyWords = [];
    });

    bodyPreview = newBodyLines.join('\n');
  }

  const handleAcceptClick = async () => {
    await Promise.all([
      $page.data.supabase.from('profile_share').update({ status: 'CONFIRMED' }).match({ id: post.isShared.id }),
      $page.data.supabase.rpc('profile_decrement', { row_id: post.isShared.sender_profile_id.id, row_column: 'coin_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'share_count', increment_amount: 1 }),
    ]);
  }

  const handleRejectClick = async () => {
    await $page.data.supabase.from('profile_share').delete().match({ id: post.isShared.id });
  }

  const handleBuyClick = async () => {
    await Promise.all([
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'coin_count', decrement_amount: 1 }),
      $page.data.supabase.from('profile_buy').insert([{ profile_id: $page.data.session.user.id, post_id: post.id }]),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'buy_count', increment_amount: 1 }),
    ]);
  }

  const handleGiftClick = async () => {
    await Promise.all([
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'super_coin_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('profile_increment', { row_id: post.profile_id.id, row_column: 'super_coin_count', increment_amount: 1 }),
      $page.data.supabase.from('profile_gift').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: post.profile_id.id, post_id: post.id }]),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'gift_count', increment_amount: 1 }),
    ]);
  }

  const handleYesClick = async () => {
    if (post.profileSafe && post.profileSafe.status === 'UNSAFE') {
      await Promise.all([
        $page.data.supabase.rpc('decrement', { table_name: 'post', row_id: post.id, row_column: 'unsafe_count', decrement_amount: 1 }),
        $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'safe_count', increment_amount: 1 }),
        $page.data.supabase.from('profile_safe').update({ status: 'SAFE' }).match({ id: post.profileSafe.id }),
      ]);
    } else {
      await Promise.all([
        $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'safe_count', increment_amount: 1 }),
        $page.data.supabase.from('profile_safe').insert([{ profile_id: $page.data.session.user.id, post_id: post.id, status: 'SAFE' }]),
      ]);
    }
  }

  const handleNoClick = async () => {
    if (post.profileSafe && post.profileSafe.status === 'SAFE') {
      await Promise.all([
        $page.data.supabase.rpc('decrement', { table_name: 'post', row_id: post.id, row_column: 'safe_count', decrement_amount: 1 }),
        $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'unsafe_count', increment_amount: 1 }),
        $page.data.supabase.from('profile_safe').update({ status: 'UNSAFE' }).match({ id: post.profileSafe.id }),
      ]);
    } else {
      await Promise.all([
        $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'unsafe_count', increment_amount: 1 }),
        $page.data.supabase.from('profile_safe').insert([{ profile_id: $page.data.session.user.id, post_id: post.id, status: 'UNSAFE' }]),
      ]);
    }
  }

  const handleDeletePostClick = async () => {
    // for now we will HIDE the post but eventually we will delete it (requires deleting other records that reference it)
    await $page.data.supabase.from('post').update({ is_hidden: true }).match({ id: post.id });
  }
</script>

<!-- <div class="flex flex-col bg-slate-900 p-4 rounded-lg  gap-4 group-hover:border-sky-500">
  <div class="flex flex-col gap-4 ">
    <TextXL>Is this post <a href="/safe" class="hover:underline text-sky-500">safe</a>?</TextXL>
    <div class="flex gap-2 justify-between items-center">
      <div class={`px-2 py-1 ${yes === 100 ? 'w-full' : `w-[${yes}%]`} ${yes === 0 ? 'bg-transparent' : `w-[${yes}%] bg-sky-500`}  rounded-lg`}>
        Yes
      </div>
      <div>
        {yes}%
      </div>
    </div>
    <div class="flex gap-2 justify-between items-center">
      <div class={`px-2 py-1 ${no === 100 ? 'w-full' : `w-[${no}%]`} ${no === 0 ? 'bg-transparent' : `w-[${no}%] bg-rose-500`} rounded-lg`}>
        No
      </div>
      <div>
        {no}%
      </div>
    </div>
    <TextXS>{post.safe_count + post.unsafe_count} votes</TextXS>
  </div>
  {#if $page.data.session.user.id !== post.profile_id.id && (post.isBought || (post.isShared && post.isShared.status === 'CONFIRMED'))}
    <div class="flex gap-2">
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleYesClick} disabled={$profile.coin_count === 0 || (post.profileSafe && post.profileSafe.status === 'SAFE')}>
        {#if post.profileSafe && post.profileSafe.status === 'SAFE'}
          Voted Yes!
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>        
          <span>Yes</span>
        {/if}
      </button>
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleNoClick} disabled={$profile.coin_count === 0 || (post.profileSafe && post.profileSafe.status === 'UNSAFE')}>
        {#if post.profileSafe && post.profileSafe.status === 'UNSAFE'}
          Voted No!
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>        
          <span>No</span>
        {/if}
      </button>
    </div>
  {/if}
</div> -->
<div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500">
  <a class="self-start group/profile flex items-center gap-2" href={`/u/${post.profile_id.username}`}>
    <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
    <span>{post.profile_id.display_name}</span>
    {#if post.profile_id.is_verified}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    {/if}
    <span class={`text-slate-500 ${post.profile_id.username.length > 20 ? 'w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis' : ''} group-hover/profile:underline`}>@{post.profile_id.username}</span>
  </a>
  <TextXS>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(postDateUTC))}</TextXS>
  <div class="flex flex-col gap-4">
    {#if post.is_nsfw || post.is_spoiler}
    <div class="flex gap-2">
      {#if post.is_nsfw}
        <div class="flex gap-2 items-center px-2 py-1 border-2 border-rose-500 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-rose-500">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>       
          <span class="font-bold text-rose-500">NSFW</span>
        </div>
      {/if}
      {#if post.is_spoiler}
        <div class="flex gap-2 items-center px-2 py-1 border-2 border-amber-500 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>       
          <span class="font-bold text-amber-500">SPOILER</span>
        </div>
      {/if}
    </div>
  {/if}
    <!-- <TextXL>{@html titlePreview}</TextXL> -->
    {#if $page.data.session.user.id === post.profile_id.id || post.isBought || (post.isShared && post.isShared.status === 'CONFIRMED')}
      <TextBase>{@html bodyPreview}</TextBase>
    {:else}
      <p>{post.body.length > 20 ? `${post.body.slice(0, 20)}...` : post.body}</p>
      <TextXS>Previewing {post.body.length > 20 ? `20/${post.body.length}` : `${post.body.length}/${post.body.length}`} characters</TextXS>
    {/if}
    {#if post.parent_post_id}
      <TextXS>Replied to <a href={`/p/${post.parent_post_id}`} class="hover:underline hover:text-sky-500">post <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-5 h-5">
        <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
        <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
      </svg>
      </a></TextXS>
    {/if}
    <div class="flex gap-4">
      <!-- <TextBase><span class="font-bold">{post.buy_count}</span> <TextXS><span class="text-slate-500">Buys</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.share_count}</span> <TextXS><span class="text-slate-500">Shares</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.gift_count}</span> <TextXS><span class="text-slate-500">Gifts</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.reply_count}</span> <TextXS><span class="text-slate-500">Replies</span></TextXS></TextBase> -->
      <div class="flex gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M2 10c0-3.967 3.69-7 8-7 4.31 0 8 3.033 8 7s-3.69 7-8 7a9.165 9.165 0 01-1.504-.123 5.976 5.976 0 01-3.935 1.107.75.75 0 01-.584-1.143 3.478 3.478 0 00.522-1.756C2.979 13.825 2 12.025 2 10z" clip-rule="evenodd" />
        </svg>
        <span class="font-bold text-xs">{post.reply_count}</span>
      </div>
      <div class="flex gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
        </svg>
        <span class="font-bold text-xs">{post.share_count}</span>
      </div>
      <div class="flex gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
          <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
        </svg>
        <span class="font-bold text-xs">{post.gift_count}</span>
      </div>
    </div>
  </div>
  {#if $page.data.session.user.id !== post.profile_id.id && !post.isBought && !post.isShared}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleBuyClick} disabled={$profile.coin_count === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Unlock</span>
    </button>
  {/if}
  {#if $page.data.session.user.id !== post.profile_id.id && (post.isBought || (post.isShared && post.isShared.status === 'CONFIRMED'))}
    {#if post.isGifted}
      <span>You gifted this post!</span>
    {:else}
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleGiftClick} disabled={$profile.super_coin_count === 0 || post.isGifted}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
          <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
        </svg>
        <span>Gift</span>
      </button>
    {/if}
  {/if}
  {#if post.profile_id.id === $page.data.session.user.id}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleDeletePostClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>               
      <span>Delete</span>
    </button>
  {/if}
</div>
{#if $page.data.session.user.id !== post.profile_id.id && !post.isBought && post.isShared && post.isShared.status === 'PENDING'}
  <div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4">
    <div class="flex gap-2 items-center">
      <a class="self-start group/profile flex items-center gap-2" href={`/u/${post.isShared.sender_profile_id.username}`}>
        <!-- <div class="w-8 h-8 rounded-full bg-slate-500"></div> -->
        <span>{post.isShared.sender_profile_id.display_name}</span>
        {#if post.isShared.sender_profile_id.is_verified}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        {/if}
        <span class={`text-slate-500 ${post.profile_id.username.length > 20 ? 'w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis' : ''} group-hover/profile:underline`}>@{post.profile_id.username}</span>
      </a>
      <span>sent you this post! 
    </div>
    <div class="flex gap-2">
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleAcceptClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>        
        <span>Confirm</span>
      </button>
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleRejectClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>        
        <span>Delete</span>
      </button>
    </div>
  </div>
{/if}