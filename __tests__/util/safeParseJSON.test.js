import { safeParseJSON } from '@/util/validation';

const AIAnswer = `json \n
\t{
  "title": "Basic\n\nMath Quiz",
  "questions": [
      {
      "question": "What number comes after 5?",
      "options": \t["3             ", "4", "6", "7"],
      "answer": "6  ",
      "explanation": "Counting sequentially, 6 follows\n 5."
    }
  ]
}
`;

describe('safeParseJSON', () => {
	it('returns valid: true and parsed data when given a valid AI response and correct quantity', () => {
		let result = safeParseJSON(AIAnswer, +'1');
		expect(result.valid).toBe(true);
		expect(result.data).not.toBeUndefined();
	});

	it('returns valid: false if question count does not match quantity', () => {
		const result = safeParseJSON(AIAnswer, +'5');
		expect(result.valid).toBe(false);
        expect(result.error).not.toBeUndefined();
	});

	it('returns valid: false and an error message when quantity is missing', () => {
		let result = safeParseJSON(AIAnswer);
		expect(result.valid).toBe(false);
		expect(result.error).not.toBeUndefined();
	});

	it('returns valid: false and an error message when both arguments are missing', () => {
		let result = safeParseJSON();
		expect(result.valid).toBe(false);
		expect(result.error).not.toBeUndefined();
	});
});
