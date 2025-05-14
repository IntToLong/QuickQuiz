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

	function handleUserAnswer(event, option, questionIndex, question) {
		if (isDisabled) return;
		setUserOption(option);
		onAnswer(event, option, questionIndex, question);
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
								onClick={(event) =>
									handleUserAnswer(event, option, questionIndex, question)
								}
								className={userOption === option ? styles.chosenOption : ''}>
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
						onClick={(event) =>
							handleUserAnswer(
								event,
								'No answer provided.',
								questionIndex,
								question
							)
						}>
						{isLastQuestion ? 'Finish quiz' : 'Next question'}
					</button>
				</div>
			)}
		</li>
	);
}
