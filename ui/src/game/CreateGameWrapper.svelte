<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import CreateGame from './CreateGame.svelte';

	const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
</script>

<QueryClientProvider client={queryClient}>
	<CreateGame />
</QueryClientProvider>
