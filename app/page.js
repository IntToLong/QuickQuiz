
import Image from 'next/image';

import abstractShapes from '@/public/abstractShapes.svg';
import InputArea from '@/components/home/input-area/input-area';

import styles from './page.module.css';

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.hero}>
				<div className={styles.heading}>
					<h1>
						<span className={styles.highlight}>Effortless</span> AI-powered{' '}
						<span className={styles.highlight}>quiz generation</span> and
						self-improvement platform
					</h1>
					<p className={styles.subheader}>
						From idea to quiz in seconds — test your knowledge now!
					</p>
					<InputArea />
				</div>
				<div className={styles.image}>
					<Image
						src={abstractShapes}
						alt='abstract figures'
						priority
						width={363}
						height={483}
					/>
				</div>
			</main>
		</div>
	);
}
