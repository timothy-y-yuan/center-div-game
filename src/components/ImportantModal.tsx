import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';

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
  const [shake, setShake] = useState(false);
  const [bounceTitle, setBounceTitle] = useState(false);

  // Trigger animations when modal opens
  useEffect(() => {
    if (isOpen) {
      // Start shaking immediately
      setShake(true);
      
      // Start title bouncing after a short delay
      setTimeout(() => setBounceTitle(true), 300);
      
      // Continue shaking for dramatic effect
      const shakeInterval = setInterval(() => {
        setShake(prev => !prev);
      }, 800);
      
      return () => {
        clearInterval(shakeInterval);
        setShake(false);
        setBounceTitle(false);
      };
    }
  }, [isOpen]);

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
    <div className='fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200'>
      {/* Dramatic backdrop with multiple flashing colors */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-500/70 via-orange-500/70 to-red-600/70 animate-pulse'></div>
      <div className='absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-red-500/30 to-pink-500/30 animate-ping'></div>
      
      <div
        ref={modalRef}
        className={`w-96 max-w-md mx-4 animate-in zoom-in-95 duration-200 relative ${
          shake ? 'animate-bounce' : ''
        }`}
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
            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.8), 0 0 0 1px rgba(239, 68, 68, 0.5)',
          }}
        >
          {/* Dramatic pulsing header with gradients */}
          <div className='p-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden'>
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-red-400/20 to-pink-400/20 animate-pulse'></div>
            <div className='absolute inset-0 bg-gradient-to-l from-red-700/30 via-transparent to-red-700/30 animate-ping'></div>
            
            <div className='flex items-center gap-3 relative z-10'>
              <span className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''}`}>🚨</span>
              <h3 className={`font-bold text-white text-xl tracking-wide ${bounceTitle ? 'animate-pulse' : ''}`}>
                !IMPORTANT ALERT! 
              </h3>
              <span className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''} rotate-12`}>🚨</span>
            </div>
            
            {/* Flashing warning stripe */}
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse'></div>
          </div>

          {/* Content with dramatic styling and educational message */}
          <div className='p-6 relative'>
            {/* Animated background effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/50 to-yellow-50/50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 animate-pulse'></div>
            
            <div className='relative z-10'>
              <p
                className={`text-lg font-semibold leading-relaxed mb-4 ${
                  actualTheme === 'dark' ? 'text-red-200' : 'text-red-800'
                }`}
              >
                <span className='text-2xl mr-2'>🛑</span>
                Whoa there, CSS cowboy! Using{' '}
                <code className={`px-2 py-1 rounded-md font-bold text-base animate-pulse ${
                  actualTheme === 'dark' 
                    ? 'bg-red-900 text-red-100 border-2 border-red-400' 
                    : 'bg-red-100 text-red-900 border-2 border-red-500'
                }`}>
                  !important
                </code>{' '}
                is like using a sledgehammer to hang a picture! 
                <span className='text-2xl ml-2'>🔨</span>
              </p>

              <div className={`p-4 rounded-lg mb-4 border-l-4 border-orange-500 ${
                actualTheme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'
              }`}>
                <p
                  className={`text-base leading-relaxed ${
                    actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-800'
                  }`}
                >
                  <strong>🎓 Educational Moment:</strong> The whole point of this game is to learn 
                  <em> proper</em> CSS techniques! Using <code>!important</code> is like cheating 
                  on your homework - you might get the result, but you won't learn anything! 
                </p>
              </div>

              <div className={`p-3 rounded-lg mb-6 ${
                actualTheme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
              }`}>
                <p
                  className={`text-sm leading-relaxed italic ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <span className='text-base mr-1'>💡</span>
                  <strong>Pro tip:</strong> Master specificity, understand the cascade, 
                  and your CSS will be more maintainable and elegant than any 
                  <code className='mx-1 px-1 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700'>!important</code> 
                  hack could ever be!
                </p>
              </div>

              {/* Dramatic action buttons */}
              <div className='flex justify-center gap-3'>
                <button
                  onClick={onClose}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/50'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-500/50'
                  }`}
                  style={{
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <span className='mr-2'>😤</span>
                  I'll do it RIGHT!
                  <span className='ml-2'>💪</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
