import '@testing-library/jest-dom';
import CrossButton from '@/components/ui/cross-button/cross-button';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let closeFunc;

beforeEach(() => {
	closeFunc = jest.fn();
});

describe('CrossButton', () => {
	it('renders a button with an image', () => {
		render(<CrossButton />);
		let btn = screen.getByRole('button');
        
		expect(within(btn).queryByRole('img')).toBeInTheDocument();
        expect(screen.getByAltText(/cross symbol/i)).toBeInTheDocument();

	});

	it('calls close function on button click', async () => {
		const user = userEvent.setup();
		render(<CrossButton close={closeFunc} />);

		let btn = screen.getByRole('button');
		await user.click(btn);
		expect(closeFunc).toHaveBeenCalledTimes(1);
	});
});
