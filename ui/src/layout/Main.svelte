<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<main class="relative flex w-full flex-1 p-4">
	{@render children?.()}
</main>
