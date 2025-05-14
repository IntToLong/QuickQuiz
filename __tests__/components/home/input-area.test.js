import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputArea from '@/components/home/input-area/input-area';
import { Provider, useDispatch } from 'react-redux';
import { configureStore as configureMockStore } from 'redux-mock-store';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

describe('InputArea (mocked dispatch)', () => {
	const initialState = { quiz: { quiz: {}, result: [], activeModal: false } };
	const mockStore = configureMockStore();
	let store;
	let mockDispatch;
	let user;

	beforeEach(() => {
		mockDispatch = jest.fn();
		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
		render(
			<Provider store={store}>
				<InputArea />
			</Provider>
		);
		user = userEvent.setup();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders an input field', () => {
		const input = screen.getByPlaceholderText(/Enter any topic/i);
		expect(input).toBeInTheDocument();
	});

	it('renders Create quiz button', () => {
		const btn = screen.getByRole('button', { name: /create quiz/i });
		expect(btn).toBeInTheDocument();
	});

	it('input value changes', async () => {
		const input = screen.getByPlaceholderText(/Enter any topic/i);
		await user.type(input, 'js');
		expect(input.value).toBe('js');
	});

	it('form is submitted with empty input dispatches openModal with "newQuiz" when clicked', async () => {
		const btn = screen.getByRole('button', { name: /create quiz/i });
		await user.click(btn);
		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'quiz/openModal',
			payload: 'newQuiz',
		});
	});

	it('form is submitted with input value "js" dispatches openModal with "newQuiz" when clicked', async () => {
		const input = screen.getByPlaceholderText(/Enter any topic/i);
		await user.type(input, 'js');
		const btn = screen.getByRole('button', { name: /create quiz/i });
		await user.click(btn);
		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'quiz/openModal',
			payload: 'newQuiz',
		});
	});
});
