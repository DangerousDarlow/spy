<script lang="ts">
	import './layout.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	if (browser) {
		window.__TANSTACK_QUERY_CLIENT__ = queryClient;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="flex w-full flex-col p-4">
		<header class="sticky top-0 z-10 mb-4">
			<Header />
		</header>

		<main class="flex w-full">
			{@render children()}
		</main>

		<footer class="fixed right-0 bottom-0 left-0 z-10 mt-4 p-4">
			<Footer />
		</footer>
	</div>
</QueryClientProvider>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }))}>
			{locale}
		</a>
	{/each}
</div>
