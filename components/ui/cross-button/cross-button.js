import Image from 'next/image';
import crossImg from '@/public/wrong-cancel-close-svgrepo-com.svg';
import styles from './cross-button.module.css';

export default function CrossButton({close}) {
	return (
		<button className={styles.button} onClick={close}>
			<Image
				src={crossImg}
				alt='cross symbol'
				width={35}
				height={35}
                priority
			/>
		</button>
	);
}
