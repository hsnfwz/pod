<script>
    import { profile } from 'stores/profile';
    import TextXL from 'components/TextXL.svelte';
    import TextBase from 'components/TextBase.svelte';
    import TextXS from 'components/TextXS.svelte';
    import { page } from '$app/stores';

    const abilities = {
        'BOOST_POST_24_HOURS': {
            type: 'BOOST POST 24 HOURS',
            time: '24 HOURS',
            cost: 100,
        },
        'FREE_UNLOCKS_1_HOUR': {
            type: 'FREE UNLOCKS 1 HOUR',
            time: '1 HOUR',
            cost: 100,
        },
        'FREE_POSTING_1_HOUR': {
            type: 'FREE POSTING 1 HOUR',
            time: '1 HOUR',
            cost: 100,
        },
        'FREE_REPLYING_1_HOUR': {
            type: 'FREE REPLYING 1 HOUR',
            time: '1 HOUR',
            cost: 100,
        },
        'FREE_SHARING_1_HOUR': {
            type: 'FREE SHARING 1 HOUR',
            time: '1 HOUR',
            cost: 100,
        },
    }

    const handleRedeem = async (ability) => {
        const redeemDate = new Date();
        redeemDate.setSeconds(0, 0);

        let expireDate = new Date(redeemDate);

        if (ability.time === '24 HOURS') {
            expireDate.setDate(redeemDate.getDate() + 1);
        } else if (ability.time === '1 HOUR') {
            expireDate.setHours(redeemDate.getHours() + 1, redeemDate.getMinutes(), redeemDate.getSeconds(), redeemDate.getMilliseconds());
        }

        await Promise.all([
            $page.data.supabase.from('profile_ability').insert([{ profile_id: $page.data.session?.user.id, type: ability.type, redeemed_at: redeemDate, expired_at: expireDate }]),
            // $page.data.supabase.rpc('profile_decrement', { row_id: $page.data.session?.user.id, row_column: 'super_coin_count', decrement_amount: ability.cost }),
        ]);
    }

    const isAbilityOneActive = $page.data.profileAbilitiesActive.find(profileAbilityActive => profileAbilityActive.type === abilities.BOOST_POST_24_HOURS.type);
    const isAbilityTwoActive = $page.data.profileAbilitiesActive.find(profileAbilityActive => profileAbilityActive.type === abilities.FREE_UNLOCKS_1_HOUR.type);
    const isAbilityThreeActive = $page.data.profileAbilitiesActive.find(profileAbilityActive => profileAbilityActive.type === abilities.FREE_POSTING_1_HOUR.type);
    const isAbilityFourActive = $page.data.profileAbilitiesActive.find(profileAbilityActive => profileAbilityActive.type === abilities.FREE_REPLYING_1_HOUR.type);
    const isAbilityFiveActive = $page.data.profileAbilitiesActive.find(profileAbilityActive => profileAbilityActive.type === abilities.FREE_SHARING_1_HOUR.type);

    const isAbilityOneCooldown = $page.data.profileAbilitiesCooldown.find(profileAbilityCooldown => profileAbilityCooldown.type === abilities.BOOST_POST_24_HOURS.type);
    const isAbilityTwoCooldown = $page.data.profileAbilitiesCooldown.find(profileAbilityCooldown => profileAbilityCooldown.type === abilities.FREE_UNLOCKS_1_HOUR.type);
    const isAbilityThreeCooldown = $page.data.profileAbilitiesCooldown.find(profileAbilityCooldown => profileAbilityCooldown.type === abilities.FREE_POSTING_1_HOUR.type);
    const isAbilityFourCooldown = $page.data.profileAbilitiesCooldown.find(profileAbilityCooldown => profileAbilityCooldown.type === abilities.FREE_REPLYING_1_HOUR.type);
    const isAbilityFiveCooldown = $page.data.profileAbilitiesCooldown.find(profileAbilityCooldown => profileAbilityCooldown.type === abilities.FREE_SHARING_1_HOUR.type);
</script>
<div class="w-[500px] flex flex-col gap-4">
{#if $page.url.search === '' || $page.url.search === '?view=abilities'}
  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Boost Post for 24 Hours</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            {#if isAbilityOneActive}
                <p><span class="font-bold text-amber-500">Active</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityOneActive.expired_at).getTime())}</p>
            {/if}
            {#if isAbilityOneCooldown}
                <p><span class="font-bold text-sky-500">Cooldown</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityOneCooldown.renew_at).getTime())}</p>
            {/if}
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem(abilities.BOOST_POST_24_HOURS)} disabled={isAbilityOneActive || isAbilityOneCooldown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Broadcast Post for 24 Hours</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Free Unlocks for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            {#if isAbilityTwoActive}
                <p><span class="font-bold text-amber-500">Active</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityTwoActive.expired_at).getTime())}</p>
            {/if}
            {#if isAbilityTwoCooldown}
                <p><span class="font-bold text-sky-500">Cooldown</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityTwoCooldown.renew_at).getTime())}</p>
            {/if}
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem(abilities.FREE_UNLOCKS_1_HOUR)} disabled={isAbilityTwoActive || isAbilityTwoCooldown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Free Posting for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            {#if isAbilityThreeActive}
                <p><span class="font-bold text-amber-500">Active</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityThreeActive.expired_at).getTime())}</p>
            {/if}
            {#if isAbilityThreeCooldown}
                <p><span class="font-bold text-sky-500">Cooldown</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityThreeCooldown.renew_at).getTime())}</p>
            {/if}
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem(abilities.FREE_POSTING_1_HOUR)} disabled={isAbilityThreeActive || isAbilityThreeCooldown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Free Replying for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            {#if isAbilityFourActive}
                <p><span class="font-bold text-amber-500">Active</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityFourActive.expired_at).getTime())}</p>
            {/if}
            {#if isAbilityFourCooldown}
                <p><span class="font-bold text-sky-500">Cooldown</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityFourCooldown.renew_at).getTime())}</p>
            {/if}
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem(abilities.FREE_REPLYING_1_HOUR)} disabled={isAbilityFourActive || isAbilityFourCooldown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Free Sharing for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            {#if isAbilityFiveActive}
                <p><span class="font-bold text-amber-500">Active</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityFiveActive.expired_at).getTime())}</p>
            {/if}
            {#if isAbilityFiveCooldown}
                <p><span class="font-bold text-sky-500">Cooldown</span> until {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isAbilityFiveCooldown.renew_at).getTime())}</p>
            {/if}
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem(abilities.FREE_SHARING_1_HOUR)} disabled={isAbilityFiveActive || isAbilityFiveCooldown}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Free Updating for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Increase Image File Size for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Increase Video File Size for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>Increase Character Limit for 1 Hour</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
    <div class="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg">
        <div class="flex flex-col gap-4 flex-grow">
            <TextXL>All Activity Free for 30 Minutes</TextXL>
            <TextBase>Lorem Ipsum</TextBase>
            <TextXS>Coming Soon!</TextXS>
        </div>
        <div class="self-end w-full">
            <button type="button" class="justify-center items-center w-full flex gap-2 bg-slate-800 font-bold px-2 py-1 rounded-lg select-none active:bg-slate-950 disabled:opacity-50 disabled:pointer-events-none" on:click={async () => handleRedeem()} disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-amber-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
                    </svg>                
                <span>100</span>
            </button>
        </div>
    </div>
  </div>
  {:else if $page.url.search === '?view=avatars'}
    <TextXL>Avatars</TextXL>
  {/if}
</div>