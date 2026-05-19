import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Movies — NFLIX',
  description: 'Discover trending movies, top picks, and personalised recommendations on NFLIX.',
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
