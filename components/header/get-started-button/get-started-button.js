'use client';

import React from 'react';
import Button from '../../ui/button/button';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/quizSlice';

export default function GetStartedButton() {
	const dispatch = useDispatch();

	function handleModalOpening() {
		dispatch(openModal('newQuiz'));
	}

	return (
		<Button
			title='Get Started'
			arrow
			onClick={handleModalOpening}
		/>
	);
}
