<script>
	import { HatGlasses } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1 class="flex items-center gap-2">
	<HatGlasses size={32} aria-hidden="true" />
	<span>{m.application_name()}</span>
</h1>
