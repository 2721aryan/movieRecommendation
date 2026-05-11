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
    <div className="flex items-center justify-between mb-3 px-4 md:px-12">
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
