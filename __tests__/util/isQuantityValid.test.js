import { isQuantityValid } from '@/util/validation';

describe('isQuantityValid', () => {
	it('returns true if input 1', () => {
		expect(isQuantityValid(1)).toBe(true);
	});

	it('returns true when input is 20 (boundary)', () => {
		expect(isQuantityValid(20)).toBe(true);
	});

	it('returns false when input is 0 (boundary)', () => {
		expect(isQuantityValid(0)).toBe(false);
	});

	it('returns false when input is 21', () => {
		expect(isQuantityValid(21)).toBe(false);
	});

	it('returns false when input is -10', () => {
		expect(isQuantityValid(-10)).toBe(false);
	});

	it('returns false when input is a string', () => {
		expect(isQuantityValid('string')).toBe(false);
	});

	it('returns false when input is undefined', () => {
		expect(isQuantityValid()).toBe(false);
	});
});
