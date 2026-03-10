<script lang="ts">
	import InputAndButton from '../shared/InputAndButton.svelte';
	import Labelled from '../shared/Labelled.svelte';
	import { Copy } from 'lucide-svelte';
	import { dev, getRandomName, getUuid, writeToClipboard } from '$lib';
	import { m } from '$lib/paraglide/messages.js';
	import { saveSettingsToLocalStorage, settings } from './settings.svelte.ts';

	function randomiseNameAndId() {
		settings.user.id = getUuid();
		settings.user.name = getRandomName();
	}

	$effect(() => {
		if (dev) return;
		saveSettingsToLocalStorage();
	});
</script>

<div class="settings flex flex-col gap-4">
	{#if dev}
		<Labelled id="user-id" label={m.settings_id_label()}>
			<InputAndButton
				id="user-id"
				bind:value={settings.user.id}
				buttonTitle={m.settings_id_copy()}
				buttonIcon={Copy}
				onButtonClick={writeToClipboard}
				readonly
			/>
		</Labelled>
	{/if}

	<Labelled id="user-name" label={m.settings_name_label()}>
		<input
			id="user-name"
			class="input"
			type="text"
			placeholder={m.settings_name_placeholder()}
			bind:value={settings.user.name}
		/>
	</Labelled>

	{#if dev}
		<button
			class="random-button btn preset-filled-primary-500"
			onclick={randomiseNameAndId}
		>
			{m.settings_random_button_text()}
		</button>
	{/if}
</div>
