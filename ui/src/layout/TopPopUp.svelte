<script lang="ts">
	interface Props {
		open: boolean;
		closeOnClick?: boolean;
		children?: import('svelte').Snippet;
	}

	let { open = $bindable(), closeOnClick = false, children }: Props = $props();

	const close = () => {
		open = false;
	};
</script>

{#if open}
	<div class="popup absolute inset-0 z-10 flex flex-col">
		<div
			class="content z-20 w-full transform p-4"
			onclick={() => {
				if (closeOnClick) close();
			}}
			role="none"
		>
			<div>
				{@render children?.()}
			</div>
		</div>

		<div
			class="backdrop bg-inactive flex-1 bg-gray-900/50"
			onclick={close}
			aria-hidden="true"
		></div>
	</div>
{/if}
