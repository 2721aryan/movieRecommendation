import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NFLIX — Discover Movies You\'ll Love',
  description: 'Personalised movie recommendations. Discover trending films, build your watchlist, and find your next favourite movie.',
  keywords: ['movies', 'recommendations', 'streaming', 'watchlist'],
  openGraph: {
    title: 'NFLIX',
    description: 'Personalised movie recommendations',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
