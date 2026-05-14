import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	quiz: {},
	result: [],
	activeModal: null,
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		addQuiz: (state, action) => {
			const data = action.payload;
			state.quiz = data;
		},

		clearQuiz: (state) => {
			state.quiz = {};
		},

		addAnswerToResult(state, action) {
			const data = action.payload;
			state.result.push(data);
		},

		clearResult(state) {
			state.result = [];
		},

		openModal(state, action) {
			state.activeModal = action.payload;
		},

		closeModal(state) {
			state.activeModal = null;
		},

		completeQuiz: () => {
			// No state mutation — exists as a persistence signal handled by middleware.
		},
	},
});

export const {
	addQuiz,
	clearQuiz,
	addAnswerToResult,
	clearResult,
	openModal,
	closeModal,
	completeQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
