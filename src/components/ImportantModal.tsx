import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';

interface ImportantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportantModal({ isOpen, onClose }: ImportantModalProps) {
  const { actualTheme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-200'>
      <div
        ref={modalRef}
        className='w-96 max-w-md mx-4 animate-in zoom-in-95 duration-200'
      >
        {/* Modal content */}
        <div
          className={`relative rounded-xl shadow-xl overflow-hidden ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border border-gray-600'
              : 'bg-white border border-gray-200'
          }`}
        >
          {/* Header */}
          <div className='p-4 bg-gradient-to-r from-red-500 to-red-600'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>🚫</span>
              <h3 className='font-bold text-white text-lg'>!important Detected</h3>
            </div>
          </div>

          {/* Content */}
          <div className='p-6'>
            <p
              className={`text-base leading-relaxed mb-4 ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Whoa there! Using <code className='bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded text-red-700 dark:text-red-300 font-mono text-sm'>!important</code> is 
              not allowed in this game.
            </p>
            
            <p
              className={`text-sm leading-relaxed mb-6 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              The whole point is to learn proper CSS techniques! Try solving this level 
              with regular CSS properties instead.
            </p>

            {/* Close button */}
            <div className='flex justify-end'>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  actualTheme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}