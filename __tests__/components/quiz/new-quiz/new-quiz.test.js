import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewQuiz from '@/components/quiz/new-quiz/new-quiz';
import { Provider, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
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

describe('NewQuiz', () => {
	const initialState = { quiz: { quiz: {}, result: [], activeModal: true } };
	const quiz = {
		title: 'Basic Math Quiz',
		questions: [
			{
				question: 'What number comes after 5?',
				options: ['3', '4', '6', '7'],
				answer: '6',
				explanation: 'Counting sequentially, 6 follows 5.',
			},
		],
	};
	const mockStore = configureMockStore();
	let store;
	let mockDispatch;
	let abortFn;

	beforeEach(() => {
		mockDispatch = jest.fn();
		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
		abortFn = jest.fn();
		global.AbortController = jest.fn(() => ({
			signal: {},
			abort: abortFn,
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('UI rendering and interactions', () => {
		it('renders input with topic value if the topic prop is provided', () => {
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const input = screen.getByRole('textbox', { name: /enter your/i });
			expect(input).toHaveValue('test');
		});

		it('the form initializes with the correct default values ("five" quantity, "novice" difficulty)', () => {
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const fiveQuantity = screen.getByRole('radio', {
				name: '5',
			});
			expect(fiveQuantity).toBeChecked();

			const difficulty = screen.getByRole('radio', {
				name: /novice/i,
			});
			expect(difficulty).toBeChecked();
		});

		it('changes complexity when a different difficulty is chosen', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const expertDifficulty = screen.getByRole('radio', {
				name: /expert/i,
			});

			await user.click(expertDifficulty);
			expect(expertDifficulty).toBeChecked();
		});

		it('changes quantity when another radio option is selected', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const tenQuantity = screen.getByRole('radio', {
				name: '10',
			});

			await user.click(tenQuantity);
			expect(tenQuantity).toBeChecked();
		});

		it('changes quantity when user types a custom value', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.type(customQuantity, '2');
			expect(customQuantity).toHaveValue(2);
		});

		it('unchecks radio quantity options when user chooses the custom quantity input', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const fiveQuantity = screen.getByRole('radio', {
				name: '5',
			});
			await user.click(fiveQuantity);

			const tenQuantity = screen.getByRole('radio', {
				name: '10',
			});

			await user.click(tenQuantity);

			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.click(customQuantity);

			expect(fiveQuantity).not.toBeChecked();
			expect(tenQuantity).not.toBeChecked();
		});

		it('shows warning message when quantity > 14', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);

			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.type(customQuantity, '20');

			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(
					screen.getByText(/Lots to do/i).closest('div')
				).toBeInTheDocument();
				expect(screen.getByText(/Lots to do/i)).toBeVisible();
				expect(screen.getByText(/Lots to do/i).closest('div')).toHaveClass(
					'warning'
				);
			});
		});

		it('shows Creating quiz button text after form submitting', async () => {
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);

			const submitBtn = screen.getByRole('button', {
				name: /Create quiz/i,
			});

			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(submitBtn).toHaveTextContent('Creating quiz...');
			});
		});

		it('disabling submit button while form is submitting', async () => {
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);

			const submitBtn = screen.getByRole('button', {
				name: 'Create quiz',
			});

			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(submitBtn).toBeDisabled();
			});
		});

		it('shows error message if Create quiz request has non-200 response', async () => {
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					json: () => Promise.resolve({ error: 'Failed to generate quiz' }),
				})
			);
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				const errorText = screen.getByText(/Oops something went wrong/i);
				expect(errorText.closest('div')).toBeInTheDocument();
				expect(errorText.closest('div')).toHaveClass('error');
				expect(fetch).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Form validation', () => {
		beforeEach(() => {
			render(
				<Provider store={store}>
					<NewQuiz />
				</Provider>
			);
		});

		it('shows an error message and styles when topic length < 2 on submit', async () => {
			const user = userEvent.setup();

			const topicInput = screen.getByRole('textbox', { name: /enter your/i });

			await user.type(topicInput, 'a');

			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			const topicLabel = await screen.findByText(/enter your/i);

			const errorMessage = await screen.findByText(/at least two/i);

			expect(topicLabel).toHaveClass('form_topic__error');
			expect(errorMessage).toBeInTheDocument();
		});

		it('hides error topic message after valid topic is entered and submit is clicked', async () => {
			const user = userEvent.setup();

			const topicInput = screen.getByRole('textbox', {
				name: /enter your/i,
			});

			await user.type(topicInput, 'a');

			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			const topicLabel = await screen.findByText(/enter your/i);

			const errorMessage = await screen.findByText(/at least two/i);

			expect(topicLabel).toHaveClass('form_topic__error');
			expect(errorMessage).toBeInTheDocument();

			await user.type(topicInput, 'test');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(topicLabel).not.toHaveClass('form_topic__error');
				expect(errorMessage).not.toBeInTheDocument();
			});
		});

		it('shows an error style for "Other quantity" input when input <= 0', async () => {
			const user = userEvent.setup();

			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.type(customQuantity, '-2');

			const submitBtn = screen.getByRole('button', {
				name: 'Create quiz',
			});

			await user.click(submitBtn);

			const customQuantityLabel = await screen.findByText(/Other quantity/i);
			expect(customQuantityLabel.closest('div')).toHaveClass(
				'form_option__error'
			);
		});

		it('shows an error style for "Other quantity" input when input > 20', async () => {
			const user = userEvent.setup();

			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.type(customQuantity, '42');

			const submitBtn = screen.getByRole('button', {
				name: 'Create quiz',
			});

			await user.click(submitBtn);

			const customQuantityLabel = await screen.findByText(/Other quantity/i);
			expect(customQuantityLabel.closest('div')).toHaveClass(
				'form_option__error'
			);
		});

		it('hides an error style for "Other quantity" input when valid input is entered', async () => {
			const user = userEvent.setup();

			const customQuantity = screen.getByRole('spinbutton', {
				name: /Other quantity/i,
			});

			await user.type(customQuantity, '42');

			const submitBtn = screen.getByRole('button', {
				name: 'Create quiz',
			});

			await user.click(submitBtn);

			const customQuantityLabel = await screen.findByText(/Other quantity/i);
			expect(customQuantityLabel.closest('div')).toHaveClass(
				'form_option__error'
			);

			await user.type(customQuantity, '12');
			expect(customQuantityLabel.closest('div')).not.toHaveClass(
				'form_option__error'
			);
		});
	});

	describe('Side-effects', () => {
		it('dispatching closeModal when Cancel button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const btn = screen.getByRole('button', { name: /cancel/i });
			await user.click(btn);
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'quiz/closeModal',
			});
		});

		it('aborts Create quiz request when Cancel button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() =>
				expect(global.AbortController).toHaveBeenCalledTimes(1)
			);

			const cancelBtn = screen.getByRole('button', { name: /cancel/i });
			await user.click(cancelBtn);

			expect(abortFn).toHaveBeenCalledTimes(1);
		});

		it('routes to /quiz page when request is successful', async () => {
			usePathname.mockReturnValue('/quiz');
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							result: quiz,
						}),
				})
			);
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(fetch).toHaveBeenCalledTimes(1);
				expect(mockPush).toHaveBeenCalledWith('/quiz');
			});
		});

		it('dispatching addQuiz when request is successful', async () => {
			usePathname.mockReturnValue('/quiz');
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							result: quiz,
						}),
				})
			);
			render(
				<Provider store={store}>
					<NewQuiz topic='test' />
				</Provider>
			);
			const form = screen.getByTestId('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(mockDispatch).toHaveBeenCalledWith({
					type: 'quiz/addQuiz',
					payload: quiz,
				});
			});
		});
	});
});
