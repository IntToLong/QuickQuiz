import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import quizReducer from '@/store/quizSlice';
import { renderHook } from '@testing-library/react';
import useQuizStats from '@/hooks/useQuizStats';

export function createTestStore(preloadedState) {
	return configureStore({
		reducer: {
			quiz: quizReducer,
		},
		preloadedState,
	});
}

export function withRedux(store) {
	return ({ children }) => <Provider store={store}>{children}</Provider>;
}
describe('useQuizStats', () => {
	let store;

	beforeEach(() => {
		store = createTestStore({
			quiz: {
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
				activeModal: false,
			},
		});
	});
	it('calculates quiz correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});
		expect(result.current.quiz.title).toBe('Basic Math Quiz');
	});

	it('calculates result correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});
		expect(result.current.result[0].userAnswer).toBe('6');
	});

	it('calculates quantity of correct answers correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});

		expect(result.current.correct).toBe(1);
	});

	it('calculates quantity of incorrect answers correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});
		expect(result.current.incorrect).toBe(0);
	});

	it('calculates percentage correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});

		expect(result.current.percentage).toBe(100);
	});

	it('sorts answers correctly', () => {
		const { result } = renderHook(() => useQuizStats(), {
			wrapper: withRedux(store),
		});

		expect(result.current.sortedAnswers[0].questionIndex).toBe(0);
	});

	describe('useQuizStats - when quiz and result are empty', () => {
		beforeEach(() => {
			store = createTestStore({
				quiz: {
					quiz: {},
					result: [],
					activeModal: false,
				},
			});
		});

		it('returns undefined for quiz.title', () => {
			const { result } = renderHook(() => useQuizStats(), {
				wrapper: withRedux(store),
			});

			expect(result.current.quiz.title).toBeUndefined();
		});

		it('returns 0 for percentage', () => {
			const { result } = renderHook(() => useQuizStats(), {
				wrapper: withRedux(store),
			});

			expect(result.current.percentage).toBe(0);
		});

		it('returns 0 for correct', () => {
			const { result } = renderHook(() => useQuizStats(), {
				wrapper: withRedux(store),
			});

			expect(result.current.correct).toBe(0);
		});

		it('returns 0 for incorrect', () => {
			const { result } = renderHook(() => useQuizStats(), {
				wrapper: withRedux(store),
			});

			expect(result.current.incorrect).toBe(0);
		});

		it('returns 0 for sortedAnswer.length', () => {
			const { result } = renderHook(() => useQuizStats(), {
				wrapper: withRedux(store),
			});

			expect(result.current.sortedAnswers).toHaveLength(0);
		});
	});
});
