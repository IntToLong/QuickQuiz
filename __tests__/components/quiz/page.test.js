import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '@/app/quiz/page';
import { Provider, useDispatch } from 'react-redux';
import { configureStore as configureMockStore } from 'redux-mock-store';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	usePathname: jest.fn(),
}));

jest.mock('d3-ease', () => ({
	easeQuadInOut: jest.fn(),
}));

describe('Quiz page', () => {
	const initialState = {
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
					{
						question: 'What number is bigger than 10?',
						options: ['3', '4', '19', '-11'],
						answer: '19',
						explanation: '19 is bigger than 10.',
					},
				],
			},
			result: [],
			activeModal: false,
		},
	};
	const mockStore = configureMockStore();
	let store;
	let mockDispatch;

	beforeEach(() => {
		mockDispatch = jest.fn();
		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
		render(
			<Provider store={store}>
				<Quiz />
			</Provider>
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders quiz title when quiz is provided', () => {
		const heading = screen.getByRole('heading', {
			level: 1,
			name: /Basic Math Quiz/i,
		});

		expect(heading).toBeInTheDocument();
	});

	describe('Single question mode', () => {
		it('renders "Show all questions" button', () => {
			const showAllBtn = screen.getByRole('button', {
				name: /show all/i,
			});

			expect(showAllBtn).toBeInTheDocument();
		});

		it('renders only the first question in single question mode', () => {
			const showAllBtn = screen.getByRole('button', {
				name: /show all/i,
			});

			expect(showAllBtn).toBeInTheDocument();

			const questions = screen.getAllByRole('heading', { level: 3 });
			expect(questions).toHaveLength(1);
		});

		it('renders "Next question" button ', () => {
			const nextBtn = screen.getByRole('button', {
				name: /next question/i,
			});
			expect(nextBtn).toBeInTheDocument();
		});

		it('changes progress bar text after clicking on "Next question" button', async () => {
			const user = userEvent.setup();
			const progressEl = screen.getByRole('progressbar');
			expect(progressEl).toBeInTheDocument();

			const nextBtn = screen.getByRole('button', {
				name: /next question/i,
			});

			await user.click(nextBtn);

			await waitFor(() => {
				const progressText = screen.getByText('2 / 2');
				expect(progressText).toHaveTextContent('2 / 2');
			});
		});

		it('renders "Finish Quiz" button instead of "Next Question" on the last question', async () => {
			const user = userEvent.setup();

			const nextBtn = screen.getByRole('button', {
				name: /next question/i,
			});

			await user.click(nextBtn);

			await waitFor(() => {
				const progressText = screen.getByText('2 / 2');
				expect(progressText).toHaveTextContent('2 / 2');
				const finishQuizBtns = screen.getAllByText(/finish quiz/i);
				expect(finishQuizBtns).toHaveLength(2);
			});
		});

		it('shows the next quiz question after user selects an answer', async () => {
			const user = userEvent.setup();
			const option = screen.getByText('3');
			await user.click(option);

			await waitFor(() => {
				const nextQuestion = screen.getByText(
					/What number is bigger than 10?/i
				);
				expect(nextQuestion).toBeVisible();
			});
		});
	});

	describe('All questions mode', () => {
		it('renders all questions in all questions mode', async () => {
			const user = userEvent.setup();

			const showAllBtn = screen.getByRole('button', {
				name: /show all/i,
			});

			await user.click(showAllBtn);

			await waitFor(() => {
				const questions = screen.getAllByRole('heading', { level: 3 });
				expect(questions).toHaveLength(2);
			});
		});
	});

	it('renders progress bar showing "1/2" on the first question', () => {
		const progressEl = screen.getByRole('progressbar');
		expect(progressEl).toBeInTheDocument();
		const progressText = screen.getByText('1 / 2');
		expect(progressText).toHaveTextContent('1 / 2');
	});

	it('changes progress bar text after clicking on answer option', async () => {
		const user = userEvent.setup();
		const progressEl = screen.getByRole('progressbar');

		expect(progressEl).toBeInTheDocument();

		const option = screen.getByText('3');
		await user.click(option);

		await waitFor(() => {
			const progressText = screen.getByText('2 / 2');
			expect(progressText).toHaveTextContent('2 / 2');
		});
	});

	describe('Side effects', () => {
		it('dispatches openModal on clicking "Finish quiz" button below progress bar', async () => {
			const user = userEvent.setup();
			const finishBtns = screen.getAllByRole('button', {
				name: /finish quiz/i,
			});
			await user.click(finishBtns[0]);

			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/openModal',
				payload: 'result',
			});
		});

		it('dispatches openModal when answered on all questions', async () => {
			const user = userEvent.setup();
			const optionFirstQuestion = screen.getByText('3');
			await user.click(optionFirstQuestion);

			await waitFor(() => {
				const nextQuestion = screen.getByText(
					/What number is bigger than 10?/i
				);
				expect(nextQuestion).toBeVisible();
			});

			const optionSecondQuestion = screen.getByText('-11');
			await user.click(optionSecondQuestion);
			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/openModal',
				payload: 'result',
			});
		});

		it('dispatches openModal when clicking the "Next question" button and the "Finish quiz" button below the last question\'s answer options', async () => {
			const user = userEvent.setup();
			const nextBtn = screen.getByRole('button', {
				name: /next question/i,
			});
			await user.click(nextBtn);
			await waitFor(() => {
				const nextQuestion = screen.getByText(
					/What number is bigger than 10?/i
				);
				expect(nextQuestion).toBeVisible();
			});

			const finishBtns = screen.getAllByRole('button', {
				name: /finish quiz/i,
			});
			await user.click(finishBtns[1]);
			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/openModal',
				payload: 'result',
			});
		});

		it('dispatches addAnswerToResult for each unanswered question when clicking the "Finish quiz" button below the progress bar', async () => {
			const user = userEvent.setup();
			const finishBtns = screen.getAllByRole('button', {
				name: /finish quiz/i,
			});
			await user.click(finishBtns[0]);

			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/addAnswerToResult',
				payload: {
					answer: '19',
					explanation: '19 is bigger than 10.',
					isCorrect: false,
					options: ['3', '4', '19', '-11'],
					question: 'What number is bigger than 10?',
					questionIndex: 1,
					userAnswer: 'No answer provided.',
				},
			});

			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/addAnswerToResult',
				payload: {
					answer: '6',
					explanation: 'Counting sequentially, 6 follows 5.',
					isCorrect: false,
					options: ['3', '4', '6', '7'],
					question: 'What number comes after 5?',
					questionIndex: 0,
					userAnswer: 'No answer provided.',
				},
			});
		});
	});
});
