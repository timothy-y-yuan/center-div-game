/**
 * @fileoverview Custom hook for handling click outside detection
 * Provides reusable click outside functionality for dropdown components
 */

import { useEffect } from 'react';

export interface UseClickOutsideOptions {
  /** Whether the click outside detection is active */
  enabled?: boolean;
  /** Additional cleanup callback */
  onCleanup?: () => void;
}

/**
 * Custom hook for detecting clicks outside of multiple elements
 * @param refs - Array of refs to check for outside clicks
 * @param callback - Function to call when click outside is detected
 * @param options - Configuration options
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  refs: React.RefObject<T>[],
  callback: () => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, onCleanup } = options;

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Check if click is outside all provided refs
      const isOutside = refs.every(ref => !ref.current?.contains(target));

      if (isOutside) {
        callback();
        onCleanup?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, enabled, callback, onCleanup]);
}
