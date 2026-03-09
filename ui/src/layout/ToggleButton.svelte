<script lang="ts">
	import { Icon } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		toggled: boolean;
		onclick?: (toggled: boolean) => void;
		icon: typeof Icon;
		size?: number;
	}

	let { toggled = $bindable(), onclick, icon, size = 40 }: Props = $props();

	const IconComponent = $derived(icon);

	const clicked = () => {
		toggled = !toggled;
		if (onclick) {
			onclick(toggled);
		}
	};
</script>

<button
	class="toggle-button btn rounded-full preset-filled-primary-500 p-2"
	aria-label={m.settings_button_aria_label()}
	onclick={clicked}
>
	<IconComponent {size} />
</button>
