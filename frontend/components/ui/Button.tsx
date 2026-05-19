'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?:    'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
};

const variants = {
  primary:   'bg-red-600 hover:bg-red-700 text-white',
  secondary: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20',
  ghost:     'bg-transparent hover:bg-white/10 text-white',
  danger:    'bg-red-900/50 hover:bg-red-900/70 text-red-400 border border-red-700/50',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-8 py-4 text-base font-bold',
};

export default function Button({
  variant = 'primary', size = 'md', children, loading, className, disabled, ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={  { scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}
