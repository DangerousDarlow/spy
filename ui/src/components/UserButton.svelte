<script lang="ts">
	import { Settings } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	let isToggled = false;
</script>

<button
	aria-label={m.user_button_aria_label()}
	class="btn rounded-full preset-filled-primary-500 p-4"
	on:click={() => {
		isToggled = !isToggled;
	}}
>
	<Settings size={40} />
</button>
