import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { Level } from '../types';
import BaseDropdown from './BaseDropdown';
import { CheckIcon, ScrollChevronIcon } from './Icon';

// Simple inline function
const getLevelStatus = (
  levelIndex: number,
  completedLevels: Set<number>,
  failedLevels: Set<number>
) => {
  if (completedLevels.has(levelIndex) && !failedLevels.has(levelIndex))
    return 'completed';
  if (failedLevels.has(levelIndex)) return 'failed';
  return 'pending';
};

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
  const [canScroll, setCanScroll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
    if (isOpen) {
      // Check if content will be scrollable
      setCanScroll(levels.length > 6); // Approximately 6 items fit in max-h-64
    }
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const handleLevelSelect = (index: number) => {
    onLevelSelect(index);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const currentLevel = levels[currentLevelIndex];
  const currentStatus = getLevelStatus(
    currentLevelIndex,
    completedLevels,
    failedLevels
  );
  const isCurrentCompleted = currentStatus === 'completed';
  const isCurrentFailed = currentStatus === 'failed';

  const dropdownContent = (
    <div
      className='max-h-64 overflow-y-auto'
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor:
          actualTheme === 'dark' ? '#4B5563 #1F2937' : '#9CA3AF #F3F4F6',
      }}
    >
      {levels.map((level, index) => {
        const status = getLevelStatus(index, completedLevels, failedLevels);
        const isCompleted = status === 'completed';
        const isFailed = status === 'failed';
        const isCurrent = index === currentLevelIndex;

        const isDark = actualTheme === 'dark';
        const baseClasses =
          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg';
        const hoverClasses = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
        const currentClasses = isCurrent
          ? isDark
            ? 'bg-blue-900/20 text-blue-300'
            : 'bg-blue-50 text-blue-700'
          : isDark
            ? 'text-gray-200'
            : 'text-gray-700';

        return (
          <button
            key={level.id}
            onClick={() => handleLevelSelect(index)}
            className={`${baseClasses} ${hoverClasses} ${currentClasses}`}
          >
            <div className='flex-shrink-0'>
              {isCompleted ? (
                <div className='w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-sm'>
                  🎉
                </div>
              ) : isFailed ? (
                <div className='w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm'>
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
            <div className='flex-1 min-w-0'>
              <div
                className={`font-medium text-sm truncate ${
                  isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isFailed
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
              <CheckIcon className='w-4 h-4 ml-2 flex-shrink-0' />
            )}
          </button>
        );
      })}

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
            <ScrollChevronIcon />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BaseDropdown
      buttonClassName='bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-lg px-4 py-2 glass hover:bg-opacity-20 dark:hover:bg-opacity-20'
      dropdownContent={dropdownContent}
      onToggle={handleToggle}
      isOpen={isDropdownOpen}
      onClose={handleClose}
    >
      <span
        className={`text-sm font-semibold ${
          isCurrentCompleted
            ? 'text-emerald-600 dark:text-emerald-400'
            : isCurrentFailed
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-800 dark:text-white'
        }`}
      >
        {currentLevel.title}
      </span>
      {isCurrentCompleted && (
        <span className='text-emerald-600 dark:text-emerald-300 text-sm'>
          🎉
        </span>
      )}
      {isCurrentFailed && (
        <span className='text-red-600 dark:text-red-400 text-sm'>😭</span>
      )}
    </BaseDropdown>
  );
}
