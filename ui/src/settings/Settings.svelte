<script lang="ts">
	import CloseSpaced from '../shared/CloseSpaced.svelte';
	import InputAndButton from '../shared/InputAndButton.svelte';
	import { Copy } from 'lucide-svelte';
	import { dev, getRandomName, getRandomUuid, writeToClipboard } from '$lib';
	import { m } from '$lib/paraglide/messages.js';
	import { saveSettingsToLocalStorage, settings } from './settings.svelte.ts';

	function randomiseNameAndId() {
		settings.user.id = getRandomUuid();
		settings.user.name = getRandomName();
	}

	$effect(() => {
		if (dev) return;
		saveSettingsToLocalStorage();
	});
</script>

<div class="settings flex flex-col gap-4">
	{#if dev}
		<CloseSpaced>
			<label for="user-id" class="label label-text">
				{m.settings_id_label()}
			</label>

			<InputAndButton
				id="user-id"
				bind:value={settings.user.id}
				buttonTitle={m.settings_id_copy()}
				buttonIcon={Copy}
				onButtonClick={writeToClipboard}
				readonly
			/>
		</CloseSpaced>
	{/if}

	<CloseSpaced>
		<label for="user-name" class="label label-text">
			{m.settings_name_label()}
		</label>

		<input
			id="user-name"
			class="input"
			type="text"
			placeholder={m.settings_name_placeholder()}
			bind:value={settings.user.name}
		/>
	</CloseSpaced>

	{#if dev}
		<button class="random-button btn preset-filled-primary-500" onclick={randomiseNameAndId}>
			{m.settings_random_button_text()}
		</button>
	{/if}
</div>
