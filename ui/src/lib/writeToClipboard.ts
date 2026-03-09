import { browser } from '$app/environment';

export async function writeToClipboard(value: string) {
	if (!browser) return;
	await navigator.clipboard.writeText(value);
}
