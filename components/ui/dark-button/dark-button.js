import styles from './dark-button.module.css';

export default function DarkButton({ children, ...props }) {
	return (
		<button
			className={styles.button}
			{...props}>
			{children}
		</button>
	);
}
