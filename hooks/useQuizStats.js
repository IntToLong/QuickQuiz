import { useSelector } from 'react-redux';

export default function useQuizStats() {
	const result = useSelector((state) => state.quiz.result);
	const quiz = useSelector((state) => state.quiz.quiz);
	const sortedAnswers = [...result].sort(
		(a, b) => a.questionIndex - b.questionIndex
	);
	const correct = sortedAnswers.reduce(
		(acc, cur) => acc + (cur.isCorrect ? 1 : 0),
		0
	);
	const incorrect = quiz.questions?.length - correct || 0;
	const percentage = (correct / quiz.questions?.length) * 100 || 0;

	return { result, quiz, sortedAnswers, correct, incorrect, percentage };
}
