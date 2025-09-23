import { useState } from 'react';

interface ResetConfirmationProps {
  onResetProgress: () => void;
  onClose: () => void;
}

export default function ResetConfirmation({
  onResetProgress,
  onClose,
}: ResetConfirmationProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onResetProgress();
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
      <div className='text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>
        🔄 Actions
      </div>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className='w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200'
        >
          <span className='text-base'>🗑️</span>
          <span>Reset All Progress</span>
        </button>
      ) : (
        <div className='p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50'>
          <div className='text-sm font-medium mb-2 text-red-800 dark:text-red-200'>
            ⚠️ Are you sure?
          </div>
          <div className='text-xs mb-3 text-red-700 dark:text-red-300'>
            This will permanently delete all your progress, completed levels,
            and scores.
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleReset}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors'
            >
              Yes, Reset All
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className='flex-1 text-xs font-medium py-2 px-3 rounded transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
