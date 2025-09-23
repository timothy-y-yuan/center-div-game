import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import { useImportantModalAnimations } from '../hooks/useImportantModalAnimations';
import ImportantModalHeader from './ImportantModalHeader';
import ImportantModalContent from './ImportantModalContent';

interface ImportantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportantModal({
  isOpen,
  onClose,
}: ImportantModalProps) {
  const { actualTheme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const { shake, bounceTitle } = useImportantModalAnimations(isOpen);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200'
      data-testid='important-modal'
    >
      {/* ENHANCED Dramatic backdrop with multiple flashing colors */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-500/70 via-orange-500/70 to-red-600/70 animate-pulse'></div>
      <div className='absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-red-500/30 to-pink-500/30 animate-ping'></div>
      <div className='absolute inset-0 bg-gradient-to-l from-purple-500/20 via-red-500/20 to-orange-500/20 animate-bounce'></div>

      <div
        ref={modalRef}
        className={`w-150 max-w-md mx-4 animate-in zoom-in-95 duration-200 relative ${
          shake ? 'animate-bounce' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 0 20px red) drop-shadow(0 0 40px orange)',
        }}
      >
        {/* Modal content with dramatic styling */}
        <div
          className={`relative rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
            shake ? 'scale-105 rotate-1' : 'scale-100 rotate-0'
          } ${
            actualTheme === 'dark'
              ? 'bg-gray-900 border-4 border-red-500'
              : 'bg-white border-4 border-red-600'
          }`}
          style={{
            boxShadow: `
              0 25px 50px -12px rgba(239, 68, 68, 0.8), 
              0 0 0 1px rgba(239, 68, 68, 0.5),
              0 0 50px red,
              0 0 100px orange,
              inset 0 0 20px rgba(255, 0, 0, 0.3)
            `,
            border: '4px solid red',
            animation: 'pulse 0.5s infinite alternate',
          }}
        >
          {/* Dramatic pulsing header with gradients */}
          <ImportantModalHeader bounceTitle={bounceTitle} />

          {/* Content with dramatic styling and educational message */}
          <ImportantModalContent actualTheme={actualTheme} onClose={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
}
