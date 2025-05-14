'use client';

import { useState, useRef, createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { addAnswerToResult, openModal } from '@/store/quizSlice';
import QuizQuestion from '@/components/quiz/quiz-question/quiz-question';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Modal from '@/components/ui/modal/modal';
import useQuizStats from '@/hooks/useQuizStats';
import NewQuiz from '@/components/quiz/new-quiz/new-quiz';

import ShortResult from '@/components/result/short-result/short-result';

export default function Quiz() {
	const router = useRouter();
	const dispatch = useDispatch();
	const nodeRefs = useRef([]);
	const nodeRef = useRef();
	const [showAll, setShowAll] = useState(false);
	const [modalType, setModalType] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { result, quiz, correct, incorrect, percentage } = useQuizStats();
	const isQuiz = Object.keys(quiz).length > 0;

	useEffect(() => {
		setCurrentIndex(0);
	}, [quiz]);

	useEffect(() => {
		if (!isQuiz) {
			router.push('/');
		}
	}, [isQuiz]);

	useEffect(() => {
		nodeRefs.current = quiz.questions?.map(() => createRef()) || [];
	}, [quiz.questions]);

	const quizQuestionsLength = quiz.questions?.length;

	function handleAnswer(event, option, questionIndex, question) {
		let isCorrect = option === question.answer;

		if (
			showAll &&
			event &&
			currentIndex < quizQuestionsLength - 1 &&
			questionIndex === currentIndex
		) {
			setTimeout(() => {
				event.target
					.closest('div')
					.nextSibling?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 500);
		}

		if (!result.find((el) => el.questionIndex === questionIndex)) {
			dispatch(
				addAnswerToResult({
					questionIndex,
					isCorrect,
					userAnswer: option,
					...question,
				})
			);
		}

		if (event) {
			showNextQuestion();
		}
	}

	function toggleQuestionsView() {
		setShowAll((prev) => !prev);
	}

	function showNextQuestion() {
		if (currentIndex < quizQuestionsLength - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			dispatch(openModal('result'));
			setModalType('result');
		}
	}

	function finishQuiz() {
		for (let i = 0; i < quizQuestionsLength; i++) {
			const answeredQuestion = result.find(
				(el) => el.question === quiz.questions[i].question
			);
			if (answeredQuestion) {
				continue;
			}

			handleAnswer(null, 'No answer provided.', i, quiz.questions[i]);
		}
		dispatch(openModal('result'));
		setModalType('result');
	}

	function openNewQuiz() {
		setModalType('newQuiz');
		setTimeout(() => dispatch(openModal('newQuiz')), 300);
	}

	return (
		<div className={styles.wrapper}>
			{isQuiz > 0 && (
				<div className={styles.quiz}>
					<header className={styles.quiz_header}>
						<h1>{quiz.title}</h1>

						<section className={styles.quiz_progress}>
							<p>
								{currentIndex + 1} / {quizQuestionsLength}
							</p>
							<progress
								max={quizQuestionsLength}
								value={currentIndex + 1}>
								{currentIndex + 1}
							</progress>
						</section>

						<div className={styles.quiz_buttons}>
							<button
								className={styles.quiz_button}
								onClick={toggleQuestionsView}>
								{showAll ? 'Single Question View' : 'Show all questions'}
							</button>
							<button
								className={styles.quiz_button}
								onClick={finishQuiz}>
								Finish quiz
							</button>
						</div>
					</header>

					<div>
						<CSSTransition
							key={currentIndex}
							nodeRef={nodeRef}
							timeout={300}
							in={!showAll}
							unmountOnExit
							classNames='questionTransition'>
							<div ref={nodeRef}>
								<QuizQuestion
									question={quiz.questions[currentIndex]}
									questionIndex={currentIndex}
									showButton
									onAnswer={handleAnswer}
									isLastQuestion={currentIndex === quizQuestionsLength - 1}
								/>
							</div>
						</CSSTransition>
					</div>

					{showAll && (
						<TransitionGroup className={styles.questionContainer}>
							{quiz.questions.map((question, index) => {
								const answeredQuestion = result.find(
									(el) => el.questionIndex === index
								);
								return (
									<CSSTransition
										key={index}
										nodeRef={nodeRefs.current[index]}
										timeout={600}
										classNames='questionTransition'
										appear={true}
										in={showAll}
										unmountOnExit>
										<div ref={nodeRefs.current[index]}>
											<QuizQuestion
												question={question}
												questionIndex={index}
												onAnswer={handleAnswer}
												selectedOption={
													answeredQuestion ? answeredQuestion.userAnswer : null
												}
												isDisabled={!!answeredQuestion}
											/>
										</div>
									</CSSTransition>
								);
							})}
						</TransitionGroup>
					)}
				</div>
			)}

			<Modal modalType={modalType}>
				{modalType === 'result' && (
					<ShortResult
						percentOfCorrectAnswers={percentage}
						correct={correct}
						incorrect={incorrect}
						openNewQuiz={openNewQuiz}
					/>
				)}
				{modalType === 'newQuiz' && <NewQuiz />}
			</Modal>
		</div>
	);
}
