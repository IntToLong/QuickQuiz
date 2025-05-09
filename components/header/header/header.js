'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import logoImg from '@/public/logo1.svg';
import GetStartedButton from '../get-started-button/get-started-button';

import styles from './header.module.css';



export default function Header() {
	const pathname = usePathname();

	return (
		<>
			<header className={styles.header}>
				<Link
					className={styles.logo}
					href='/'>
					<Image
						src={logoImg}
						alt='logo'
						priority
					/>
					<p>QuickQuiz AI</p>
				</Link>
				{pathname === '/' && <GetStartedButton />}
			</header>
		</>
	);
}
