import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PlayGameWrapper from './PlayGameWrapper.svelte';

const TEST_GAME_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('PlayGame', () => {
	it('renders the heading', async () => {
		render(PlayGameWrapper, { props: { gameId: TEST_GAME_ID } });
		await expect.element(page.getByRole('heading', { name: 'Play game' })).toBeInTheDocument();
	});

	it('renders the game ID', async () => {
		render(PlayGameWrapper, { props: { gameId: TEST_GAME_ID } });
		await expect.element(page.getByText(TEST_GAME_ID)).toBeInTheDocument();
	});
});
