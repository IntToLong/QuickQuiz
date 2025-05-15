import '@testing-library/jest-dom';
import ShortResult from '@/components/result/short-result/short-result';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { configureStore as configureMockStore } from 'redux-mock-store';

jest.mock('d3-ease', () => ({
	easeQuadInOut: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	usePathname: jest.fn(),
}));

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
}));

describe('ShortResult', () => {
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
				{
					questionIndex: 1,
					isCorrect: false,
					userAnswer: '19',
					question: 'What number is bigger than 10?',
					options: ['3', '4', '19', '-11'],
					answer: '19',
					explanation: '19 is bigger than 10.',
				},
			],
			activeModal: true,
		},
	};
	const mockStore = configureMockStore();
	let store;
	let mockDispatch;
	let openNewQuiz;

	beforeEach(() => {
		openNewQuiz = jest.fn();
		mockDispatch = jest.fn();
		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders ShortResult', () => {
		render(
			<Provider store={store}>
				<ShortResult />
			</Provider>
		);
	});

	it('renders ShortResult with correct props', () => {
		render(
			<Provider store={store}>
				<ShortResult
					percentOfCorrectAnswers={50}
					correct={1}
					incorrect={1}
					openNewQuiz={openNewQuiz}
				/>
			</Provider>
		);
	});

	it('renders "See details" and "New quiz" buttons', () => {
		render(
			<Provider store={store}>
				<ShortResult
					percentOfCorrectAnswers={50}
					correct={1}
					incorrect={1}
					openNewQuiz={openNewQuiz}
				/>
			</Provider>
		);
		const detailsBtn = screen.getByRole('button', { name: /see details/i });
		expect(detailsBtn).toBeInTheDocument();
		const newQuizBtn = screen.getByRole('button', { name: /new quiz/i });
		expect(newQuizBtn).toBeInTheDocument();
	});

	it('calls openNewQuiz function on "New Quiz" button click', async () => {
		render(
			<Provider store={store}>
				<ShortResult
					percentOfCorrectAnswers={50}
					correct={1}
					incorrect={1}
					openNewQuiz={openNewQuiz}
				/>
			</Provider>
		);
		const user = userEvent.setup();
		const newQuizBtn = screen.getByRole('button', { name: /new quiz/i });
		await user.click(newQuizBtn);
		expect(openNewQuiz).toHaveBeenCalledTimes(1);
	});

	it('navigates to "/quiz/result" on "See details" button click', async () => {
		usePathname.mockReturnValue('/quiz/result');
		render(
			<Provider store={store}>
				<ShortResult
					percentOfCorrectAnswers={50}
					correct={1}
					incorrect={1}
					openNewQuiz={openNewQuiz}
				/>
			</Provider>
		);
		const user = userEvent.setup();
		const detailsBtn = screen.getByRole('button', { name: /see details/i });
		await user.click(detailsBtn);
		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/quiz/result');
		});
	});

	it('navigates to "/" and close modal on "Cross" button click', async () => {
		usePathname.mockReturnValue('/');
		render(
			<Provider store={store}>
				<ShortResult
					percentOfCorrectAnswers={50}
					correct={1}
					incorrect={1}
					openNewQuiz={openNewQuiz}
				/>
			</Provider>
		);

		const user = userEvent.setup();
		const buttons = screen.getAllByRole('button');
		const crossBtn = buttons[0];
		await user.click(crossBtn);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/');
			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/closeModal',
			});
		});
	});
});
