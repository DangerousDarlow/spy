import { vi, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

// Must be in a separate file because vi.mock is hoisted and applies for the
// entire module lifetime — you cannot toggle dev between tests in the same file.
vi.mock('$lib', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib')>();
	return { ...actual, dev: false };
});

import { settings } from './settings.svelte.ts';
import Settings from './Settings.svelte';

beforeEach(() => {
	settings.user.id = 'test-id-123';
	settings.user.name = '';
	localStorage.clear();
});

describe('Settings (production mode)', () => {
	it('renders the user-name input', async () => {
		render(Settings);
		await expect.element(page.getByLabelText('Name')).toBeInTheDocument();
	});

	it('does not render the user-id input', async () => {
		render(Settings);
		await expect.element(page.getByLabelText('ID')).not.toBeInTheDocument();
	});

	it('does not render the randomise button', async () => {
		render(Settings);
		await expect
			.element(page.getByRole('button', { name: 'Randomise ID and name' }))
			.not.toBeInTheDocument();
	});

	it('does not render the save button', async () => {
		render(Settings);
		await expect
			.element(page.getByRole('button', { name: 'Save to local storage' }))
			.not.toBeInTheDocument();
	});

	it('auto-saves to localStorage when a non-empty name is entered', async () => {
		render(Settings);
		await page.getByLabelText('Name').fill('Nick');

		const stored = localStorage.getItem('nd-spy-settings');
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored!).user.name).toBe('Nick');
	});

	it('does not auto-save when the name is whitespace only', async () => {
		render(Settings);
		await page.getByLabelText('Name').fill('   ');

		expect(localStorage.getItem('nd-spy-settings')).toBeNull();
	});
});
