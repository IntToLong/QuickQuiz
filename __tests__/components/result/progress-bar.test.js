import '@testing-library/jest-dom';
import ProgressBar from '@/components/result/progress-bar/progress-bar';
import { render, screen } from '@testing-library/react';

jest.mock('d3-ease', () => ({
	easeQuadInOut: jest.fn(),
}));

describe('ProgressBar', () => {
	it('displays "80%" when percentOfCorrectAnswers is 80', () => {
		render(<ProgressBar percentOfCorrectAnswers={80} />);
		let text = screen.getByText('80%');
		expect(text).toBeInTheDocument();
	});

	it('displays "0%" when percentOfCorrectAnswers is 0', () => {
		render(<ProgressBar percentOfCorrectAnswers={0} />);
		let text = screen.getByText('0%');
		expect(text).toBeInTheDocument();
	});

	it('displays fallback "0%" when percentOfCorrectAnswers is missing', () => {
		render(<ProgressBar />);
		let text = screen.getByText('0%');
		expect(text).toBeInTheDocument();
	});
});
