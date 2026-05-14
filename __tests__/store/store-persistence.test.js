import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '@/store/quizSlice';
import {
	loadState,
	persistenceMiddleware,
	STORAGE_KEY,
} from '@/store/persistence';
import {
	addQuiz,
	addAnswerToResult,
	openModal,
	completeQuiz,
} from '@/store/quizSlice';

describe('store persistence integration', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('persists state after addQuiz action', () => {
		const store = configureStore({
			reducer: { quiz: quizReducer },
			preloadedState: loadState(),
			middleware: (gdm) => gdm().concat(persistenceMiddleware),
		});

		const quizPayload = {
			title: 'Test Quiz',
			questions: [
				{
					question: 'Q1?',
					options: ['A', 'B', 'C', 'D'],
					answer: 'A',
					explanation: 'Correct',
				},
			],
		};

		store.dispatch(addQuiz(quizPayload));

		const stored = window.localStorage.getItem(STORAGE_KEY);
		expect(stored).toBeDefined();

		const parsed = JSON.parse(stored);
		expect(parsed.quiz).toEqual(quizPayload);
		expect(parsed.result).toEqual([]);
		expect(parsed.activeModal).toBeNull();
	});

	it('persists state after addAnswerToResult action', () => {
		const store = configureStore({
			reducer: { quiz: quizReducer },
			preloadedState: loadState(),
			middleware: (gdm) => gdm().concat(persistenceMiddleware),
		});

		const quizPayload = {
			title: 'Test Quiz',
			questions: [
				{
					question: 'Q1?',
					options: ['A', 'B', 'C', 'D'],
					answer: 'A',
					explanation: 'Correct',
				},
			],
		};

		store.dispatch(addQuiz(quizPayload));
		store.dispatch(
			addAnswerToResult({
				questionIndex: 0,
				isCorrect: true,
				userAnswer: 'A',
				question: 'Q1?',
				options: ['A', 'B', 'C', 'D'],
				answer: 'A',
				explanation: 'Correct',
			})
		);

		const stored = window.localStorage.getItem(STORAGE_KEY);
		const parsed = JSON.parse(stored);
		expect(parsed.result).toHaveLength(1);
		expect(parsed.result[0].questionIndex).toBe(0);
		expect(parsed.result[0].isCorrect).toBe(true);
	});

	it('clears localStorage on completeQuiz and pauses subsequent saves', () => {
		const store = configureStore({
			reducer: { quiz: quizReducer },
			preloadedState: loadState(),
			middleware: (gdm) => gdm().concat(persistenceMiddleware),
		});

		const quizPayload = {
			title: 'Test Quiz',
			questions: [
				{
					question: 'Q1?',
					options: ['A', 'B', 'C', 'D'],
					answer: 'A',
					explanation: 'Correct',
				},
			],
		};

		store.dispatch(addQuiz(quizPayload));
		expect(window.localStorage.getItem(STORAGE_KEY)).toBeDefined();

		store.dispatch(openModal('result'));
		store.dispatch(completeQuiz());
		expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

		// Subsequent action should NOT re-save
		store.dispatch(openModal('newQuiz'));
		expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it('resumes persistence after addQuiz following completeQuiz', () => {
		const store = configureStore({
			reducer: { quiz: quizReducer },
			preloadedState: loadState(),
			middleware: (gdm) => gdm().concat(persistenceMiddleware),
		});

		const quiz1 = {
			title: 'Quiz 1',
			questions: [
				{
					question: 'Q1?',
					options: ['A', 'B', 'C', 'D'],
					answer: 'A',
					explanation: 'Correct',
				},
			],
		};

		const quiz2 = {
			title: 'Quiz 2',
			questions: [
				{
					question: 'Q2?',
					options: ['A', 'B', 'C', 'D'],
					answer: 'B',
					explanation: 'Correct',
				},
			],
		};

		store.dispatch(addQuiz(quiz1));
		store.dispatch(openModal('result'));
		store.dispatch(completeQuiz());
		expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

		store.dispatch(addQuiz(quiz2));
		const stored = window.localStorage.getItem(STORAGE_KEY);
		expect(stored).toBeDefined();

		const parsed = JSON.parse(stored);
		expect(parsed.quiz.title).toBe('Quiz 2');
	});

	it('hydrates state from localStorage on store creation', () => {
		const initialState = {
			quiz: {
				title: 'Saved Quiz',
				questions: [
					{
						question: 'Q1?',
						options: ['A', 'B', 'C', 'D'],
						answer: 'A',
						explanation: 'Correct',
					},
				],
			},
			result: [{ questionIndex: 0, isCorrect: true, userAnswer: 'A' }],
			activeModal: 'result',
		};

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));

		const store = configureStore({
			reducer: { quiz: quizReducer },
			preloadedState: loadState(),
			middleware: (gdm) => gdm().concat(persistenceMiddleware),
		});

		const state = store.getState();
		expect(state.quiz.quiz.title).toBe('Saved Quiz');
		expect(state.quiz.result).toHaveLength(1);
		expect(state.quiz.activeModal).toBe('result');
	});
});
