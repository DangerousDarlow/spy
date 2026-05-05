<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let { gameId }: { gameId: string } = $props();
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
