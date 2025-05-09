'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { openModal } from '@/store/quizSlice';
import ResultHeader from '@/components/result/result-header/result-header';
import useQuizStats from '@/hooks/useQuizStats';
import NewQuiz from '@/components/quiz/new-quiz/new-quiz';
import Modal from '@/components/ui/modal/modal';

import styles from './page.module.css';

export default function QuizResult() {
	const dispatch = useDispatch();
	const router = useRouter();
	const activeModal = useSelector((state) => state.quiz.activeModal);
	const { result, quiz, sortedAnswers, correct, incorrect, percentage } =
		useQuizStats();

	const quizKeysLength = Object.keys(quiz).length;

	useEffect(() => {
		if (result.length < 1 && quizKeysLength < 1) {
			router.push('/');
		}
	}, [result.length, quiz]);

	function closeResult() {
		router.push('/');
	}

	function handleNewQuiz() {
		dispatch(openModal('newQuiz'));
	}

	return (
		<div className={styles.wrapper}>
			{!(activeModal === 'newQuiz') && (
				<main className={styles.summary}>
					<div>
						<ResultHeader
							percentOfCorrectAnswers={percentage}
							correct={correct}
							incorrect={incorrect}
							closeResult={closeResult}
						/>

						<p className={styles.summary_actions}>
							<button
								className={styles.summary_action}
								onClick={handleNewQuiz}>
								New Quiz
							</button>
						</p>
					</div>

					<ul>
						{sortedAnswers.map((answer) => {
							return (
								<li
									key={answer.questionIndex}
									className={`${
										answer.isCorrect ? styles.correct : styles.incorrect
									} ${styles.answer}`}>
									<h4>{`${answer.questionIndex + 1}. ${answer.question}`}</h4>
									<p>Your answer: {answer.userAnswer}</p>
									<p>Correct answer: {answer.answer}</p>
									{!answer.isCorrect && (
										<p>Explanation: {answer.explanation}</p>
									)}
								</li>
							);
						})}
					</ul>
				</main>
			)}
			<Modal modalType='newQuiz'>
				<NewQuiz />
			</Modal>
		</div>
	);
}
