<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { doubleMutation } from '$lib/api/client/@tanstack/svelte-query.gen';
	import { m } from '$lib/paraglide/messages.js';

	const mutation = createMutation(() => ({
		...doubleMutation(),
		onSuccess: (data) => (value = String(data?.value ?? 0))
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
			class="btn w-full preset-filled-primary-500"
			type="button"
			onclick={async () => await mutation.mutateAsync({ body: { value: Number(value) } })}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? m.double_button_text_in_progress() : m.double_button_text()}
		</button>

		{#if mutation.isError}
			<p class="text-sm text-error-500">{mutation.error?.message}</p>
		{/if}
	</div>
</div>
