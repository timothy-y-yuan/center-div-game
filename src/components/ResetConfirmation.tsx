import { useState } from 'react';

interface ResetConfirmationProps {
  actualTheme: string;
  onResetProgress: () => void;
  onClose: () => void;
}

export default function ResetConfirmation({
  actualTheme,
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
    <div
      className={`px-4 py-3 border-b ${
        actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div
        className={`text-sm font-medium mb-2 ${
          actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        🔄 Actions
      </div>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
            actualTheme === 'dark'
              ? 'hover:bg-red-900/30 text-red-300 hover:text-red-200'
              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
          }`}
        >
          <span className='text-base'>🗑️</span>
          <span>Reset All Progress</span>
        </button>
      ) : (
        <div
          className={`p-3 rounded-lg ${
            actualTheme === 'dark'
              ? 'bg-red-900/30 border border-red-700/50'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div
            className={`text-sm font-medium mb-2 ${
              actualTheme === 'dark' ? 'text-red-200' : 'text-red-800'
            }`}
          >
            ⚠️ Are you sure?
          </div>
          <div
            className={`text-xs mb-3 ${
              actualTheme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}
          >
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
              className={`flex-1 text-xs font-medium py-2 px-3 rounded transition-colors ${
                actualTheme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
