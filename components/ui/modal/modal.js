'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { closeModal } from '@/store/quizSlice';

import styles from './modal.module.css';

export default function Modal({ children, modalType, ...props }) {
	const modalRef = useRef();
	const dispatch = useDispatch();
	const router = useRouter();
	const activeModal = useSelector((state) => state.quiz.activeModal);
	const [modalRoot, setModalRoot] = useState(null);

	useEffect(() => {
		setModalRoot(document.getElementById('modal-root'));
	}, []);

	useEffect(() => {
		const modal = modalRef.current;
		if (!modal) return;

		if (activeModal === modalType) {
			if (!modal.open) modal.showModal();
		} else {
			if (modal.open) modal.close();
		}
		return () => modal.close();
	}, [activeModal, modalType]);

	if (!modalRoot) return null;

	function handleClose() {
		if (activeModal) dispatch(closeModal());
		if (modalType === 'result') router.push('/');
	}

	return createPortal(
		<dialog
			data-testid='modal'
			className={styles.modal}
			ref={modalRef}
			onClose={handleClose}
			{...props}>
			{children}
		</dialog>,
		modalRoot
	);
}
