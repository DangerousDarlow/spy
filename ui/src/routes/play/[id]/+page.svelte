<script lang="ts">
	import { page } from '$app/state';
	import PlayGame from '../../../game/PlayGame.svelte';
</script>

<PlayGame gameId={page.params.id!} />
