'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SectionHeaderProps {
  title:      string;
  href?:      string;
  showArrow?: boolean;
}

export default function SectionHeader({ title, href, showArrow = true }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: '12px', paddingLeft: '60px', paddingRight: '60px' }}>
      <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          See all {showArrow && <ChevronRight size={16} />}
        </Link>
      )}
    </div>
  );
}
