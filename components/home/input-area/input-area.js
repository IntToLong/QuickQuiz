'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import NewQuiz from '@/components/quiz/new-quiz/new-quiz';
import Button from '@/components/ui/button/button';
import Modal from '@/components/ui/modal/modal';
import { openModal } from '@/store/quizSlice';

import styles from './input-area.module.css';

export default function InputArea() {
	const dispatch = useDispatch();

	const [userInput, setUserInput] = useState('');

	function handleInput(event) {
		setUserInput(event.target.value);
	}

	function handleModalOpening(event) {
		event.preventDefault();
		dispatch(openModal('newQuiz'));
	}

	return (
		<>
			<form
				className={styles.inputArea}
				onSubmit={handleModalOpening}>
				<input
					type='text'
					placeholder='Enter any topic'
					value={userInput}
					onChange={handleInput}
				/>
				<Button title='Create quiz' />
			</form>
			<Modal modalType='newQuiz'>
				<NewQuiz topic={userInput} />
			</Modal>
		</>
	);
}
