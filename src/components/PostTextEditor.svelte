<script lang="ts">
  import { page } from '$app/stores';

  export let post = undefined;

  let isLoading: boolean = false;
  let title: string = '';
  let body: string = '';
  let isSpoiler: boolean = false;
  let isNSFW: boolean = false;

  const handlePost = async () => {
    isLoading = true;

    await $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'coin_count', decrement_amount: 1 });
    
    const _posts = [{ body, profile_id: $page.data.session.user.id, is_spoiler: isSpoiler, is_nsfw: isNSFW }];

    await $page.data.supabase.from('post').insert(_posts).select();

    isLoading = false;
    title = '';
    body = '';
    isSpoiler = false;
    isNSFW = false;
  }

  const handleReply = async () => {
    isLoading = true;

    await $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session.user.id, row_column: 'coin_count', decrement_amount: 1 });
    await $page.data.supabase.rpc('increment', { table_name: 'post', row_id: post.id, row_column: 'reply_count', increment_amount: 1 });
    
    const _posts = [{ body, profile_id: $page.data.session.user.id, is_spoiler: isSpoiler, is_nsfw: isNSFW, parent_post_id: post.id }];

    await $page.data.supabase.from('post').insert(_posts).select();

    isLoading = false;
    title = '';
    body = '';
    isSpoiler = false;
    isNSFW = false;
  }

  // let titlePreview:any = '';
  let bodyPreview:any = '';

  // $: {
  //   let newTitleWords: string[] = [];
    
  //   title.trim().replace(/\s+/g, ' ').split(' ').forEach((word: string) => {
  //     if (word.startsWith('@') && word.length > 1 && word.split('@').length === 2) {
  //       const username = word.replace('@', '');
  //       const href = `/u/${username}`;
  //       const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

  //       newTitleWords.push(newBodyWord);
  //     } else if (word.startsWith('#') && word.length > 1 && word.split('#').length === 2) {
  //       const hashtag = word.replace('#', '');
  //       const href = `/p?hashtag=${hashtag}`;
  //       const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;

  //       newTitleWords.push(newBodyWord);
  //     } else {
  //       newTitleWords.push(word);
  //     }
  //   });

  //   if (titlePreview) {
  //     titlePreview.innerHTML = newTitleWords.join(' ');
  //   }
  // }

  $: {
    let newBodyLines: string[] = [];
    let newBodyWords: string[] = [];

    body.replace(/\n\s*\n\s*\n/g, '\n\n').split('\n').forEach((line: string) => {

      line.trim().replace(/\s+/g, ' ').split(' ').forEach((word: string) => {
        if (word.startsWith('@') && word.length > 1 && word.split('@').length === 2) {
          const username = word.replace('@', '');

          if (/^[a-zA-Z0-9_.-]+$/.test(username)) {
            const href = `/u/${username}`;
            const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;
            newBodyWords.push(newBodyWord);
          } else {
            newBodyWords.push(word);
          }
        } else if (word.startsWith('#') && word.length > 1 && word.split('#').length === 2) {
          const hashtag = word.replace('#', '');

          if (/^[a-zA-Z0-9_]+$/.test(hashtag)) {
            const href = `/search?term=${hashtag}`;
            const newBodyWord = `<a href="${href}" class="text-sky-500 hover:underline">${word}</a>`;
            newBodyWords.push(newBodyWord);
          } else {
            newBodyWords.push(word);
          }
        } else {
          newBodyWords.push(word);
        }
      });

      const newBodyLine = newBodyWords.join(' ');
      newBodyLines.push(newBodyLine);
      newBodyWords = [];
    });

    if (bodyPreview) {
      bodyPreview.innerHTML = newBodyLines.join('\n');
    }
  }
</script>

