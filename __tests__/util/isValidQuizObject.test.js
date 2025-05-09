import { isValidQuizObject } from '@/util/validation';

const validObj = {
	title: 'Basic Math Quiz',
	questions: [
		{
			question: 'What number comes after 5?',
			options: ['3', '4', '6', '7'],
			answer: '6',
			explanation: 'Counting sequentially, 6 follows 5.',
		},
	],
};

describe('isValidQuizObject', () => {
	it('returns true for a valid quiz object when question count matches the quantity', () => {
		expect(isValidQuizObject(validObj, 1)).toBe(true);
	});

	it('returns false when the object is missing the title property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.title;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when the object is missing the questions property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.questions;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when a question is missing the question property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.questions[0].question;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when a question is missing the answer property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.questions[0].answer;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when a question is missing the options property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.questions[0].options;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when a question has fewer than 4 options', () => {
		const invalidObj = { ...validObj };
		invalidObj.questions[0].options = ['3', '4', '6'];
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('returns false when a question is missing the explanation property', () => {
		const invalidObj = { ...validObj };
		delete invalidObj.questions[0].explanation;
		expect(isValidQuizObject(invalidObj, 1)).toBe(false);
	});

	it('return false when the quantity argument is missing', () => {
		expect(isValidQuizObject(validObj)).toBe(false);
	});

	it('returns false when both the object and quantity arguments are missing', () => {
		expect(isValidQuizObject()).toBe(false);
	});
});
