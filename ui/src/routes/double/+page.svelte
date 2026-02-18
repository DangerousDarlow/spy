<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { m } from '$lib/paraglide/messages.js';

	const postDouble = async (value: string) => {
		const numericValue = Number(value);
		const response = await fetch('/api/double', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value: numericValue })
		});

		if (!response.ok) throw new Error('Failed to double value');
		const data = await response.json();
		return data.value ?? 0;
	};

	const mutation = createMutation(() => ({
		mutationFn: postDouble,
		onSuccess: (data) => (value = data)
	}));

	let value = '';
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
				disabled={mutation.isPending}
			/>
		</label>

		<button
			class="btn w-full rounded-md preset-filled-primary-500"
			type="button"
			on:click={() => mutation.mutateAsync(value)}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? m.double_button_text_in_progress() : m.double_button_text()}
		</button>

		{#if mutation.isError}
			<p class="text-sm text-error-500">{mutation.error}</p>
		{/if}
	</div>
</div>
