<script lang="ts">
	import './layout.css';
	import Header from '../components/Header.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { Settings } from 'lucide-svelte';
	import ToggleButton from '../components/ToggleButton.svelte';
	import BottomPopUp from '../components/BottomPopUp.svelte';

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

	let settingsOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="layout flex min-h-screen w-full flex-col">
		<header class="sticky top-0 z-10 p-4">
			<Header />
		</header>

		<main class="relative flex w-full flex-1">
			{@render children()}

			<BottomPopUp bind:open={settingsOpen}>
				<p>hello</p>
			</BottomPopUp>
		</main>

		<footer class="z-30 p-4 flex h-full items-center justify-center gap-2">
				<ToggleButton bind:toggled={settingsOpen} icon={Settings} />
		</footer>
	</div>
</QueryClientProvider>

<div style="display:none">
	{#each locales as locale (locale)}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
