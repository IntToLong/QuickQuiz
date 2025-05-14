'use client';
import styles from './quiz-question.module.css';
import { useState } from 'react';

export default function QuizQuestion({
	question,
	questionIndex,
	showButton,
	onAnswer,
	selectedOption,
	isDisabled,
	isLastQuestion,
	...props
}) {
	const [userOption, setUserOption] = useState(selectedOption);
	const NO_ANSWER = 'No answer provided.';

	function handleOptionClick(event, option) {
		if (isDisabled) return;
		setUserOption(option);
		onAnswer(event, option, questionIndex, question);
	}

	function handleNextClick(event) {
		if (isDisabled) return;
		setUserOption(NO_ANSWER);
		onAnswer(event, NO_ANSWER, questionIndex, question);
	}

	return (
		<li
			className={`${styles.question} ${isDisabled ? styles.disabled : ''}`}
			data-testid='question'>
			<h3>
				<span>
					{questionIndex + 1}
					{'. '}
				</span>
				{question.question}
			</h3>
			<ul>
				{question?.options?.map((option) => {
					return (
						<li key={`${questionIndex}-${option}`}>
							<button
								type='button'
								onClick={(event) => handleOptionClick(event, option)}
								className={
									userOption === option ? styles.chosenOption : undefined
								}>
								{option}
							</button>
						</li>
					);
				})}
			</ul>
			{showButton && (
				<div>
					<button
						className={styles.question_next}
						onClick={handleNextClick}>
						{isLastQuestion ? 'Finish quiz' : 'Next question'}
					</button>
				</div>
			)}
		</li>
	);
}
