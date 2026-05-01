import { describe, expect, it } from 'vitest';
import { getRandomProducts } from './getRandomProducts';

describe('getRandomProducts', () => {
	it('returns the requested number of products', () => {
		expect(getRandomProducts(5)).toHaveLength(5);
	});

	it('returns a sorted array', () => {
		const products = getRandomProducts(7);
		expect(products).toEqual([...products].sort());
	});

	it('returns no duplicate items', () => {
		const products = getRandomProducts(10);
		expect(new Set(products).size).toBe(10);
	});

	it('accepts the minimum count of 3', () => {
		expect(getRandomProducts(3)).toHaveLength(3);
	});

	it('accepts the maximum count of 10', () => {
		expect(getRandomProducts(10)).toHaveLength(10);
	});
});
