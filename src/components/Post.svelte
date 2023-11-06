<script lang="ts">
  export let post;

  import { page } from '$app/stores';
  import { invalidate, invalidateAll } from '$app/navigation';

  import TextXS from 'components/TextXS.svelte';
  import TextBase from 'components/TextBase.svelte';
  import TextXL from 'components/TextXL.svelte';

  let showFollowersModal = false;
  let followers = [];

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

  // let titlePreview: any = '';

  // $: {
  //   let newTitleWords: string[] = [];
    
  //   post.title.split(' ').forEach((word: string) => {
  //     if (word.startsWith('@')) {
  //       const username = word.replace('@', '');
  //       const href = `/u/${username}`;
  //       const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

  //       newTitleWords.push(newBodyWord);
  //     } else if (word.startsWith('#')) {
  //       const hashtag = word.replace('#', '');
  //       const href = `/p?hashtag=${hashtag}`;
  //       const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

  //       newTitleWords.push(newBodyWord);
  //     } else {
  //       newTitleWords.push(word);
  //     }
  //   });

  //   titlePreview = newTitleWords.join(' ');
  // }

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
      $page.data.supabase.rpc('profile_decrement', { row_id: post.isShared.sender_profile_id, row_column: 'coin_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'share_count', increment_amount: 1 }),
    ]);

    invalidate('app:postid');
  }

  const handleRejectClick = async () => {
    await $page.data.supabase.from('profile_share').delete().match({ id: post.isShared.id });

    invalidate('app:postid');
  }

  const handleBuyClick = async () => {
    await Promise.all([
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'coin_count', decrement_amount: 1 }),
      $page.data.supabase.from('profile_buy').insert([{ profile_id: $page.data.session.user.id, post_id: post.id }]),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'buy_count', increment_amount: 1 }),
    ]);

    invalidateAll();
  }

  const handleGiftClick = async () => {
    await Promise.all([
      $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'coin_count', decrement_amount: 1 }),
      $page.data.supabase.rpc('profile_increment', { row_id: post.profile_id.id, row_column: 'coin_count', increment_amount: 1 }),
      $page.data.supabase.from('profile_gift').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: post.profile_id.id, post_id: post.id }]),
      $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'gift_count', increment_amount: 1 }),
    ]);

    invalidate('app:postid');
  }

  const handleShareClick = async () => {
    const { data: profileFollowRecords } = await $page.data.supabase.from('profile_follow').select('*, sender_profile_id (*)').match({ status: 'CONFIRMED', receiver_profile_id: $page.data.session.user.id });
    followers = profileFollowRecords;
    showFollowersModal = true;
  }

  const handleSendClick = async (follower) => {
    await Promise.all([
      $page.data.supabase.from('profile_share').insert([{ sender_profile_id: $page.data.session.user.id, receiver_profile_id: follower.sender_profile_id.id, post_id: post.id, status: 'PENDING' }]),
    ]);

    invalidate('app:postid');
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

    invalidate('app:postid');
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

    invalidate('app:postid');
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
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleYesClick} disabled={$page.data.session.profile.coin_count === 0 || (post.profileSafe && post.profileSafe.status === 'SAFE')}>
        {#if post.profileSafe && post.profileSafe.status === 'SAFE'}
          Voted Yes!
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>        
          <span>Yes</span>
        {/if}
      </button>
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleNoClick} disabled={$page.data.session.profile.coin_count === 0 || (post.profileSafe && post.profileSafe.status === 'UNSAFE')}>
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
<div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4 group-hover:border-sky-500 w-60 sm:w-80">
  <a class="self-start hover:underline flex items-center gap-2" href={`/u/${post.profile_id.username}`}>
    <div class="w-8 h-8 rounded-full bg-slate-500"></div>
    <TextBase>{post.profile_id.username}</TextBase>
    {#if post.profile_id.is_verified}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    {/if}
  </a>
  <TextXS>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(postDateUTC))}</TextXS>
  <div class="flex flex-col gap-4">
    {#if post.is_nsfw || post.is_spoiler}
      <div class="flex gap-2">
        {#if post.is_nsfw}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">NSFW</span>
        {/if}
        {#if post.is_spoiler}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">SPOILER</span>
        {/if}
      </div>
    {/if}
    <!-- <TextXL>{@html titlePreview}</TextXL> -->
    {#if $page.data.session.user.id === post.profile_id.id || post.isBought || (post.isShared && post.isShared.status === 'CONFIRMED')}
      <TextBase>{@html bodyPreview}</TextBase>
    {:else}
      <p class="w-[20ch] overflow-hidden whitespace-nowrap text-ellipsis">{post.body}</p>
      <TextXS>Previewing {post.body.length > 20 ? `20/${post.body.length}` : `${post.body.length}/${post.body.length}`} characters</TextXS>
    {/if}
    {#if post.parent_post_id}
      <TextXS>Replied to <a href={`/p/${post.parent_post_id}`} class="hover:underline hover:text-sky-500">post <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-5 h-5">
        <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
        <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
      </svg>
      </a></TextXS>
    {/if}
    <div class="flex gap-2">
      <TextBase><span class="font-bold">{post.buy_count}</span> <TextXS><span class="text-slate-500">Buys</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.share_count}</span> <TextXS><span class="text-slate-500">Shares</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.gift_count}</span> <TextXS><span class="text-slate-500">Gifts</span></TextXS></TextBase>
      <TextBase><span class="font-bold">{post.reply_count}</span> <TextXS><span class="text-slate-500">Replies</span></TextXS></TextBase>
    </div>
  </div>
  {#if $page.data.session.user.id !== post.profile_id.id && !post.isBought && !post.isShared}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleBuyClick} disabled={$page.data.session.profile.coin_count === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Buy</span>
    </button>
  {:else if $page.data.session.user.id !== post.profile_id.id && !post.isBought && post.isShared && post.isShared.status === 'PENDING'}
    <div class="w-full h-[2px] rounded-full bg-slate-800"></div>
    <div class="flex gap-2 items-center">
      <a class="self-start hover:underline flex items-center gap-2" href={`/u/${post.isShared.sender_profile_id.username}`}>
        <div class="w-8 h-8 rounded-full bg-slate-500"></div>
        <TextBase>{post.isShared.sender_profile_id.username}</TextBase>
        {#if post.isShared.sender_profile_id.is_verified}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        {/if}
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
  {:else}
    <div class="flex gap-2">
      {#if $page.data.session.user.id !== post.profile_id.id}
        <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleGiftClick} disabled={$page.data.session.profile.coin_count === 0 || post.isGifted}>
          {#if post.isGifted}
            <span>Gifted!</span>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
            </svg>
            <span>Gift</span>
          {/if}
        </button>
      {/if}
      <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleShareClick} disabled={$page.data.session.profile.coin_count === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
        </svg>
        <span>Share</span>
      </button>
    </div>
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
{#if showFollowersModal}
  <div class="flex flex-col bg-slate-900 p-4 rounded-lg gap-4">
    <TextXL>Followers</TextXL>
    {#if followers.length > 0}
      {#each followers as follower}
        <div class="flex space-between gap-2">
          <div class="flex flex-grow">
            <a class="hover:underline flex items-center gap-2" href={`/u/${follower.sender_profile_id.username}`}>
              <div class="w-8 h-8 rounded-full bg-slate-500"></div>
              <TextBase>{follower.sender_profile_id.username}</TextBase>
              {#if follower.sender_profile_id.is_verified}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
              {/if}
            </a>
          </div>
          <div>
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => await handleSendClick(follower)} disabled={$page.data.session.profile.coin_count === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
              </svg>
              <span>Send</span>
            </button>
          </div>
        </div>
      {/each}
    {:else}
      <TextXS>No followers</TextXS>
    {/if}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={() => showFollowersModal = false}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>      
      <span>Close</span>
    </button>
  </div>
{/if}