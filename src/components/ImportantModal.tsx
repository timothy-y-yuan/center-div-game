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
      {/* ENHANCED Dramatic backdrop with multiple flashing colors */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-500/70 via-orange-500/70 to-red-600/70 animate-pulse'></div>
      <div className='absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-red-500/30 to-pink-500/30 animate-ping'></div>
      <div className='absolute inset-0 bg-gradient-to-l from-purple-500/20 via-red-500/20 to-orange-500/20 animate-bounce'></div>

      <div
        ref={modalRef}
        className={`w-96 max-w-md mx-4 animate-in zoom-in-95 duration-200 relative ${
          shake ? 'animate-bounce' : ''
        }`}
        style={{
          animation: 'bounce 0.5s infinite alternate, pulse 1s infinite',
          filter: 'drop-shadow(0 0 20px red) drop-shadow(0 0 40px orange)'
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
            animation: 'pulse 0.5s infinite alternate'
          }}
        >
          {/* Dramatic pulsing header with gradients */}
          <div className='p-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden'>
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-red-400/20 to-pink-400/20 animate-pulse'></div>
            <div className='absolute inset-0 bg-gradient-to-l from-red-700/30 via-transparent to-red-700/30 animate-ping'></div>

            <div className='flex items-center gap-3 relative z-10'>
              <span
                className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''}`}
              >
                🚨
              </span>
              <h3
                className={`font-bold text-white text-xl tracking-wide ${bounceTitle ? 'animate-pulse' : ''}`}
              >
                🔥💀 !IMPORTANT NUCLEAR ALERT! 💀🔥
              </h3>
              <span
                className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''} rotate-12`}
              >
                🚨
              </span>
            </div>

            {/* Multiple Flashing warning stripes for maximum obnoxiousness */}
            <div className='absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse'></div>
            <div className='absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 animate-ping'></div>
          </div>

          {/* Content with dramatic styling and educational message */}
          <div className='p-6 relative'>
            {/* Animated background effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/50 to-yellow-50/50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 animate-pulse'></div>

            <div className='relative z-10'>
              <p
                className={`text-xl font-bold leading-relaxed mb-4 animate-pulse ${
                  actualTheme === 'dark' ? 'text-red-200' : 'text-red-800'
                }`}
                style={{
                  textShadow: '0 0 10px currentColor, 0 0 20px red, 0 0 30px orange'
                }}
              >
                <span className='text-3xl mr-2 animate-spin inline-block'>🛑</span>
                <strong>STOP RIGHT THERE, CSS CRIMINAL!</strong> Using{' '}
                <code
                  className={`px-3 py-2 rounded-md font-bold text-lg animate-bounce ${
                    actualTheme === 'dark'
                      ? 'bg-red-900 text-red-100 border-2 border-red-400'
                      : 'bg-red-100 text-red-900 border-2 border-red-500'
                  }`}
                  style={{
                    boxShadow: '0 0 20px red, 0 0 40px orange, inset 0 0 10px rgba(255,0,0,0.3)'
                  }}
                >
                  !important
                </code>{' '}
                is like using a NUCLEAR WEAPON to swat a fly!
                <span className='text-3xl ml-2 animate-ping inline-block'>💥</span>
              </p>

              <div
                className={`p-4 rounded-lg mb-4 border-l-4 border-orange-500 ${
                  actualTheme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'
                }`}
              >
                <p
                  className={`text-base leading-relaxed ${
                    actualTheme === 'dark'
                      ? 'text-orange-200'
                      : 'text-orange-800'
                  }`}
                >
                  <strong>🎓 EDUCATIONAL NUCLEAR MELTDOWN:</strong> The ENTIRE point of
                  this game is to learn <em>proper</em> CSS techniques! Using <code>!important</code>{' '}
                  is like cheating on your homework while the teacher is staring right at you!
                  <br/><br/>
                  <span className='text-2xl animate-spin inline-block'>🤯</span> You've just activated CSS HARD MODE! 
                  <span className='text-2xl animate-bounce inline-block ml-2'>💀</span>
                </p>
              </div>

              <div
                className={`p-3 rounded-lg mb-6 ${
                  actualTheme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
                }`}
              >
                <p
                  className={`text-sm leading-relaxed italic ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <span className='text-base mr-1'>💡</span>
                  <strong>Pro tip:</strong> Master specificity, understand the
                  cascade, and your CSS will be more maintainable and elegant
                  than any
                  <code className='mx-1 px-1 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700'>
                    !important
                  </code>
                  hack could ever be!
                </p>
              </div>

              {/* Dramatic action buttons */}
              <div className='flex justify-center gap-3'>
                <button
                  onClick={onClose}
                  className={`px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-110 animate-pulse ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/50'
                      : 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-500/50'
                  }`}
                  style={{
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.8), 0 0 20px red, 0 0 40px orange',
                    textShadow: '0 0 10px white'
                  }}
                >
                  <span className='mr-3 text-2xl animate-bounce inline-block'>😤</span>
                  I'LL CODE IT PROPERLY!
                  <span className='ml-3 text-2xl animate-bounce inline-block' style={{animationDelay: '0.2s'}}>💪</span>
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
