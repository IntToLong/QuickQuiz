export function isQuantityValid(input) {
	return 0 < +input && +input <= 20;
}

export function safeParseJSON(jsonString, quantity) {
	try {
		const cleaned =
			jsonString
				.replace(/\n/g, ' ') // line feed
				.replace(/\t/g, ' ') // tab
				.replace(/\s{2,}/g, ' ') //two or more whitespace characters
				.trim()
				.match(/{.*}/s)?.[0] ?? '';

		const parsed = JSON.parse(cleaned);
		return isValidQuizObject(parsed, quantity)
			? { valid: true, data: parsed }
			: { valid: false, error: 'AI answer is not full.' };
	} catch (err) {
		return { valid: false, error: err.message };
	}
}

export function isValidQuizObject(obj, questionsQuantity) {
	if (!obj || Object.keys(obj).length === 0 || !questionsQuantity) {
		return false;
	}

	if (typeof obj.title !== 'string') {
		return false;
	}

	if (obj?.questions?.length !== questionsQuantity) {
		return false;
	}

	return obj.questions.every(
		(el) =>
			el.answer &&
			el.options &&
			el.options.length === 4 &&
			el.question &&
			el.explanation
	);
}

export function getRandomTemperature() {
	const temperatureValues = [0.6, 0.9, 1.1];
	return temperatureValues[Math.floor(Math.random() * 3)];
}
