/**
 * @fileoverview Base dropdown component to eliminate duplication
 * Consolidates common dropdown behavior and styling patterns
 */

import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import { useClickOutside, useDropdownPosition } from '../hooks';
import { ChevronDownIcon } from './Icon';

interface BaseDropdownProps {
  children: ReactNode;
  dropdownContent: ReactNode;
  buttonClassName?: string;
  dropdownClassName?: string;
  dropdownWidth?: string;
  maxHeight?: string;
  onToggle?: (isOpen: boolean) => void;
  'aria-label'?: string;
  isOpen?: boolean; // External control of open state
  onClose?: () => void; // External close handler
}

/**
 * Reusable dropdown component that eliminates duplication across
 * LevelDropdown, SettingsDropdown, and ThemeDropdown
 */
export default function BaseDropdown({
  children,
  dropdownContent,
  buttonClassName = '',
  dropdownClassName = '',
  dropdownWidth = 'w-80',
  maxHeight,
  onToggle,
  'aria-label': ariaLabel,
  isOpen: controlledIsOpen,
  onClose,
}: BaseDropdownProps) {
  const { actualTheme } = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const { position, updatePosition } = useDropdownPosition();

  // Set up click outside detection
  useClickOutside(
    [
      buttonRef as React.RefObject<HTMLElement>,
      dropdownRef as React.RefObject<HTMLElement>,
    ],
    () => {
      if (controlledIsOpen !== undefined) {
        onClose?.();
      } else {
        setInternalIsOpen(false);
      }
    },
    { enabled: isOpen }
  );

  const handleToggle = () => {
    const newOpenState = !isOpen;
    if (newOpenState) {
      updatePosition(buttonRef as React.RefObject<HTMLElement>);
    }

    if (controlledIsOpen !== undefined) {
      // For controlled components, only call onToggle
      onToggle?.(newOpenState);
    } else {
      // For uncontrolled components, manage internal state
      setInternalIsOpen(newOpenState);
      onToggle?.(newOpenState);
    }
  };

  const baseDropdownClasses = `fixed ${dropdownWidth} rounded-lg shadow-xl z-[10000] ${
    actualTheme === 'dark'
      ? 'bg-gray-800 border border-gray-600'
      : 'bg-white border border-gray-200'
  } ${dropdownClassName}`;

  const dropdownStyle = {
    top: position.top,
    left: position.left,
    ...(maxHeight && { maxHeight, overflowY: 'auto' as const }),
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-3 transition-all duration-200 ${buttonClassName}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup
      >
        {children}
        <ChevronDownIcon
          className='w-4 h-4 text-gray-600 dark:text-gray-300'
          isRotated={isOpen}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={baseDropdownClasses}
            style={dropdownStyle}
          >
            {dropdownContent}
          </div>,
          document.body
        )}
    </>
  );
}
