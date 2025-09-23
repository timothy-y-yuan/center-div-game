/**
 * @fileoverview Custom hook for dropdown positioning logic
 * Provides reusable dropdown positioning functionality
 */

import { useState, useCallback } from 'react';

export interface DropdownPosition {
  top: number;
  left: number;
}

/**
 * Custom hook for managing dropdown positioning
 * @returns Position state and update function
 */
export function useDropdownPosition() {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });

  const updatePosition = useCallback(
    (buttonRef: React.RefObject<HTMLElement>) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        });
      }
    },
    []
  );

  return { position, updatePosition };
}
