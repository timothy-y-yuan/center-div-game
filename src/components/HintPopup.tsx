import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

interface HintPopupProps {
  isOpen: boolean;
  hint: string;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onRevealAnswer: () => void;
  isCompleted: boolean;
  isFailed: boolean;
  solutionCSS: string;
  explanation: string;
}

export default function HintPopup({
  isOpen,
  hint,
  onClose,
  buttonRef,
  onRevealAnswer,
  isCompleted,
  isFailed,
  solutionCSS,
  explanation,
}: HintPopupProps) {
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

  if (!isOpen || !buttonRef.current) return null;

  const buttonRect = buttonRef.current.getBoundingClientRect();
  const popupStyle = {
    position: 'fixed' as const,
    top: buttonRect.bottom + window.scrollY + 8,
    right: window.innerWidth - buttonRect.right,
    zIndex: 9999,
  };

  return createPortal(
    <div
      ref={popupRef}
      style={popupStyle}
      className="w-80 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Arrow */}
      <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-amber-400"></div>

      {/* Popup content */}
      <div
        className={`relative rounded-xl shadow-xl overflow-hidden ${
          actualTheme === 'dark'
            ? 'bg-gray-800 border border-gray-600'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 ${
            isCompleted || isFailed
              ? isCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
              : 'bg-gradient-to-r from-amber-400 to-orange-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {isCompleted ? '🤓' : isFailed ? '😭' : '💡'}
            </span>
            <h3 className="font-bold text-white">
              {isCompleted || isFailed ? 'Solution' : 'Hint'}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-2">
          {isCompleted || isFailed ? (
            <div>
              <p
                className={`text-sm leading-relaxed mb-3 ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                {isCompleted
                  ? "You already solved this like a nerd! Here's the solution:"
                  : "Okay dumbass, here's how it's done:"}
              </p>
              <pre
                className={`text-xs p-3 rounded-lg overflow-x-auto mb-3 ${
                  actualTheme === 'dark'
                    ? 'bg-gray-900 text-green-300 border border-gray-700'
                    : 'bg-gray-100 text-green-700 border border-gray-300'
                }`}
              >
                <code>{solutionCSS}</code>
              </pre>
              <div
                className={`text-sm leading-relaxed p-3 rounded-lg ${
                  actualTheme === 'dark'
                    ? 'bg-blue-900/30 text-blue-200 border border-blue-700/50'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <div className="font-semibold mb-1">💡 Why it works:</div>
                <div>{explanation}</div>
              </div>
            </div>
          ) : (
            <p
              className={`text-sm leading-relaxed ${
                actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {hint}
            </p>
          )}
        </div>

        {/* Footer with reveal button (only if not completed and not failed) */}
        {!isCompleted && !isFailed && (
          <div
            className={`p-4 pt-2 border-t ${
              actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <button
              onClick={onRevealAnswer}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-sm"
            >
              😭 I'm a dumbass, what's the answer?
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
