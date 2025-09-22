import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import type { Level } from '../types';

interface LevelDropdownProps {
  levels: Level[];
  currentLevelIndex: number;
  completedLevels: Set<number>;
  failedLevels: Set<number>;
  onLevelSelect: (index: number) => void;
}

export default function LevelDropdown({
  levels,
  currentLevelIndex,
  completedLevels,
  failedLevels,
  onLevelSelect,
}: LevelDropdownProps) {
  const { actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [canScroll, setCanScroll] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition();
      // Check if content will be scrollable
      setCanScroll(levels.length > 6); // Approximately 6 items fit in max-h-64
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (index: number) => {
    onLevelSelect(index);
    setIsOpen(false);
  };

  const currentLevel = levels[currentLevelIndex];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="inline-flex items-center gap-3 bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-lg px-4 py-2 glass hover:bg-opacity-20 dark:hover:bg-opacity-20 transition-all duration-200"
      >
        <span
          className={`text-sm font-semibold ${
            completedLevels.has(currentLevelIndex)
              ? 'text-emerald-600 dark:text-emerald-400'
              : failedLevels.has(currentLevelIndex)
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-800 dark:text-white'
          }`}
        >
          {currentLevel.title}
        </span>
        {completedLevels.has(currentLevelIndex) && (
          <span className="text-emerald-600 dark:text-emerald-300 text-sm">
            🎉
          </span>
        )}
        {failedLevels.has(currentLevelIndex) && (
          <span className="text-red-600 dark:text-red-400 text-sm">😭</span>
        )}
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed w-80 rounded-lg shadow-xl z-[10000] max-h-64 overflow-y-auto ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-white border border-gray-200'
            }`}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              scrollbarWidth: 'thin',
              scrollbarColor:
                actualTheme === 'dark' ? '#4B5563 #1F2937' : '#9CA3AF #F3F4F6',
            }}
          >
            {levels.map((level, index) => (
              <button
                key={level.id}
                onClick={() => handleSelect(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  actualTheme === 'dark'
                    ? `hover:bg-gray-700 ${
                        index === currentLevelIndex
                          ? 'bg-blue-900/20 text-blue-300'
                          : 'text-gray-200'
                      }`
                    : `hover:bg-gray-100 ${
                        index === currentLevelIndex
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700'
                      }`
                }`}
              >
                <div className="flex-shrink-0">
                  {completedLevels.has(index) ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-sm">
                      🎉
                    </div>
                  ) : failedLevels.has(index) ? (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm">
                      😭
                    </div>
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        actualTheme === 'dark'
                          ? 'border-gray-500'
                          : 'border-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm truncate ${
                      completedLevels.has(index)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : failedLevels.has(index)
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                    }`}
                  >
                    {level.title}
                  </div>
                  <div
                    className={`text-xs mt-1 truncate ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {level.description}
                  </div>
                </div>
                {index === currentLevelIndex && (
                  <svg
                    className="w-4 h-4 ml-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}

            {/* Scroll indicator fade - only show when scrollable */}
            {canScroll && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-lg ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-t from-gray-800 via-gray-800/60 to-transparent'
                    : 'bg-gradient-to-t from-white via-white/60 to-transparent'
                }`}
              >
                {/* Subtle scroll icon */}
                <div
                  className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${
                    actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  <svg
                    className="w-3 h-3 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
