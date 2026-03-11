<script lang="ts">
	import CloseSpaced from '../shared/CloseSpaced.svelte';
	import InputAndButton from '../shared/InputAndButton.svelte';
	import { Dices } from 'lucide-svelte';
	import { getRandomJoinedWords } from '$lib';
	import { getRandomProducts } from './getRandomProducts.ts';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';

	let name = $state('');
	let productCount = $state(5);
	let products: string[] = $derived([]);

	function randomiseName() {
		name = getRandomJoinedWords(3);
	}

	onMount(() => {
		randomiseName();
	});

	$effect(() => {
		products = getRandomProducts(productCount);
	});
</script>

<div class="flex w-full flex-col gap-4">
	<h3 class="h3">{m.create_game_heading()}</h3>

	<CloseSpaced>
		<label for="create-name" class="label label-text">
			{m.create_game_name_label()}
		</label>

		<InputAndButton
			id="create-name"
			bind:value={name}
			buttonTitle={m.create_game_randomise_name_button_label()}
			buttonIcon={Dices}
			onButtonClick={randomiseName}
		/>
	</CloseSpaced>

	<CloseSpaced>
		<h4 class="h4">{m.create_game_product_heading()}</h4>

		<label for="create-product-number" class="label label-text">
			{m.create_game_product_number_label()}
		</label>

		<p class="label-text">{m.create_game_product_number_recomendation_label()}</p>

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
				id="create-product-number"
				class="input w-12 text-center"
				type="text"
				bind:value={productCount}
			/>
		</div>
	</CloseSpaced>

	{#if products.length > 0}
		<ul class="product-list list-inside list-none space-y-2 bg-surface-100-900 p-4">
			{#each products as product, index (`${product}-${index}`)}
				<li class="text">{product}</li>
			{/each}
		</ul>
	{/if}
</div>
