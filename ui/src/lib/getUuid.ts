export function getUuid():string {
	// crypto.randomUUID is only available in secure environments. It is not available when connecting to a local
	// http address such as a local build from a network device like my phone. http://localhost is treated as secure.
	const randomUUID = globalThis.crypto?.randomUUID;
	if (typeof randomUUID === 'function') {
		return randomUUID.call(globalThis.crypto);
	}

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
