<script lang="ts">
	import { Icon } from 'lucide-svelte';

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

<button class="toggle-button btn rounded-full preset-filled-primary-500 p-4" onclick={clicked}>
	<IconComponent {size} />
</button>
