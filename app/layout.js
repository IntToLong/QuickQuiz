import { Geist, Geist_Mono } from 'next/font/google';

import ClientProvider from './providers';
import Header from '@/components/header/header/header';
import Footer from '@/components/footer/footer';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'QuickQuiz AI',
	description: 'Instant Quizzes, Endless Learning',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<div className='wrapper'>
					<ClientProvider>
						<Header />
						{children}
						<div id='modal-root' />
						<Footer />
					</ClientProvider>
				</div>
			</body>
		</html>
	);
}
