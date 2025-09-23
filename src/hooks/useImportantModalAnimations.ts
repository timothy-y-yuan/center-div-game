import { useEffect, useState } from 'react';

interface ImportantModalAnimationsResult {
  shake: boolean;
  bounceTitle: boolean;
}

export function useImportantModalAnimations(
  isOpen: boolean
): ImportantModalAnimationsResult {
  const [shake, setShake] = useState(false);
  const [bounceTitle, setBounceTitle] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start with dramatic entrance
      setShake(true);

      // Start title bouncing after a short delay
      setTimeout(() => setBounceTitle(true), 300);

      // Stop the main container bouncing after initial impact for readability
      setTimeout(() => setShake(false), 2000);

      return () => {
        setShake(false);
        setBounceTitle(false);
      };
    }
  }, [isOpen]);

  return { shake, bounceTitle };
}