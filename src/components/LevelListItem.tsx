import type { Level } from '../types';
import { CheckIcon } from './Icon';
import LevelStatusIcon from './LevelStatusIcon';

interface LevelListItemProps {
  level: Level;
  index: number;
  isCompleted: boolean;
  isFailed: boolean;
  isCurrent: boolean;
  actualTheme: string;
  onLevelSelect: (index: number) => void;
}

export default function LevelListItem({
  level,
  index,
  isCompleted,
  isFailed,
  isCurrent,
  actualTheme,
  onLevelSelect,
}: LevelListItemProps) {
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
      onClick={() => onLevelSelect(index)}
      className={`${baseClasses} ${hoverClasses} ${currentClasses}`}
    >
      <div className='flex-shrink-0'>
        <LevelStatusIcon
          isCompleted={isCompleted}
          isFailed={isFailed}
          actualTheme={actualTheme}
        />
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
      {isCurrent && <CheckIcon className='w-4 h-4 ml-2 flex-shrink-0' />}
    </button>
  );
}
