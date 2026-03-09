<script lang="ts">
	interface Props {
		id: string;
		label: string;
		children?: import('svelte').Snippet;
	}

	let { id, label, children }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="label label-text">
		{label}
	</label>

	{@render children?.()}
</div>
