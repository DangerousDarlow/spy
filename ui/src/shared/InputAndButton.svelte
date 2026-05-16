<script lang="ts">
	import { Icon } from 'lucide-svelte';

	interface Props {
		id: string;
		value: string;
		buttonTitle: string;
		buttonIcon: typeof Icon;
		onButtonClick: (value: string) => void | Promise<void>;
		readonly?: boolean;
		disabled?: boolean;
	}

	let {
		id,
		value = $bindable(),
		buttonTitle,
		buttonIcon,
		onButtonClick,
		readonly = false,
		disabled = false
	}: Props = $props();

	const IconComponent = $derived(buttonIcon);
</script>

<div class="input-and-button input-group grid-cols-[1fr_auto]">
	<input {id} class="input" type="text" bind:value {readonly} {disabled} />
	<button
		class="ig-button preset-filled-primary-500 px-2"
		title={buttonTitle}
		{disabled}
		onclick={() => onButtonClick(value)}
	>
		<IconComponent size={16} />
	</button>
</div>
