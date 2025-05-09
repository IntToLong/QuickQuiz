import React from 'react';
import '@testing-library/jest-dom';
import StatusMessage from '@/components/ui/status-message/status-message';
import { render, screen, within } from '@testing-library/react';
import robot from '@/public/robot-svgrepo-com.svg';
import warningRobot from '@/public/robot-outline-in-a-circle-svgrepo-com.svg';

describe('StatusMessage', () => {
	it('renders a component with "error" className when prop type="error"', () => {
		render(
			<StatusMessage
				messages={['Oops something went wrong.', 'Please try again.']}
				imgSrc={robot}
				imgAlt='robot icon'
				type='error'
			/>
		);
		let image = screen.getByRole('img');
		expect(image.closest('div')).toHaveClass('error');
	});

	it('renders a component with "warning" className when prop type is missing', () => {
		render(
			<StatusMessage
				messages={['Lots to do', 'this may take up to 20 seconds.']}
				imgSrc={warningRobot}
				imgAlt='robot icon'
			/>
		);
		let image = screen.getByRole('img');
		expect(image.closest('div')).toHaveClass('warning');
	});

	it('renders a component without text when messages prop is not provided', () => {
		render(
			<StatusMessage
				imgSrc={warningRobot}
				imgAlt='robot icon'
			/>
		);
		let image = screen.getByRole('img');
		let wrapper = image.closest('div');
		let pElements = within(wrapper).queryAllByRole('paragraph');
		expect(pElements).toHaveLength(0);
	});

	it('renders a component with three paragraphs when messages prop is ["Oops something went wrong.", "Please try again.", "Good luck"]', () => {
		render(
			<StatusMessage
				messages={[
					'Oops something went wrong.',
					'Please try again.',
					'Good luck',
				]}
				imgSrc={robot}
				imgAlt='robot icon'
			/>
		);
		let image = screen.getByRole('img');
		let wrapper = image.closest('div');
		let pElements = within(wrapper).getAllByRole('paragraph');
		expect(pElements).toHaveLength(3);
	});

});
