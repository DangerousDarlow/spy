<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<footer class="z-30 flex h-full items-center justify-center gap-2 p-4">
	{@render children?.()}
</footer>
