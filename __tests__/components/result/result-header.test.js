import '@testing-library/jest-dom';
import ResultHeader from '@/components/result/result-header/result-header';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('d3-ease', () => ({
	easeQuadInOut: jest.fn(),
}));

describe('ResultHeader', () => {
	let closeResult;

	beforeEach(() => {
		closeResult = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders the heading', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={50}
				correct={1}
				incorrect={1}
			/>
		);
		const heading = screen.getByRole('heading', { name: /your result/i });
		expect(heading).toBeInTheDocument();
	});

	it('displays number of correct answers when correct prop is provided', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={50}
				correct={1}
				incorrect={1}
			/>
		);
		const correctAnswerText = screen.getByText('Correct answers: 1');
		expect(correctAnswerText).toBeInTheDocument();
	});

	it('displays number of incorrect answers when incorrect prop is provided', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={50}
				correct={1}
				incorrect={1}
			/>
		);
		const correctAnswerText = screen.getByText('Incorrect answers: 1');
		expect(correctAnswerText).toBeInTheDocument();
	});

	it('shows "Keep trying — you’re just getting started!" cheer-up message for less than 50 correct', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={25}
				correct={1}
				incorrect={3}
			/>
		);
		const cheerUpLess50 = screen.getByText(/just getting started/i);
		expect(cheerUpLess50).toBeInTheDocument();
	});
	it('shows "Nice! Almost there, a bit more practice!" cheer-up message for 50–80% correct', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={75}
				correct={3}
				incorrect={1}
			/>
		);
		const cheerUp50_80 = screen.getByText(/Almost there, a bit more practice/i);
		expect(cheerUp50_80).toBeInTheDocument();
	});

	it('shows "Great job! You’ve mastered it!" cheer-up message for more than 80 correct', () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={90}
				correct={9}
				incorrect={1}
			/>
		);
		const cheerUpMore80 = screen.getByText(/Great job/i);
		expect(cheerUpMore80).toBeInTheDocument();
	});

	it('calls closeResult function on "Cross" button click', async () => {
		render(
			<ResultHeader
				closeResult={closeResult}
				percentOfCorrectAnswers={50}
				correct={1}
				incorrect={1}
			/>
		);
		const user = userEvent.setup();
		const crossBtn = screen.getByRole('button');
		await user.click(crossBtn);
		expect(closeResult).toHaveBeenCalledTimes(1);
	});
});
