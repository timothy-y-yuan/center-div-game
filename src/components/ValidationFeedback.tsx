import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import type { ValidationFeedback as ValidationFeedbackData } from '../types';

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
  const { actualTheme } = useTheme();
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

  const generateFeedbackMessage = (): string => {
    if (feedback.isCompleted) {
      return 'Perfect! Your element is properly centered! 🎉';
    }

    const issues: string[] = [];

    if (feedback.requiresHorizontal && !feedback.horizontalCentered) {
      issues.push(
        `horizontally off by ${feedback.horizontalOffset.toFixed(1)}px`
      );
    }

    if (feedback.requiresVertical && !feedback.verticallyCentered) {
      issues.push(`vertically off by ${feedback.verticalOffset.toFixed(1)}px`);
    }

    if (issues.length === 0) {
      return 'Hmm, something went wrong with the validation...';
    }

    return `Close! Your element is ${issues.join(' and ')}.`;
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
      <div
        className={`relative rounded-xl shadow-xl overflow-hidden ${
          actualTheme === 'dark'
            ? 'bg-gray-800 border border-gray-600'
            : 'bg-white border border-gray-200'
        }`}
      >
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
          <p
            className={`text-sm leading-relaxed mb-3 ${
              actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {generateFeedbackMessage()}
          </p>

          {/* Requirements breakdown */}
          {!feedback.isCompleted && (
            <div
              className={`text-xs p-3 rounded-lg ${
                actualTheme === 'dark'
                  ? 'bg-gray-900 border border-gray-700'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <div className='font-semibold mb-2 text-gray-600 dark:text-gray-400'>
                Centering Requirements:
              </div>
              <div className='space-y-1'>
                {feedback.requiresHorizontal && (
                  <div className='flex items-center gap-2'>
                    <span className={feedback.horizontalCentered ? '✅' : '❌'}>
                      {feedback.horizontalCentered ? '✅' : '❌'}
                    </span>
                    <span
                      className={
                        actualTheme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-600'
                      }
                    >
                      Horizontal centering{' '}
                      {feedback.horizontalCentered
                        ? '(Perfect!)'
                        : `(Off by ${feedback.horizontalOffset.toFixed(1)}px)`}
                    </span>
                  </div>
                )}
                {feedback.requiresVertical && (
                  <div className='flex items-center gap-2'>
                    <span className={feedback.verticallyCentered ? '✅' : '❌'}>
                      {feedback.verticallyCentered ? '✅' : '❌'}
                    </span>
                    <span
                      className={
                        actualTheme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-600'
                      }
                    >
                      Vertical centering{' '}
                      {feedback.verticallyCentered
                        ? '(Perfect!)'
                        : `(Off by ${feedback.verticalOffset.toFixed(1)}px)`}
                    </span>
                  </div>
                )}
              </div>
              <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                💡 Tolerance: Elements within 5px are considered centered
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
