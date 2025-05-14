import '@testing-library/jest-dom';
import Button from '@/components/ui/button/button';
import { render, screen, within } from '@testing-library/react';

describe('Button', () => {
	it('renders a button with an arrow icon when the "arrow" prop is provided', () => {
		render(
			<Button
				title='Test Button'
				arrow
			/>
		);
		let btn = screen.getByRole('button', { name: /test button/i });
		expect(within(btn).getByRole('img')).toBeInTheDocument();
	});

	it('renders a button without an arrow icon when the "arrow" prop is not provided', () => {
		render(<Button title='Test Button' />);
		let btn = screen.getByRole('button', { name: /test button/i });
		expect(within(btn).queryByRole('img')).not.toBeInTheDocument();
	});

	it('applies both the default "button" class and any additional class passed via className prop', () => {
		render(
			<Button
				title='Test Button'
				className='test'
			/>
		);
		let btn = screen.getByRole('button', { name: /test button/i });
		expect(btn).toHaveClass('button');
		expect(btn).toHaveClass('test');
	});
});
