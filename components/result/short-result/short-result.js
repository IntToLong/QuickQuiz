'use client';

import styles from './short-result.module.css';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { closeModal } from '@/store/quizSlice';
import ResultHeader from '../result-header/result-header';
import DarkButton from '@/components/ui/dark-button/dark-button';

export default function ShortResult({
	percentOfCorrectAnswers,
	correct,
	incorrect,
	openNewQuiz,
}) {
	const dispatch = useDispatch();
	const router = useRouter();

	function closeResultModal() {
		dispatch(closeModal());
		router.push('/');
	}

	function openSummary() {
		router.push('/quiz/result');
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.progress}>
				<ResultHeader
					percentOfCorrectAnswers={percentOfCorrectAnswers}
					correct={correct}
					incorrect={incorrect}
					closeResult={closeResultModal}
				/>
			</div>
			<div className={styles.buttons}>
				<DarkButton onClick={openSummary}>See Details</DarkButton>
				<DarkButton onClick={openNewQuiz}>New Quiz</DarkButton>
			</div>
		</div>
	);
}

