'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, onFocus, onBlur, value, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';

    // Label is visible ONLY when the field is empty AND not focused
    const showLabel = !isFocused && !hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="flex flex-col w-full">
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // Keep placeholder empty — the custom label element acts as the placeholder
            placeholder=""
            className={cn(
              'peer w-full text-white outline-none transition-all duration-150',
              'rounded-[4px]',
              'h-[60px]',
              'bg-[#333333]',
              'border border-transparent',
              isFocused && 'border-[#8c8c8c]',
              error && '!border-red-500',
              className,
            )}
            style={{
              fontSize: '16px',
              letterSpacing: '0.01em',
              // Inline padding — cannot be overridden by Tailwind resets
              paddingLeft: icon ? '44px' : '24px',
              paddingRight: '16px',
              paddingTop: 0,
              paddingBottom: 0,
            }}
            {...rest}
          />

          {/* Label acts as a pure placeholder — only visible when field is empty & unfocused */}
          {label && (
            <label
              className="absolute pointer-events-none select-none transition-opacity duration-150 top-1/2 -translate-y-1/2 text-[16px] font-normal text-[#8c8c8c]"
              style={{
                left: icon ? '44px' : '24px',
                opacity: showLabel ? 1 : 0,
              }}
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p
            className="text-[13px] text-[#e87c03] font-medium"
            style={{ marginTop: '6px', paddingLeft: '2px' }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
