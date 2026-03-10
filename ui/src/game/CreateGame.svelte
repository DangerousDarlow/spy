<script lang="ts">
	import InputAndButton from '../shared/InputAndButton.svelte';
	import Labelled from '../shared/Labelled.svelte';
	import { Dices } from 'lucide-svelte';
	import { getRandomJoinedWords } from '$lib';
	import { getRandomProducts } from './getRandomProducts.ts';
	import { m } from '$lib/paraglide/messages';

	let name = $state(getRandomJoinedWords(3));

	function randomiseName() {
		name = getRandomJoinedWords(3);
	}

	let productCount = $state(5);

	let products = $derived(getRandomProducts(productCount).sort());
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

	<Labelled id="create-product-count" label={m.create_game_product_label()}>
		<div class="flex flex-col">
			<p class="label-text">{m.create_game_product_recomendation_label()}</p>
			<div class="flex w-full gap-4">
				<input
					class="input"
					type="range"
					max="10"
					min="3"
					bind:value={productCount}
					aria-disabled="true"
				/>
				<input
					id="create-product-count"
					class="input w-12 text-center"
					type="text"
					bind:value={productCount}
				/>
			</div>
		</div>
	</Labelled>

	<ul class="list-inside list-none space-y-2 bg-surface-100-900 p-4">
		{#each products as product, index (`${product}-${index}`)}
			<li class="text">{product}</li>
		{/each}
	</ul>
</div>
