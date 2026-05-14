import {
	STORAGE_KEY,
	loadState,
	saveState,
	clearState,
	persistenceMiddleware,
} from '@/store/persistence';

describe('persistence', () => {
	beforeEach(() => {
		window.localStorage.clear();
		jest.clearAllMocks();
	});

	describe('loadState', () => {
		it('returns undefined when key is missing', () => {
			expect(loadState()).toBeUndefined();
		});

		it('returns { quiz: parsed } when key is valid JSON', () => {
			const mockState = {
				quiz: { title: 'Test Quiz' },
				result: [],
				activeModal: null,
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState));

			const loaded = loadState();
			expect(loaded).toEqual({ quiz: mockState });
		});

		it('clears the key and returns undefined when JSON is corrupted', () => {
			window.localStorage.setItem(STORAGE_KEY, 'not valid json{');

			const loaded = loadState();
			expect(loaded).toBeUndefined();
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
		});
	});

	describe('saveState', () => {
		it('writes the serialized object under STORAGE_KEY', () => {
			const state = {
				quiz: { title: 'Test' },
				result: [],
				activeModal: null,
			};

			saveState(state);
			const retrieved = window.localStorage.getItem(STORAGE_KEY);
			expect(JSON.parse(retrieved)).toEqual(state);
		});

		it('swallows errors when setItem throws', () => {
			const originalSetItem = window.localStorage.setItem;
			window.localStorage.setItem = jest.fn(() => {
				throw new Error('quota exceeded');
			});

			const state = {
				quiz: { title: 'Test' },
				result: [],
				activeModal: null,
			};

			expect(() => saveState(state)).not.toThrow();
			window.localStorage.setItem = originalSetItem;
		});
	});

	describe('clearState', () => {
		it('removes the key', () => {
			const state = {
				quiz: { title: 'Test' },
				result: [],
				activeModal: null,
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeDefined();

			clearState();
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
		});
	});

	describe('persistenceMiddleware', () => {
		let mockStore;
		let mockNext;
		let middleware;

		beforeEach(() => {
			mockNext = jest.fn((action) => action);
			mockStore = {
				getState: jest.fn(() => ({
					quiz: {
						quiz: { title: 'Test Quiz', questions: [] },
						result: [{ questionIndex: 0, isCorrect: true }],
						activeModal: 'result',
					},
				})),
			};
			middleware = persistenceMiddleware(mockStore)(mockNext);
		});

		it('saves state after addQuiz action', () => {
			middleware({ type: 'quiz/addQuiz', payload: { title: 'Test' } });
			const stored = window.localStorage.getItem(STORAGE_KEY);
			expect(stored).toBeDefined();

			const parsed = JSON.parse(stored);
			expect(parsed.quiz).toEqual({ title: 'Test Quiz', questions: [] });
			expect(parsed.result).toEqual([{ questionIndex: 0, isCorrect: true }]);
			expect(parsed.activeModal).toBe('result');
		});

		it('clears state and disables persistence on completeQuiz', () => {
			middleware({ type: 'quiz/addQuiz', payload: { title: 'Test' } });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeDefined();

			middleware({ type: 'quiz/completeQuiz' });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
		});

		it('skips saves after completeQuiz until addQuiz is dispatched', () => {
			middleware({ type: 'quiz/completeQuiz' });

			middleware({ type: 'quiz/openModal', payload: 'newQuiz' });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
		});

		it('re-enables persistence after addQuiz following completeQuiz', () => {
			middleware({ type: 'quiz/completeQuiz' });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

			middleware({ type: 'quiz/addQuiz', payload: { title: 'New' } });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeDefined();

			middleware({ type: 'quiz/openModal', payload: 'result' });
			expect(window.localStorage.getItem(STORAGE_KEY)).toBeDefined();
		});
	});
});
