<script lang="ts">
	import { HatGlasses } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<header class="sticky top-0 z-10 flex items-center justify-between gap-2 p-4">
	<h1 class="flex items-center gap-2">
		<HatGlasses size={32} aria-hidden="true" />
		<span>{m.application_name()}</span>
	</h1>

	{@render children?.()}
</header>
