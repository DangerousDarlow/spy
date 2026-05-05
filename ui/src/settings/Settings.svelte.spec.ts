import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { settings } from './settings.svelte.ts';
import Settings from './Settings.svelte';

// In Vitest, $app/environment.dev is true by default, so dev mode is active.

beforeEach(() => {
	settings.user.id = 'test-id-123';
	settings.user.name = 'Test User';
	localStorage.clear();
});

describe('Settings (dev mode)', () => {
	it('renders the user-name input', async () => {
		render(Settings);
		await expect.element(page.getByLabelText('Name')).toBeInTheDocument();
	});

	it('renders the user-id input', async () => {
		render(Settings);
		await expect.element(page.getByLabelText('ID')).toBeInTheDocument();
	});

	it('renders the randomise button', async () => {
		render(Settings);
		await expect
			.element(page.getByRole('button', { name: 'Randomise ID and name' }))
			.toBeInTheDocument();
	});

	it('renders the save button', async () => {
		render(Settings);
		await expect
			.element(page.getByRole('button', { name: 'Save to local storage' }))
			.toBeInTheDocument();
	});

	it('clicking randomise updates both id and name to new non-empty values', async () => {
		render(Settings);
		await expect.element(page.getByLabelText('ID')).toHaveValue('test-id-123');

		await page.getByRole('button', { name: 'Randomise ID and name' }).click();

		await expect.element(page.getByLabelText('ID')).not.toHaveValue('test-id-123');
		await expect.element(page.getByLabelText('Name')).not.toHaveValue('Test User');
		await expect.element(page.getByLabelText('ID')).not.toHaveValue('');
		await expect.element(page.getByLabelText('Name')).not.toHaveValue('');
	});

	it('clicking save persists settings to localStorage', async () => {
		render(Settings);
		await page.getByRole('button', { name: 'Save to local storage' }).click();

		const stored = localStorage.getItem('nd-spy-settings');
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored!).user.name).toBe('Test User');
	});

	it('does not auto-save to localStorage when name changes', async () => {
		render(Settings);
		await page.getByLabelText('Name').fill('Changed Name');

		// $effect exits early when dev=true, so localStorage should remain untouched
		expect(localStorage.getItem('nd-spy-settings')).toBeNull();
	});
});
