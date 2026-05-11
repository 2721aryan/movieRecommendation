import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Movies — CineAI',
  description: 'Discover trending movies, top picks, and personalised recommendations on CineAI.',
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
