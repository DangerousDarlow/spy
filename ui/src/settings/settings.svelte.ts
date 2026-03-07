import { browser } from '$app/environment';

type Settings = {
	user: {
		id: string;
		name: string;
	};
};

function createDefaultSettings(): Settings {
	return { user: { id: crypto.randomUUID(), name: '' } };
}

const SETTINGS_STORAGE_KEY = 'settings';

function loadSettingsFromLocalStorage(): Settings {
	if (!browser) {
		return createDefaultSettings();
	}

	const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
	if (!stored) {
		return createDefaultSettings();
	}

	try {
		return JSON.parse(stored);
	} catch {
		return createDefaultSettings();
	}
}

export function saveSettingsToLocalStorage() {
	if (!browser) return;
	localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export const settings = $state(loadSettingsFromLocalStorage());
