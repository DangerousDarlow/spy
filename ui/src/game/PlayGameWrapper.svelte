<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import PlayGame from './PlayGame.svelte';

	let { gameId }: { gameId: string } = $props();

	const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
</script>

<QueryClientProvider client={queryClient}>
	<PlayGame {gameId} />
</QueryClientProvider>
