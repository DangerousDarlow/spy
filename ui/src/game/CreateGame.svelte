<script lang="ts">
	import InputAndButton from '../shared/InputAndButton.svelte';
	import Labelled from '../shared/Labelled.svelte';
	import { Dices } from 'lucide-svelte';
	import { getRandomJoinedWords } from '$lib';
	import { m } from '$lib/paraglide/messages';

	let name = $state(getRandomJoinedWords(3));

	function randomiseName() {
		name = getRandomJoinedWords(3);
	}
</script>

<div class="flex w-full flex-col gap-4">
	<h2>{m.create_game_heading()}</h2>

	<Labelled id="create-name" label={m.create_game_name_label()}>
		<InputAndButton
			id="create-name"
			bind:value={name}
			buttonTitle={m.create_game_randomise_name_button_label()}
			buttonIcon={Dices}
			onButtonClick={randomiseName}
		/>
	</Labelled>
</div>
