import BrowseClient from './BrowseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse — NFLIX',
};

// Render fresh on every request (no static cache)
export const dynamic = 'force-dynamic';

export default function BrowsePage() {
  // All data fetching is done client-side in BrowseClient
  // to avoid server-side SSL issues reaching api.themoviedb.org
  return <BrowseClient rows={[]} featured={null} />;
}
