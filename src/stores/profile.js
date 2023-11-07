import { writable } from 'svelte/store';

export const profile = writable();

// profile.subscribe((value) => {console.log(value)});
// profile.set(1);
// profile.update((n) => n + 1);