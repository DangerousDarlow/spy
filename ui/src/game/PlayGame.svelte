<script lang="ts">
	import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr';
	import { createMutation } from '@tanstack/svelte-query';
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { settings } from '../settings/settings.svelte.js';
	import { testMutation as clientTestMutation } from '$lib/api/client/@tanstack/svelte-query.gen';

	let { gameId }: { gameId: string } = $props();

	const testGameMutation = createMutation(() => ({
		...clientTestMutation({ parseAs: 'json' })
	}));

	async function onClickTest() {
		try {
			await testGameMutation.mutateAsync({
				headers: { 'Player-Id': settings.user.id },
				body: { gameId, testString: 'test' }
			});
		} catch {
			// ignore
		}
	}

	onMount(() => {
		let connection: HubConnection | undefined;

		(async () => {
			try {
				const response = await fetch(`/api/signalr/negotiate?gameId=${gameId}`, {
					method: 'POST',
					headers: { 'Player-Id': settings.user.id }
				});

				if (!response.ok) return;

				const { url, accessToken }: { url: string; accessToken: string } = await response.json();

				connection = new HubConnectionBuilder()
					.withUrl(url, { accessTokenFactory: () => accessToken })
					.withAutomaticReconnect()
					.build();

				connection.on('test', (message: string) => {
					console.info(message);
				});

				await connection.start();
			} catch {
				// SignalR is not required for the page to render
			}
		})();

		return () => {
			connection?.stop();
		};
	});
</script>

<div class="flex w-full flex-row justify-center">
	<div class="flex flex-col space-y-4">
		<h1 class="h1">{m.play_game_heading()}</h1>
		<p>
			<span class="font-semibold">{m.play_game_id_label()}:</span>
			{gameId}
		</p>

		<button
			class="create-game-button btn preset-filled-primary-500"
			onclick={onClickTest}
		>
			{m.play_game_test_button_label()}
		</button>
	</div>
</div>
