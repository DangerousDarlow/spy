<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="layout flex h-screen w-full flex-col pb-4">
	{@render children?.()}
</div>
