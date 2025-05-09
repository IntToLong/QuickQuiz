import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '@/store/quizSlice';
import Modal from '@/components/ui/modal/modal';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

const createTestStore = (preloadedState) =>
	configureStore({
		reducer: { quiz: quizReducer },
		preloadedState,
	});

describe('Modal', () => {
	let store;
	let pushMock;

	beforeEach(() => {
		document.body.innerHTML = '<div id="modal-root"></div>';
		pushMock = jest.fn();
		useRouter.mockReturnValue({ push: pushMock });

		store = createTestStore({
			quiz: { quiz: {}, result: [], activeModal: 'result' },
		});
	});

	it('renders modal when activeModal matches modalType', () => {
		render(
			<Provider store={store}>
				<Modal modalType='result'>Test Content</Modal>
			</Provider>
		);

		const modal = screen.getByTestId('modal');
		expect(modal).toBeInTheDocument();
	});

	it('does not render when modalRoot is missing', () => {
		document.body.innerHTML = '';

		render(
			<Provider store={store}>
				<Modal modalType='result'>Test Content</Modal>
			</Provider>
		);

		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
	});

	it('calls closeModal and redirects on dialog close for "result"', () => {
		render(
			<Provider store={store}>
				<Modal modalType='result'>Test Content</Modal>
			</Provider>
		);

		const dialog = screen.getByTestId('modal');

		dialog.close = jest.fn();

		dialog.dispatchEvent(new Event('close'));

		expect(store.getState().quiz.activeModal).toBeFalsy();
		expect(pushMock).toHaveBeenCalledWith('/');
	});
});
