'use client';
import Button from '@/components/ui/button/button';
import StatusMessage from '@/components/ui/status-message/status-message';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { isQuantityValid } from '@/util/validation';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import brain from '@/public/brain-svgrepo-com (1).svg';
import robot from '@/public/robot-svgrepo-com.svg';
import warningRobot from '@/public/robot-outline-in-a-circle-svgrepo-com.svg';
import { addQuiz, clearResult, closeModal } from '@/store/quizSlice';

import styles from './new-quiz.module.css';

export default function NewQuiz({ topic }) {
	const LONG_RESPONSE_THRESHOLD = 14;
	const TIMEOUT_MS = 25000;
	const DIFFICULTY_LEVELS = ['novice', 'medium', 'difficult', 'expert'];

	const [checked, setChecked] = useState('five');
	const [topicError, setTopicError] = useState('');
	const [quantityInputValue, setQuantityInputValue] = useState('');
	const [iValidQuantity, setIsValidQuantity] = useState(true);
	const [error, setError] = useState(false);
	const [warning, setWarning] = useState(null);
	const [pending, setPending] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const controllerRef = useRef(null);
	const activeModal = useSelector((state) => state.quiz.activeModal);

	useEffect(() => {
		setError(null);
	}, [activeModal]);

	useEffect(() => {
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
	}, [activeModal]);

	async function submitQuizRequest(questionObj) {
		setError(false);
		controllerRef.current = new AbortController();
		const signal = controllerRef.current.signal;

		const timeout = setTimeout(() => {
			controllerRef.current.abort();
			setError(true);
		}, TIMEOUT_MS);

		try {
			const response = await fetch('/api/generate-quiz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(questionObj),
				signal,
			}).catch((err) => {
				setError(true);
				return 'error';
			});

			if (!response.ok) {
				setError(true);
				return;
			}

			const data = await response.json();
			if (data.result) {
				dispatch(addQuiz(data.result));
				router.push('/quiz');
				dispatch(closeModal());
			}
		} catch (error) {
			if (error.name === 'AbortError') {
				console.log('Request was aborted due to timeout');
			} else {
				console.log('Error fetching question:', error);
			}
		} finally {
			clearTimeout(timeout);
		}
	}

	function changeQuantityInputValue(event) {
		setQuantityInputValue(event.target.value);
	}

	function changeCheckedStatus(value) {
		setChecked((prevV) => value);
		setQuantityInputValue('');
	}

	function checkNumberInput(event) {
		if (!checked) {
			setIsValidQuantity((prev) => isQuantityValid(event.target.value));
		}
	}

	function handleCancel() {
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
		dispatch(closeModal());
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setTopicError(false);
		setPending(true);
		const formData = new FormData(event.target);
		const topic = formData.get('topic');

		if (topic.trim().length < 2) {
			setTopicError('Please provide your topic.');
			setPending(false);
			return;
		}

		const complexity = formData.get('complexity');
		const quantity = formData.get('quantity');

		if (quantity > LONG_RESPONSE_THRESHOLD) {
			setWarning(true);
		}

		await submitQuizRequest({ topic, complexity, quantity });

		setPending(false);
		dispatch(clearResult());
		setWarning(false);
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className={styles.form}>
				{error && (
					<StatusMessage
						messages={['Oops something went wrong.', 'Please try again.']}
						imgSrc={robot}
						imgAlt='robot icon'
						type='error'
					/>
				)}
				{warning && (
					<StatusMessage
						messages={['Lots to do', 'this may take up to 20 seconds.']}
						imgSrc={warningRobot}
						imgAlt='robot icon'
					/>
				)}

				{!error && !warning && (
					<legend className={styles.form_title}>
						<Image
							className={styles.title_icon}
							src={brain}
							alt='symbol of brain'
							priority
							width={24}
							height={24}
						/>
						{"Let's create your "}
						<span>quiz</span>
					</legend>
				)}

				<div className={styles.form_topic}>
					<label
						htmlFor='topic'
						className={topicError ? styles.form_topic__error : ''}>
						Enter your topic: {topicError && <span>*</span>}{' '}
					</label>
					<input
						type='text'
						id='topic'
						name='topic'
						defaultValue={topic}
						required
						disabled={pending}
					/>
				</div>
				<div className={styles.form_options__wrapper}>
					<span>Choose difficulty: </span>
					<div className={styles.form_difficulty}>
						{DIFFICULTY_LEVELS.map((el) => (
							<div
								className={styles.form_difficulty__option}
								key={el}>
								<input
									type='radio'
									id={el}
									name='complexity'
									value={el}
									defaultChecked
									disabled={pending}
								/>
								<label htmlFor={el}>{el[0].toUpperCase() + el.slice(1)}</label>
							</div>
						))}
					</div>
				</div>

				<div className={styles.form_options}>
					<span>How many questions?</span>

					<div className={styles.form_radio__options}>
						<div className={styles.form_radio__option}>
							<input
								type='radio'
								id='five'
								name='quantity'
								value='5'
								checked={checked === 'five'}
								onChange={() => changeCheckedStatus('five')}
								disabled={pending}
							/>
							<label htmlFor='five'>5</label>
						</div>
						<div className={styles.form_radio__option}>
							<input
								type='radio'
								id='ten'
								name='quantity'
								value='10'
								checked={checked === 'ten'}
								onChange={() => changeCheckedStatus('ten')}
								disabled={pending}
							/>
							<label htmlFor='ten'>10</label>
						</div>
						<div
							className={`${styles.form_option} ${
								iValidQuantity ? '' : styles.form_option__error
							}`}
							onClick={() => changeCheckedStatus(false)}>
							<label htmlFor='userValue'>Other quantity (from 1 to 20): </label>
							<input
								type='number'
								name='quantity'
								id='userValue'
								min={1}
								max={20}
								onChange={changeQuantityInputValue}
								onBlur={checkNumberInput}
								value={quantityInputValue}
							/>
						</div>
					</div>
				</div>
				<div className={styles.form_buttons}>
					<button
						className={styles.form_buttons__cancel}
						type='reset'
						onClick={handleCancel}>
						Cancel
					</button>
					<Button
						title={pending ? 'Creating quiz...' : 'Create quiz'}
						className={styles.form_buttons__submit}
						type='submit'
						disabled={pending}
					/>
				</div>
			</form>
		</div>
	);
}
