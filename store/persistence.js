export const STORAGE_KEY = 'quickquiz:quiz';

const isBrowser = () => typeof window !== 'undefined';

export function loadState() {
	if (!isBrowser()) return undefined;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return undefined;
		const parsed = JSON.parse(raw);
		return { quiz: parsed };
	} catch {
		clearState();
		return undefined;
	}
}

export function saveState(quizSlice) {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizSlice));
	} catch {
		// unavailable / quota — silent
	}
}

export function clearState() {
	if (!isBrowser()) return;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* silent */
	}
}

let enabled = true;

export const persistenceMiddleware = (store) => (next) => (action) => {
	const result = next(action);

	if (action.type === 'quiz/completeQuiz') {
		clearState();
		enabled = false;
		return result;
	}

	if (action.type === 'quiz/addQuiz') {
		enabled = true;
	}

	if (enabled) {
		const { quiz, result: answers, activeModal } = store.getState().quiz;
		saveState({ quiz, result: answers, activeModal });
	}

	return result;
};
