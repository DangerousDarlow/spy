import { vi, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { settings } from '../settings/settings.svelte.ts';
import CreateGameWrapper from './CreateGameWrapper.svelte';

const { mockMutationFn } = vi.hoisted(() => ({
	mockMutationFn: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/navigation', () => ({ goto: vi.fn().mockResolvedValue(undefined) }));
vi.mock('$app/paths', () => ({ resolve: vi.fn((p: string) => p) }));

vi.mock('$lib/api/client/@tanstack/svelte-query.gen', () => ({
	createMutation: () => ({ mutationFn: mockMutationFn })
}));

beforeEach(() => {
	settings.user.id = 'test-player-id';
	settings.user.name = 'Test User';
	mockMutationFn.mockClear();
});

describe('CreateGame', () => {
	it('renders the heading', async () => {
		render(CreateGameWrapper);
		await expect
			.element(page.getByRole('heading', { name: 'Create a new game' }))
			.toBeInTheDocument();
	});

	it('renders a non-empty game name on mount', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByLabelText('Name')).not.toHaveValue('');
	});

	it('renders the product count input with default value 5', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByLabelText('Number of products')).toHaveValue('5');
	});

	it('renders exactly 5 product list items on initial render', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByRole('listitem').nth(4)).toBeInTheDocument();
		await expect.element(page.getByRole('listitem').nth(5)).not.toBeInTheDocument();
	});

	it('product list items are sorted alphabetically', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByRole('listitem').first()).toBeInTheDocument();

		const texts = page
			.getByRole('listitem')
			.elements()
			.map((el) => el.textContent ?? '');
		expect(texts).toEqual([...texts].sort());
	});

	it('changing product count to 3 renders 3 products', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByRole('listitem').first()).toBeInTheDocument();

		await page.getByLabelText('Number of products').fill('3');

		await expect.element(page.getByRole('listitem').nth(2)).toBeInTheDocument();
		await expect.element(page.getByRole('listitem').nth(3)).not.toBeInTheDocument();
	});

	it('changing product count to 10 renders 10 products', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByRole('listitem').first()).toBeInTheDocument();

		await page.getByLabelText('Number of products').fill('10');

		await expect.element(page.getByRole('listitem').nth(9)).toBeInTheDocument();
		await expect.element(page.getByRole('listitem').nth(10)).not.toBeInTheDocument();
	});

	it('clicking randomise name sets a new non-empty name', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByLabelText('Name')).not.toHaveValue('');

		const initialName = (page.getByLabelText('Name').element() as HTMLInputElement).value;
		await page.getByRole('button', { name: 'Randomise name' }).click();

		await expect.element(page.getByLabelText('Name')).not.toHaveValue('');
		await expect.element(page.getByLabelText('Name')).not.toHaveValue(initialName);
	});

	it('passes the Player-Id header from settings when creating a game', async () => {
		render(CreateGameWrapper);
		await page.getByRole('button', { name: 'Create' }).click();

		expect(mockMutationFn).toHaveBeenCalledOnce();
		expect(mockMutationFn.mock.calls[0][0].headers['Player-Id']).toBe('test-player-id');
	});

	it('disables all controls while mutation is pending', async () => {
		let resolve!: () => void;
		mockMutationFn.mockReturnValueOnce(new Promise<void>((res) => (resolve = res)));

		render(CreateGameWrapper);
		await page.getByRole('button', { name: 'Create' }).click();

		await expect.element(page.getByRole('button', { name: 'Create' })).toBeDisabled();
		await expect.element(page.getByLabelText('Name')).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Randomise name' })).toBeDisabled();
		await expect.element(page.getByLabelText('Number of products')).toBeDisabled();

		resolve();

		await expect.element(page.getByRole('button', { name: 'Create' })).toBeEnabled();
	});

	it('logs an error when the mutation fails', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const error = new Error('network failure');
		mockMutationFn.mockRejectedValueOnce(error);

		render(CreateGameWrapper);
		await page.getByRole('button', { name: 'Create' }).click();

		await vi.waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith('Failed to create game', error);
		});

		consoleSpy.mockRestore();
	});

	it('passes the current name and products in the mutation body', async () => {
		render(CreateGameWrapper);
		await expect.element(page.getByLabelText('Name')).not.toHaveValue('');
		const name = (page.getByLabelText('Name').element() as HTMLInputElement).value;

		await page.getByRole('button', { name: 'Create' }).click();

		expect(mockMutationFn).toHaveBeenCalledOnce();
		const body = mockMutationFn.mock.calls[0][0].body;
		expect(body.name).toBe(name);
		expect(body.products).toHaveLength(5);
		expect(body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
	});
});
