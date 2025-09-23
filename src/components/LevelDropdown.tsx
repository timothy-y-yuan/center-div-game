import { useState } from 'react';
import type { Level } from '../types';
import BaseDropdown from './BaseDropdown';
import LevelListItem from './LevelListItem';
import LevelStatusIcon from './LevelStatusIcon';
import { ScrollChevronIcon } from './Icon';

// Simple inline function
const getLevelStatus = (
  levelIndex: number,
  completedLevels: ReadonlySet<number>,
  failedLevels: ReadonlySet<number>
) => {
  if (completedLevels.has(levelIndex) && !failedLevels.has(levelIndex))
    return 'completed';
  if (failedLevels.has(levelIndex)) return 'failed';
  return 'pending';
};

interface LevelDropdownProps {
  levels: Level[];
  currentLevelIndex: number;
  completedLevels: ReadonlySet<number>;
  failedLevels: ReadonlySet<number>;
  onLevelSelect: (index: number) => void;
}

export default function LevelDropdown({
  levels,
  currentLevelIndex,
  completedLevels,
  failedLevels,
  onLevelSelect,
}: LevelDropdownProps) {
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
    <div className='max-h-64 overflow-y-auto'>
      {levels.map((level, index) => {
        const status = getLevelStatus(index, completedLevels, failedLevels);
        const isCompleted = status === 'completed';
        const isFailed = status === 'failed';
        const isCurrent = index === currentLevelIndex;

        return (
          <LevelListItem
            key={level.id}
            level={level}
            index={index}
            isCompleted={isCompleted}
            isFailed={isFailed}
            isCurrent={isCurrent}
            onLevelSelect={handleLevelSelect}
          />
        );
      })}

      {/* Scroll indicator fade - only show when scrollable */}
      {canScroll && (
        <div className='absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-lg bg-gradient-to-t from-white via-white/60 to-transparent dark:from-gray-800 dark:via-gray-800/60 dark:to-transparent'>
          {/* Subtle scroll icon */}
          <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 dark:text-gray-500'>
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
      <LevelStatusIcon
        isCompleted={isCurrentCompleted}
        isFailed={isCurrentFailed}
      />
    </BaseDropdown>
  );
}
