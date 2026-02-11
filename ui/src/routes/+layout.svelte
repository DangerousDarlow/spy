<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex w-full flex-col p-4">
	<header class="sticky top-0 z-10 mb-4">
		<Header />
	</header>

	<main class="flex">
		{@render children()}
	</main>

	<footer class="fixed right-0 bottom-0 left-0 z-10 mt-4 p-4">
		<Footer />
	</footer>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }))}>
			{locale}
		</a>
	{/each}
</div>
