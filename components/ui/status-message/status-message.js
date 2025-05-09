import styles from './status-message.module.css';
import Image from 'next/image';

export default function StatusMessage({ messages, imgSrc, imgAlt, type }) {
	return (
		<div className={type === 'error' ? styles.error : styles.warning}>
			<Image
				src={imgSrc}
				priority
				width={40}
				height={40}
				alt={imgAlt}
			/>
			{messages?.map((message, index) => (
				<p key={index}>{message}</p>
			))}
		</div>
	);
}
