<script lang="ts">
	import { dev } from '$lib';
	import { m } from '$lib/paraglide/messages.js';
	import { saveSettingsToLocalStorage, settings } from './settings.svelte.ts';

	$effect(() => {
		if (dev) return;
		saveSettingsToLocalStorage();
	});
</script>

<div class="settings flex flex-col gap-4">
	{#if dev}
		<label class="label">
			<span class="label-text">{m.settings_id_label()}</span>
			<input class="input" type="text" bind:value={settings.user.id} />
		</label>
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
</div>
