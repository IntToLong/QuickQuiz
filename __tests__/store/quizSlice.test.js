import reducer, {
	addQuiz,
	clearQuiz,
	addAnswerToResult,
	clearResult,
	openModal,
	closeModal,
} from '@/store/quizSlice';

test('should return the initial state', () => {
	expect(reducer(undefined, { type: 'unknown' })).toEqual({
		quiz: {},
		result: [],
		activeModal: null,
	});
});

test('should handle a quiz being added', () => {
	const previousState = {
		quiz: {},
		result: [],
		activeModal: null,
	};

	expect(
		reducer(
			previousState,
			addQuiz({
				title: 'Basic Math Quiz',
				questions: [
					{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					},
				],
			})
		)
	).toEqual({
		quiz: {
			title: 'Basic Math Quiz',
			questions: [
				{
					question: 'What number comes after 5?',
					options: ['3', '4', '6', '7'],
					answer: '6',
					explanation: 'Counting sequentially, 6 follows 5.',
				},
			],
		},
		result: [],
		activeModal: null,
	});
});

test('should handle clear quiz', () => {
	const previousState = {
		quiz: {
			title: 'Basic Math Quiz',
			questions: [
				{
					question: 'What number comes after 5?',
					options: ['3', '4', '6', '7'],
					answer: '6',
					explanation: 'Counting sequentially, 6 follows 5.',
				},
			],
		},
		result: [],
		activeModal: false,
	};

	expect(reducer(previousState, clearQuiz())).toEqual({
		quiz: {},
		result: [],
		activeModal: false,
	});
});

test('should handle a result being added', () => {
	const previousState = {
		quiz: {},
		result: [],
		activeModal: null,
	};

	expect(
		reducer(
			previousState,
			addAnswerToResult({
				questionIndex: 0,
				isCorrect: true,
				userAnswer: '6',
				question: 'What number comes after 5?',
				options: ['3', '4', '6', '7'],
				answer: '6',
				explanation: 'Counting sequentially, 6 follows 5.',
			})
		)
	).toEqual({
		quiz: {},
		result: [
			{
				questionIndex: 0,
				isCorrect: true,
				userAnswer: '6',
				question: 'What number comes after 5?',
				options: ['3', '4', '6', '7'],
				answer: '6',
				explanation: 'Counting sequentially, 6 follows 5.',
			},
		],
		activeModal: null,
	});
});

test('should handle clear result', () => {
	const previousState = {
		quiz: {},
		result: [
			{
				questionIndex: 0,
				isCorrect: true,
				userAnswer: '6',
				question: 'What number comes after 5?',
				options: ['3', '4', '6', '7'],
				answer: '6',
				explanation: 'Counting sequentially, 6 follows 5.',
			},
		],
		activeModal: null,
	};

	expect(reducer(previousState, clearResult())).toEqual({
		quiz: {},
		result: [],
		activeModal: null,
	});
});

test('should handle activeModal change', () => {
	const previousState = {
		quiz: {},
		result: [],
		activeModal: null,
	};

	expect(reducer(previousState, openModal('result'))).toEqual({
		quiz: {},
		result: [],
		activeModal: 'result',
	});
});

test('should handle reset activeModal', () => {
	const previousState = {
		quiz: {},
		result: [],
		activeModal: 'result',
	};

	expect(reducer(previousState, closeModal())).toEqual({
		quiz: {},
		result: [],
		activeModal: null,
	});
});
