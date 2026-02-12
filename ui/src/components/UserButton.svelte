<script>
	import { UserRoundPen } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	let isToggled = false;
</script>

<button
	aria-label={m.user_button_aria_label()}
	class={`flex gap-2 rounded-full bg-primary-500 p-3 text-white ${isToggled && 'rounded-lg'}`}
	on:click={() => {
		isToggled = !isToggled;
	}}
>
	<UserRoundPen size={40} />
</button>
