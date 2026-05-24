'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1" style={{ paddingTop: '68px' }}>{children}</main>
      <Footer />
    </div>
  );
}
