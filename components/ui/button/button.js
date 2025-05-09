import React from 'react';
import Image from 'next/image';
import arrowImg from '@/public/Arrow.svg';

import styles from './button.module.css';

export default function Button({ title, arrow, className, ...props }) {
	let classes = styles.button;

	if (className) {
		classes += ' ' + className;
	}

	return (
		<button
			className={classes}
			{...props}>
			<span>{title}</span>{' '}
			{arrow && (
				<Image
					src={arrowImg}
					alt='arrow icon'
					width='24'
					height='24'
				/>
			)}
		</button>
	);
}
