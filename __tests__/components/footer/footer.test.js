import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../../../components/footer/footer';

describe('Footer', () => {
	beforeEach(() => {
		render(<Footer />);
	});

	it('renders a footer', () => {
		const footer = screen.getByRole('contentinfo');
		expect(footer).toBeInTheDocument();
	});

	it('contains copyright text', () => {
		const paragraph = screen.getByText(/QuickQuiz AI. All Rights Reserved./i);

		expect(paragraph).toBeInTheDocument();
	});

	it('contains four social media icons', () => {
		const icons = screen.getAllByRole('img', {
			hidden: true,
		});

		expect(icons).toHaveLength(4);
	});

	it('renders Facebook icon', () => {
		const facebookImg = screen.getByAltText(/facebook/i);
		expect(facebookImg).toBeInTheDocument();
	});

	it('renders Linkedin icon', () => {
		const linkedinImg = screen.getByAltText(/linkedin/i);
		expect(linkedinImg).toBeInTheDocument();
	});

	it('renders X icon', () => {
		const xImg = screen.getByAltText(/x/i);
		expect(xImg).toBeInTheDocument();
	});

	it('renders youtube icon', () => {
		const youtubeImg = screen.getByAltText(/youtube/i);
		expect(youtubeImg).toBeInTheDocument();
	});
});
