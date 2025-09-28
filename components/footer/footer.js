import React from 'react';
import Image from 'next/image';
import youtube from '@/public/youtube.svg';
import x from '@/public/x.svg';
import facebook from '@/public/facebook.svg';
import linkedin from '@/public/linkedin.svg';

import styles from './footer.module.css';
import { getCurrentYear } from '../../util/getCurrentYear';

export default function Footer() {
	const currentYear = getCurrentYear();
	return (
		<footer className={styles.footer}>
			<p className={styles.copyright}>
				&#169; {currentYear} QuickQuiz AI. All Rights Reserved.
			</p>
			<ul className={styles.socialMedia}>
				<li className={styles.socialMedia_icon}>
					<a href='#'>
						<Image
							src={facebook}
							width='14'
							height='18'
							alt={'facebook icon'}
						/>
					</a>
				</li>
				<li className={styles.socialMedia_icon}>
					<a href='#'>
						<Image
							src={linkedin}
							width='20'
							height='20'
							alt={'linkedin icon'}
						/>
					</a>
				</li>
				<li className={styles.socialMedia_icon}>
					<a href='#'>
						<Image
							src={x}
							width='20'
							height='14'
							alt={'x icon'}
						/>
					</a>
				</li>
				<li
					className={styles.socialMedia_icon}
					title='music for studying'>
					<a
						href='https://www.youtube.com/watch?v=jfKfPfyJRdk'
						target='_blank'>
						<Image
							src={youtube}
							width='20'
							height='14'
							alt={'youtube icon'}
						/>
					</a>
				</li>
			</ul>
		</footer>
	);
}
