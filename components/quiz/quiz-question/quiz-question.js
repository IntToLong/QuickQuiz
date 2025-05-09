'use client';
import styles from './quiz-question.module.css';
import { useState } from 'react';

export default function QuizQuestion({
	question,
	questionIndex,
	single,
	showNextQuestion,
	quizQuestionsLength,
	handleAnswer,
	chosenOption,
	...props
}) {
	const [userOption, setUserOption] = useState(chosenOption);

	function handleUserAnswer(event, option, questionIndex, question) {
		setUserOption(option);
		handleAnswer(event, option, questionIndex, question);
	}

	return (
		<li className={styles.question}>
			<h3>
				<span>
					{questionIndex + 1}
					{'. '}
				</span>
				{question.question}
			</h3>
			<ul>
				{question?.options?.map((option, optionIndex) => {
					return (
						<li
							role='button'
							tabIndex={0}
							key={option + questionIndex}
							onClick={(event) =>
								handleUserAnswer(event, option, questionIndex, question)
							}
							className={userOption === option ? styles.chosenOption : ''}>
							{option}
						</li>
					);
				})}
			</ul>
			{single && (
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
						{quizQuestionsLength - 1 !== questionIndex
							? 'Next question'
							: 'Finish quiz'}
					</button>
				</div>
			)}
		</li>
	);
}