<!-- <form class="flex flex-col gap-4 bg-slate-900  p-4 rounded-lg ">
  <div class="flex flex-col gap-2 p-2 border-2 border-slate-800 rounded-lg">
    <p class="text-slate-500">Preview</p>
    {#if isNSFW || isSpoiler}
      <div class="flex gap-2">
        {#if isNSFW}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">NSFW</span>
        {/if}
        {#if isSpoiler}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">SPOILER</span>
        {/if}
      </div>
    {/if}
    {#if title.length > 0}
      <p class="text-lg font-bold" bind:this={titlePreview}></p>
    {/if}
    {#if body.length > 0}
      <div class="break-words">
        <p bind:this={bodyPreview} class="whitespace-pre-wrap"></p>
      </div>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="title">* Title</label>
    <input minlength="1" maxlength="100" autocomplete="off" id="title" type="text" placeholder="Title" class="border-box rounded-lg bg-slate-800 px-2 py-1" bind:value={title} />
    {#if title.length === 100}
      <p class="italic text-rose-500 flex gap-2 items-center">
        <span class="text-xs">Title character limit reached (100)</span>
      </p>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="body">* Body</label>
    <textarea minlength="1" maxlength="1000" autocomplete="off" rows="5" id="body" placeholder="Body" class="border-box rounded-lg bg-slate-800 px-2 py-1" bind:value={body} />
    {#if body.length === 1000}
      <p class="italic text-rose-500 flex gap-2 items-center">
        <span class="text-xs">Body character limit reached (1000)</span>
      </p>
    {/if}
  </div>
  <div class="flex gap-2">
    <button type="button" class={`${isNSFW ? 'bg-slate-800 border-transparent' : 'border-slate-800'} border-2 justify-center items-center w-full flex gap-2 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none`} on:click={() => isNSFW = !isNSFW} >
      {#if isNSFW}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      {/if}
      <span>NSFW</span>
    </button>
    <button type="button" class={`${isSpoiler ? 'bg-slate-800 border-transparent' : 'border-slate-800'} border-2 justify-center items-center w-full flex gap-2 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none`} on:click={() => isSpoiler = !isSpoiler}>
      {#if isSpoiler}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      {/if}
      <span>SPOILER</span>
    </button>
  </div>
  {#if post}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleReply} disabled={isLoading || title.length === 0 || body.trim().length === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Reply</span>
    </button>
  {:else}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handlePost} disabled={isLoading || title.length === 0 || body.trim().length === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Post</span>
    </button>
  {/if}
</form> -->


<form class="flex flex-col gap-4 bg-slate-900  p-4 rounded-lg w-60 sm:w-80">
  <div class="flex flex-col gap-2">
    <textarea minlength="1" maxlength="1000" autocomplete="off" rows="5" id="body" placeholder="What's on your mind?" class="border-box rounded-lg bg-slate-800 p-2" bind:value={body} />
    {#if body.length === 1000}
      <p class="italic text-rose-500 flex gap-2 items-center">
        <span class="text-xs">Body character limit reached (1000)</span>
      </p>
    {/if}
  </div>
  <div class="flex gap-2">
    <button type="button" class={`${isNSFW ? 'bg-slate-800 border-transparent' : 'border-slate-800'} border-2 justify-center items-center w-full flex gap-2 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none`} on:click={() => isNSFW = !isNSFW} >
      {#if isNSFW}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      {/if}
      <span>NSFW</span>
    </button>
    <button type="button" class={`${isSpoiler ? 'bg-slate-800 border-transparent' : 'border-slate-800'} border-2 justify-center items-center w-full flex gap-2 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none`} on:click={() => isSpoiler = !isSpoiler}>
      {#if isSpoiler}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      {/if}
      <span>SPOILER</span>
    </button>
  </div>
  <div class="flex flex-col gap-2 p-4 border-2 border-slate-800 rounded-lg">
    <p class="text-slate-500">Preview</p>
    {#if isNSFW || isSpoiler}
      <div class="flex gap-2">
        {#if isNSFW}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">NSFW</span>
        {/if}
        {#if isSpoiler}
          <span class="px-2 py-1 bg-slate-800 rounded-lg">SPOILER</span>
        {/if}
      </div>
    {/if}
    <!-- {#if title.length > 0}
      <p class="text-lg font-bold" bind:this={titlePreview}></p>
    {/if} -->
    {#if body.length > 0}
      <div class="break-words">
        <p bind:this={bodyPreview} class="whitespace-pre-wrap"></p>
      </div>
    {/if}
  </div>
  {#if post}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handleReply} disabled={isLoading || body.trim().length === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Reply</span>
    </button>
  {:else}
    <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={handlePost} disabled={isLoading || body.trim().length === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
      </svg>
      <span>Post</span>
    </button>
  {/if}
</form>