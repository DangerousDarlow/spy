<script lang="ts">
	import { Copy, Dices } from 'lucide-svelte';
	import { dev, getUuid, getRandomName } from '$lib';
	import { m } from '$lib/paraglide/messages.js';
	import { saveSettingsToLocalStorage, settings } from './settings.svelte.ts';

	async function copyUserIdToClipboard() {
		await navigator.clipboard.writeText(settings.user.id);
	}

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
		<label for="id" class="label label-text">
			{m.settings_id_label()}
		</label>

		<div class="input-group grid-cols-[1fr_auto]">
			<input id="id" class="input" type="text" readonly value={settings.user.id} />
			<button
				id="copy-id"
				class="ig-button preset-filled-primary-500 px-2"
				title={m.settings_id_copy()}
				onclick={copyUserIdToClipboard}
			>
				<Copy size={16} />
			</button>
		</div>
	{/if}

	<label class="label">
		<span class="label-text">{m.settings_name_label()}</span>
		<input
			class="input"
			type="text"
			placeholder={m.settings_name_placeholder()}
			bind:value={settings.user.name}
		/>
	</label>

	{#if dev}
		<button
			class="random-button btn preset-filled-primary-500 p-4"
			aria-label={m.settings_random_button_aria_label()}
			onclick={randomiseNameAndId}
		>
			<Dices size={24} />
			{m.settings_random_button_text()}
		</button>
	{/if}
</div>
