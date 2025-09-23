/**
 * @fileoverview Reusable icon components to eliminate SVG duplication
 * Consolidates commonly used SVG icons across the application
 */

interface IconProps {
  className?: string;
  fill?: string;
  stroke?: string;
}

/**
 * Checkmark icon used for completed states
 */
export function CheckIcon({ className = 'w-4 h-4', ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill='currentColor'
      viewBox='0 0 20 20'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
        clipRule='evenodd'
      />
    </svg>
  );
}

/**
 * Chevron down icon used in dropdowns
 */
export function ChevronDownIcon({
  className = 'w-4 h-4',
  isRotated = false,
  ...props
}: IconProps & { isRotated?: boolean }) {
  return (
    <svg
      className={`${className} transition-transform ${isRotated ? 'rotate-180' : ''}`}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 9l-7 7-7-7'
      />
    </svg>
  );
}

/**
 * Scroll indicator chevron
 */
export function ScrollChevronIcon({
  className = 'w-3 h-3',
  ...props
}: IconProps) {
  return (
    <svg
      className={`${className} animate-bounce`}
      fill='currentColor'
      viewBox='0 0 20 20'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
        clipRule='evenodd'
      />
    </svg>
  );
}
