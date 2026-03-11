<script lang="ts">
	interface Props {
		idFor: string;
		label: string;
		children?: import('svelte').Snippet;
	}

	let { idFor, label, children }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={idFor} class="label label-text">
		{label}
	</label>

	{@render children?.()}
</div>
