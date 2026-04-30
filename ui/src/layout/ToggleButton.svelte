<script lang="ts">
	import { Icon } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		toggled: boolean;
		onclick?: (toggled: boolean) => void;
		icon: typeof Icon;
		size?: number;
		disabled?: boolean;
	}

	let { toggled = $bindable(), onclick, icon, size = 40, disabled = false }: Props = $props();

	const IconComponent = $derived(icon);

	const clicked = () => {
		if (disabled) return;

		toggled = !toggled;

		if (onclick) onclick(toggled);
	};
</script>

<button
	class="toggle-button btn rounded-full preset-filled-primary-500 p-2"
	title={m.settings_button_title()}
	onclick={clicked}
	{disabled}
>
	<IconComponent {size} />
</button>
