import '@testing-library/jest-dom';
import DarkButton from '@/components/ui/dark-button/dark-button';
import { render, screen } from '@testing-library/react';

describe('Dark Button', () => {
	it('renders a button', () => {
		render(<DarkButton>Test Button</DarkButton>);
		let btn = screen.getByRole('button', { name: /test button/i });
		expect(btn).toBeInTheDocument();
	});
});
