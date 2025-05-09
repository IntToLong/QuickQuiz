import { getRandomTemperature } from '@/util/validation';

const allowedValues = [0.6, 0.9, 1.1];

describe('getRandomTemperature', () => {

	it('returns value from array [0.6, 0.9, 1.1]', () => {
		expect(allowedValues).toContain(getRandomTemperature());
	});

	it('returns all possible values after multiple calls', () => {
		let set = new Set();
		for (let i = 0; i < 100; i++) {
			set.add(getRandomTemperature());
		}

		let result = [...allowedValues].filter((el) => set.has(el));
		expect(result.length).toBe(3);
	});

	it('returns value greater than or equal to 0.6', () => {
		expect(getRandomTemperature()).toBeGreaterThanOrEqual(0.6);
	});

	it('returns value less or equal to 1.1', () => {
		expect(getRandomTemperature()).toBeLessThanOrEqual(1.1);
	});
});
