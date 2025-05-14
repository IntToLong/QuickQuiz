import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizQuestion from '@/components/quiz/quiz-question/quiz-question';
import { Provider, useDispatch } from 'react-redux';
import { configureStore as configureMockStore } from 'redux-mock-store';

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

describe('QuizQuestion', () => {
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
	let handleAnswer;

	beforeEach(() => {
		mockDispatch = jest.fn();
		handleAnswer = jest.fn();

		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders question component when valid data is provided', () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={false}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const question = screen.getByTestId('question');

		expect(question).toBeInTheDocument();
	});

	it('renders "Next question" button when isLastQuestion prop is false', () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={false}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const nextBtn = screen.getByRole('button', { name: /next/i });
		expect(nextBtn).toBeInTheDocument();
	});

	it('renders "Finish quiz" button instead of "Next question" button when isLastQuestion prop is true', async () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={true}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const nextBtn = screen.queryByRole('button', { name: /next/i });
		expect(nextBtn).toBeNull();

		const finishBtn = screen.getByRole('button', { name: /finish/i });
		expect(finishBtn).toBeInTheDocument();
	});

	it('renders component without "Next question" or "Finish quiz" button when showButton prop is not provided', () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					isLastQuestion={false}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const nextBtn = screen.queryByRole('button', { name: /next/i });
		expect(nextBtn).not.toBeInTheDocument();
		const finishBtn = screen.queryByRole('button', { name: /finish/i });
		expect(finishBtn).not.toBeInTheDocument();
	});

	it('disables question component when isDisabled is true', () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={true}
					onAnswer={handleAnswer}
					isDisabled
				/>
			</Provider>
		);

		const questionBlock = screen.getByTestId('question');
		expect(questionBlock).toHaveClass('disabled');
	});

	it('answer options don’t respond on click when isDisabled is true', async () => {
		const user = userEvent.setup();
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={true}
					onAnswer={handleAnswer}
					isDisabled
				/>
			</Provider>
		);
		const questionBlock = screen.getByTestId('question');

		const options = within(questionBlock).getAllByRole('button');

		for (let option of options) {
			await user.click(option);
			expect(handleAnswer).not.toHaveBeenCalled();
		}
	});

	it('calls onAnswer when an option is clicked and isDisabled is false', async () => {
		const user = userEvent.setup();
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={true}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const questionBlock = screen.getByTestId('question');

		const option = within(questionBlock).getByRole('button', { name: '3' });

		await user.click(option);

		expect(handleAnswer).toHaveBeenCalledTimes(1);

		expect(handleAnswer.mock.calls[0][1]).toBe('3');
		expect(handleAnswer.mock.calls[0][2]).toBe(0);
		expect(handleAnswer.mock.calls[0][3]).toEqual({
			answer: '6',
			explanation: 'Counting sequentially, 6 follows 5.',
			options: ['3', '4', '6', '7'],
			question: 'What number comes after 5?',
		});
	});

	it('calls onAnswer when "Next question" button is clicked and isDisabled is false', async () => {
		const user = userEvent.setup();
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					showButton
					isLastQuestion={false}
					onAnswer={handleAnswer}
				/>
			</Provider>
		);
		const nextBtn = screen.getByRole('button', { name: /next/i });

		await user.click(nextBtn);

		expect(handleAnswer).toHaveBeenCalledTimes(1);

		expect(handleAnswer.mock.calls[0][1]).toBe('No answer provided.');
		expect(handleAnswer.mock.calls[0][2]).toBe(0);
		expect(handleAnswer.mock.calls[0][3]).toEqual({
			answer: '6',
			explanation: 'Counting sequentially, 6 follows 5.',
			options: ['3', '4', '6', '7'],
			question: 'What number comes after 5?',
		});
	});

	it('render selected option with chosenOption class', async () => {
		render(
			<Provider store={store}>
				<QuizQuestion
					question={{
						question: 'What number comes after 5?',
						options: ['3', '4', '6', '7'],
						answer: '6',
						explanation: 'Counting sequentially, 6 follows 5.',
					}}
					questionIndex={0}
					isLastQuestion={false}
					onAnswer={handleAnswer}
					selectedOption={'4'}
				/>
			</Provider>
		);

		const questionBlock = screen.getByTestId('question');

		const option = within(questionBlock).getByRole('button', { name: '4' });

		expect(option).toHaveClass('chosenOption');

		const allOptions = within(questionBlock).getAllByRole('button');
		const chosen = allOptions.filter((btn) =>
			btn.classList.contains('chosenOption')
		);
		expect(chosen).toHaveLength(1);
	});
});
