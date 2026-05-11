'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-gray-500 text-sm mb-6">{APP_NAME} — Questions? Contact us.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-8">
          {['FAQ', 'Help Center', 'Account', 'Media Center', 'Investor Relations', 'Jobs',
            'Cookie Preferences', 'Privacy', 'Terms of Use', 'Contact Us', 'Speed Test', 'Legal Notices'].map(item => (
            <Link key={item} href="#" className="hover:text-gray-400 transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <p className="text-gray-700 text-xs">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
