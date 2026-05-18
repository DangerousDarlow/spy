<script lang="ts">
	import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr';
	import { m } from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { settings } from '../settings/settings.svelte.js';

	let { gameId }: { gameId: string } = $props();

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
	</div>
</div>
