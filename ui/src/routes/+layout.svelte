<script lang="ts">
	import './layout.css';
	import BottomPopUp from '../components/layout/BottomPopUp.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import Header from '../components/layout/Header.svelte';
	import Layout from '../components/layout/Layout.svelte';
	import Main from '../components/layout/Main.svelte';
	import ToggleButton from '../components/ToggleButton.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Settings } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';

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
	<Layout>
		<Header />

		<Main>
			{@render children?.()}

			<BottomPopUp bind:open={settingsOpen}>
				<p>hello</p>
			</BottomPopUp>
		</Main>

		<Footer>
			<ToggleButton bind:toggled={settingsOpen} icon={Settings} />
		</Footer>
	</Layout>
</QueryClientProvider>

<div style="display:none">
	{#each locales as locale (locale)}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
