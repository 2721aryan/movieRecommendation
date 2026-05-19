'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

const footerLinks = [
  ['FAQ', 'Help Centre', 'Account', 'Media Centre'],
  ['Investor Relations', 'Jobs', 'Ways to Watch', 'Terms of Use'],
  ['Privacy', 'Cookie Preferences', 'Corporate Information', 'Contact Us'],
  ['Speed Test', 'Legal Notices', 'Only on NFLIX', 'Accessibility'],
];

export default function Footer() {
  return (
    <footer className="bg-black/95 border-t border-white/5" style={{ marginTop: 'auto' }}>
      <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto', padding: '60px 48px 40px' }}>
        {/* Contact line */}
        <p className="text-gray-400 text-sm" style={{ marginBottom: '32px' }}>
          Questions? Call{' '}
          <a href="tel:000-800-919-1743" className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors">
            000-800-919-1743
          </a>
        </p>

        {/* Link grid — 4 columns */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '12px 24px', marginBottom: '40px' }}
        >
          {footerLinks.flat().map(item => (
            <Link
              key={item}
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              style={{ padding: '4px 0' }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Language selector placeholder */}
        <div
          className="inline-flex items-center border border-gray-700 text-gray-400 text-sm cursor-pointer hover:text-gray-200 transition-colors"
          style={{ padding: '8px 16px', borderRadius: '4px', marginBottom: '24px' }}
        >
          🌐 English
        </div>

        {/* Brand & copyright */}
        <p className="text-gray-600 text-xs" style={{ marginBottom: '8px' }}>{APP_NAME} India</p>
        <p className="text-gray-700 text-xs">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
