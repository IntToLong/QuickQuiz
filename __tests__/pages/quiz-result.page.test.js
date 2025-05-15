import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizResult from '@/app/quiz/result/page';
import { Provider, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { configureStore as configureMockStore } from 'redux-mock-store';
import useQuizStats from '@/hooks/useQuizStats';

const resultData = [
	{
		questionIndex: 0,
		isCorrect: true,
		userAnswer: '6',
		question: 'What number comes after 5?',
		options: ['3', '4', '6', '7'],
		answer: '6',
		explanation: 'Counting sequentially, 6 follows 5.',
	},
	{
		questionIndex: 1,
		isCorrect: false,
		userAnswer: '4',
		question: 'What number is bigger than 10?',
		options: ['3', '4', '19', '-11'],
		answer: '19',
		explanation: '19 is bigger than 10.',
	},
];

const quizData = {
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
};
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
}));

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

//mock default export
jest.mock('../../hooks/useQuizStats', () => ({
	__esModule: true,
	default: jest.fn(() => ({
		result: resultData,
		quiz: quizData,
		sortedAnswers: resultData,
		correct: 1,
		incorrect: 1,
		percentage: 50,
	})),
}));

describe('QuizResult page', () => {
	const initialState = {
		quiz: {
			quiz: quizData,
			result: resultData,
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
		const modalRoot = document.createElement('div');
		modalRoot.setAttribute('id', 'modal-root');
		document.body.appendChild(modalRoot);
	});

	afterEach(() => {
		const modalRoot = document.getElementById('modal-root');
		if (modalRoot) {
			modalRoot.remove();
		}
		jest.clearAllMocks();
	});

	it('renders "New quiz" button', () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const newBtn = screen.getByRole('button', {
			name: /New Quiz/i,
		});
		expect(newBtn).toBeInTheDocument();
	});

	it('dispatches openModal with "newQuiz" payload when "New quiz" button is clicked', async () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const user = userEvent.setup();
		const newBtn = screen.getByRole('button', {
			name: /New Quiz/i,
		});
		await user.click(newBtn);
		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'quiz/openModal',
			payload: 'newQuiz',
		});
	});

	it('renders correct answer block with "correct" class', () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const blockHeader = screen.getByRole('heading', {
			level: 4,
			name: /What number comes after 5/i,
		});

		expect(blockHeader.closest('li')).toHaveClass('correct');
	});

	it('renders correct answer block with "Your answer" and "Correct answer" paragraphs', () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const blockHeader = screen.getByRole('heading', {
			level: 4,
			name: /What number comes after 5/i,
		});
		const correctWrapper = blockHeader.closest('li');
		const yourAnswer = within(correctWrapper).getByText(/Your answer/i);
		expect(yourAnswer).toBeInTheDocument();
		const correctAnswer = within(correctWrapper).getByText(/correct answer/i);
		expect(correctAnswer).toBeInTheDocument();
	});

	it('renders incorrect answer block with "incorrect" class', () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const blockHeader = screen.getByRole('heading', {
			level: 4,
			name: /What number is bigger than 10/i,
		});

		expect(blockHeader.closest('li')).toHaveClass('incorrect');
	});

	it('renders incorrect answer block with "Your answer", "Correct answer" and "Explanation" paragraphs', () => {
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const blockHeader = screen.getByRole('heading', {
			level: 4,
			name: /What number is bigger than 10/i,
		});
		const incorrectWrapper = blockHeader.closest('li');
		const yourAnswer = within(incorrectWrapper).getByText(/Your answer/i);
		expect(yourAnswer).toBeInTheDocument();
		const correctAnswer = within(incorrectWrapper).getByText(/correct answer/i);
		expect(correctAnswer).toBeInTheDocument();
		const explanation = within(incorrectWrapper).getByText(/Explanation/i);
		expect(explanation).toBeInTheDocument();
	});

	it('does not display result content when activeModal is "newQuiz"', () => {
		store = mockStore({
			quiz: {
				quiz: quizData,
				result: resultData,
				activeModal: 'newQuiz',
			},
		});
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);

		const heading = screen.queryByRole('heading', { name: /your result/i });
		expect(heading).not.toBeInTheDocument();
	});

	it('displays newQuiz modal when "New quiz" button is clicked', async () => {
		const storeWithActiveModal = mockStore({
			quiz: {
				quiz: quizData,
				result: resultData,
				activeModal: 'newQuiz',
			},
		});

		render(
			<Provider store={storeWithActiveModal}>
				<QuizResult />
			</Provider>
		);

		const modal = await screen.findByTestId('modal');
		expect(modal).toBeInTheDocument();
	});

	it('navigates to home page when "Cross" button is clicked', async () => {
		usePathname.mockReturnValue('/');
		const user = userEvent.setup();
		render(
			<Provider store={store}>
				<QuizResult />
			</Provider>
		);
		const crossBtn = screen.getAllByRole('button')[0];

		await user.click(crossBtn);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/');
		});
	});

	it('redirects to home page when result and quiz are missing', async () => {
		usePathname.mockReturnValue('/');

		useQuizStats.mockReturnValue({
			result: [],
			quiz: {},
			sortedAnswers: [],
			correct: 0,
			incorrect: 0,
			percentage: 0,
		});

		const emptyStore = mockStore({
			quiz: {
				quiz: {},
				result: [],
				activeModal: null,
			},
		});
		render(
			<Provider store={emptyStore}>
				<QuizResult />
			</Provider>
		);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/');
		});
	});
});
