<script lang="ts">
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

<div class="mx-auto max-w-md space-y-4 p-6">
	<h1>Double</h1>
	<label class="block text-sm font-medium text-slate-700" for="double-input">Number</label>
	<input
		id="double-input"
		class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm outline-none ring-offset-2 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
		type="number"
		inputmode="numeric"
		bind:value
		placeholder="Enter a number"
		disabled={isLoading}
	/>
	<button
		class="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
		type="button"
		on:click={handleDouble}
		disabled={isLoading}
	>
		{isLoading ? 'Doubling...' : 'Double It'}
	</button>
	{#if errorMessage}
		<p class="text-sm text-red-600">{errorMessage}</p>
	{/if}
</div>
