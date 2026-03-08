import { APP_NAME } from './constants';
import { browser, dev as environmentDev } from '$app/environment';

const DEV_STORAGE_KEY = `${APP_NAME}-dev`;

function parseStringToBoolean(value: string | null): boolean | null {
	if (!value) return null;

	const normalised = value.trim().toLowerCase();
	if (normalised === '1' || normalised === 'true') return true;
	if (normalised === '0' || normalised === 'false') return false;
	return null;
}

function getDevValueFromLocalStorage(): boolean | null {
	if (!browser) return null;
	return parseStringToBoolean(localStorage.getItem(DEV_STORAGE_KEY));
}

export const dev = getDevValueFromLocalStorage() ?? environmentDev;
