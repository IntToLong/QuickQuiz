import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import Header from '@/components/header/header/header';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';


jest.mock('next/navigation', () => ({
	usePathname: jest.fn(),
}));

describe('Header', () => {
	const initialState = { quiz: {}, result: [], activeModal: false };
	const mockStore = configureStore();
	let store;

	beforeEach(() => {
		store = mockStore(initialState);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders a header', () => {
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const header = screen.getByRole('banner');
		expect(header).toBeInTheDocument();
	});

	it('renders logo image', () => {
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const header = screen.getByRole('banner');
		const link = within(header).getByRole('link');
		const logoImg = within(link).getByRole('img', { hidden: true });
		expect(logoImg).toBeInTheDocument();
	});

	it('logo image displayed with alt="logo"', () => {
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const header = screen.getByRole('banner');
		const link = within(header).getByRole('link');
		const logoImg = within(link).getByRole('img', { hidden: true });
		expect(logoImg.alt).toContain('logo');
	});

	it('renders "QuickQuiz AI" text', () => {
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const paragraph = screen.getByText(/QuickQuiz AI/i);
		expect(paragraph).toBeVisible();
	});

	it('the <Link> points to "/" (the homepage)', () => {
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const header = screen.getByRole('banner');
		const link = within(header).getByRole('link');
		expect(link.getAttribute('href')).toBe('/');
	});

	it('renders "Get Started" button if pathname is "/"', async () => { // потрбіно рендерити після зміни пасу, тому що пас змінюється коли компонент уже відображений!! 
		usePathname.mockReturnValue('/');
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);

		const header = screen.getByRole('banner');
		const startBtn = await within(header).findByText(/get started/i);
		expect(startBtn).toBeVisible();
	});

	it('does not render "Get Started" button if not on "/"', () => {
		usePathname.mockReturnValue('/quiz');
		render(
			<Provider store={store}>
				<Header />
			</Provider>
		);
		const header = screen.getByRole('banner');
		const startBtn = within(header).queryByText(/get started/i);

		expect(startBtn).not.toBeInTheDocument();
	});
});
