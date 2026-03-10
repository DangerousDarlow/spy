export function getRandomStringFromArray(array: readonly string[]): string {
	if (array.length === 0) {
		throw new Error('array must not be empty');
	}

	return array[Math.floor(Math.random() * array.length)];
}

export function getRandomStringsFromArray(array: readonly string[], count: number): string[] {
	if (count < 0) {
		throw new Error('count must be greater than or equal to 0');
	}

	if (count > array.length) {
		throw new Error('count must be less than or equal to array length');
	}

	const shuffled = [...array];

	// Fisher–Yates shuffle
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled.slice(0, count);
}
