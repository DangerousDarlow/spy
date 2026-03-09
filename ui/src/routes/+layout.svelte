<script lang="ts">
	import './layout.css';
	import Header from '../layout/Header.svelte';
	import Layout from '../layout/Layout.svelte';
	import Main from '../layout/Main.svelte';
	import Settings from '../settings/Settings.svelte';
	import ToggleButton from '../layout/ToggleButton.svelte';
	import TopPopUp from '../layout/TopPopUp.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Settings as SettingsIcon } from 'lucide-svelte';
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
		<Header>
			<ToggleButton bind:toggled={settingsOpen} icon={SettingsIcon} size={32} />
		</Header>

		<Main>
			{@render children?.()}

			<TopPopUp bind:open={settingsOpen}>
				<Settings />
			</TopPopUp>
		</Main>
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
