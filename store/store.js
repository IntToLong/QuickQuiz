
import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';
import { loadState, persistenceMiddleware } from './persistence';

const store = configureStore({
	reducer: {
		quiz: quizReducer,
	},
	preloadedState: loadState(),
	middleware: (gdm) => gdm().concat(persistenceMiddleware),
});

export default store;
