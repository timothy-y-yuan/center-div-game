import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ValidationFeedback as ValidationFeedbackData } from '../types';
import FeedbackMessage from './FeedbackMessage';
import CenteringRequirements from './CenteringRequirements';

interface ValidationFeedbackProps {
  isOpen: boolean;
  feedback: ValidationFeedbackData | null;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function ValidationFeedback({
  isOpen,
  feedback,
  onClose,
  buttonRef,
}: ValidationFeedbackProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen || !buttonRef.current || !feedback) return null;

  const buttonRect = buttonRef.current.getBoundingClientRect();
  const popupStyle = {
    position: 'fixed' as const,
    top: buttonRect.bottom + window.scrollY + 8,
    right: window.innerWidth - buttonRect.right,
    zIndex: 9999,
  };

  const getIcon = (): string => {
    if (feedback.isCompleted) return '✅';
    return '❌';
  };

  const getHeaderColor = (): string => {
    if (feedback.isCompleted) {
      return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    }
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  return createPortal(
    <div
      ref={popupRef}
      style={popupStyle}
      className='w-80 animate-in slide-in-from-top-2 duration-200'
    >
      {/* Arrow */}
      <div
        className={`absolute -top-2 right-4 w-4 h-4 rotate-45 ${
          feedback.isCompleted ? 'bg-emerald-400' : 'bg-red-400'
        }`}
      ></div>

      {/* Popup content */}
      <div className='relative rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'>
        {/* Header */}
        <div className={`p-4 ${getHeaderColor()}`}>
          <div className='flex items-center gap-3'>
            <span className='text-xl'>{getIcon()}</span>
            <h3 className='font-bold text-white'>
              {feedback.isCompleted ? 'Success!' : 'Not Quite...'}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className='p-4'>
          <FeedbackMessage feedback={feedback} />
          <CenteringRequirements feedback={feedback} />
        </div>
      </div>
    </div>,
    document.body
  );
}
