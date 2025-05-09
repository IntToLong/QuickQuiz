'use client';
import ProgressBar from '@/components/result/progress-bar/progress-bar';

import styles from './result-header.module.css';

import CrossButton from '@/components/ui/cross-button/cross-button';

import { useState, useEffect } from 'react';

const cheerUpMessages = [
	'Keep trying — you\’re just getting started!',
	'Nice! Almost there, a bit more practice!',
	'Great job! You\’ve mastered it!',
];

export default function ResultHeader({
	closeResult,
	percentOfCorrectAnswers,
	correct,
	incorrect,
}) {
	const [cheerUpMessage, setCheerUpMessage] = useState(cheerUpMessages[1]);

	useEffect(() => {
		if (percentOfCorrectAnswers < 50) {
			setCheerUpMessage(cheerUpMessages[0]);
		} else if (percentOfCorrectAnswers > 80 && percentOfCorrectAnswers <= 100) {
			setCheerUpMessage(cheerUpMessages[2]);
		} else {
			setCheerUpMessage(cheerUpMessages[1]);
		}
	}, [percentOfCorrectAnswers]);

	
	return (
		<div className={styles.wrapper}>
			<CrossButton close={closeResult} />
			<h2 className={styles.header}>Your result:</h2>
			<div className={styles.progress}>
				<ProgressBar percentOfCorrectAnswers={percentOfCorrectAnswers} />
			</div>

			<div>
				<p>Correct answers: {correct}</p>
				<p>Incorrect answers: {incorrect}</p>
			</div>
			<p className={styles.message}>{cheerUpMessage}</p>
		</div>
	);
}
