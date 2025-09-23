import type { Level } from '../types';
import { CheckIcon } from './Icon';
import LevelStatusIcon from './LevelStatusIcon';

interface LevelListItemProps {
  level: Level;
  index: number;
  isCompleted: boolean;
  isFailed: boolean;
  isCurrent: boolean;
  onLevelSelect: (index: number) => void;
}

export default function LevelListItem({
  level,
  index,
  isCompleted,
  isFailed,
  isCurrent,
  onLevelSelect,
}: LevelListItemProps) {
  const baseClasses =
    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-700';
  const currentClasses = isCurrent
    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    : 'text-gray-700 dark:text-gray-200';

  return (
    <button
      key={level.id}
      onClick={() => onLevelSelect(index)}
      className={`${baseClasses} ${currentClasses}`}
    >
      <div className='flex-shrink-0'>
        <LevelStatusIcon isCompleted={isCompleted} isFailed={isFailed} />
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
        <div className='text-xs mt-1 truncate text-gray-600 dark:text-gray-300'>
          {level.description}
        </div>
      </div>
      {isCurrent && <CheckIcon className='w-4 h-4 ml-2 flex-shrink-0' />}
    </button>
  );
}
