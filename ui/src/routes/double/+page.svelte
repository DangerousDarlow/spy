<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let value = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleDouble() {
		errorMessage = '';
		isLoading = true;
		try {
			const numericValue = Number(value);
			const response = await fetch('/api/double', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ value: Number.isFinite(numericValue) ? numericValue : 0 })
			});

			if (!response.ok) {
				throw new Error(`Request failed (${response.status})`);
			}

			const data: { value?: number } = await response.json();
			value = String(data.value ?? 0);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex w-full flex-row justify-center">
	<div class="flex flex-col space-y-4">
		<p>{m.double_text()}</p>

		<label class="label">
			<span class="label-text">{m.double_button_label()}</span>
			<input
				id="double-input"
				class="input"
				inputmode="numeric"
				bind:value
				placeholder={m.double_button_placeholder()}
				disabled={isLoading}
			/>
		</label>

		<button
			class="btn w-full rounded-md preset-filled-primary-500"
			type="button"
			on:click={handleDouble}
			disabled={isLoading}
		>
			{isLoading ? m.double_button_text_in_progress() : m.double_button_text()}
		</button>

		{#if errorMessage}
			<p class="text-sm text-error-500">{errorMessage}</p>
		{/if}
	</div>
</div>
