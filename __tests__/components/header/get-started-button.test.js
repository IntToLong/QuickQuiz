import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import GetStartedButton from '@/components/header/get-started-button/get-started-button';
import { Provider, useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: jest.fn(),
}));

describe('GetStartedButton', () => {
	const initialState = { quiz: {}, result: [], activeModal: false };
	const mockStore = configureStore();
	let store;
	let mockDispatch;
	let user;

	beforeEach(() => {
		mockDispatch = jest.fn();
		store = mockStore(initialState);
		useDispatch.mockReturnValue(mockDispatch);
		user = userEvent.setup();
		render(
			<Provider store={store}>
				<GetStartedButton />
			</Provider>
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('button has the "Get Started" title', () => {
		const btn = screen.getByRole('button', { name: /Get Started/i });
		expect(btn).toBeInTheDocument();
	});

	it('button shows arrow icon when arrow prop is true', () => {
		const btn = screen.getByRole('button', { name: /Get Started/i });
		expect(within(btn).getByRole('img')).toBeInTheDocument();
	});

	it('dispatches openModal with "newQuiz" when clicked', async () => {
		const btn = screen.getByRole('button');
		await user.click(btn);
		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'quiz/openModal',
			payload: 'newQuiz',
		});
	});
});
