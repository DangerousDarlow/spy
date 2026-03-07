import { browser } from '$app/environment';

type Settings = {
	user: {
		id: string;
		name: string;
	};
};

function createDefaultSettings(): Settings {
	return { user: { id: createUserId(), name: '' } };
}

function createUserId(): string {
	// crypto.randomUUID is only available in secure environments. It is not available when connecting to a local
	// http address such as a local build from a network device like my phone. http://localhost is treated as secure.
	const maybeRandomUUID = globalThis.crypto?.randomUUID;
	if (typeof maybeRandomUUID === 'function') {
		return maybeRandomUUID.call(globalThis.crypto);
	}

	return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
