import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export const isDarkTheme = writable(false);

if (browser) {
	const item = localStorage.getItem('isDarkTheme') || 'false';
	isDarkTheme.set(JSON.parse(item));
	isDarkTheme.subscribe((value) => localStorage.setItem('isDarkTheme', JSON.stringify(value)));
}
