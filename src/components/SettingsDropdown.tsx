import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import BaseDropdown from './BaseDropdown';
import { CheckIcon } from './Icon';

// Simple inline theme helpers
const getThemeIcon = (theme: string) =>
  theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻';
const getThemeLabel = (theme: string, systemTheme: string) =>
  theme === 'system'
    ? `System (${systemTheme})`
    : theme.charAt(0).toUpperCase() + theme.slice(1);

interface SettingsDropdownProps {
  onResetProgress: () => void;
}

export default function SettingsDropdown({
  onResetProgress,
}: SettingsDropdownProps) {
  const { theme, setTheme, actualTheme, systemTheme } = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
    if (!isOpen) {
      setShowResetConfirm(false);
    }
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
    setShowResetConfirm(false);
  };

  const handleResetProgress = () => {
    onResetProgress();
    setShowResetConfirm(false);
    setIsDropdownOpen(false); // Close dropdown after reset
  };

  const dropdownContent = (
    <div>
      {/* Header */}
      <div
        className={`px-4 py-3 border-b ${
          actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h3
          className={`font-semibold text-sm ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          ⚙️ Settings
        </h3>
      </div>

      {/* Theme Section */}
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
          🎨 Theme
        </div>
        <div className='space-y-1'>
          {(['light', 'dark', 'system'] as const).map(themeOption => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                theme === themeOption
                  ? actualTheme === 'dark'
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-50 text-blue-700'
                  : actualTheme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-200'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className='text-base'>{getThemeIcon(themeOption)}</span>
              <span>{getThemeLabel(themeOption, systemTheme)}</span>
              {theme === themeOption && (
                <CheckIcon className='w-4 h-4 ml-auto flex-shrink-0' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Section */}
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
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
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
                onClick={handleResetProgress}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors'
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
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

      {/* Credits Section */}
      <div className='px-4 py-3'>
        <div
          className={`text-sm font-medium mb-2 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          👨‍💻 Credits
        </div>
        <div
          className={`text-xs leading-relaxed ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          <div className='mb-1'>
            <strong>Game Design & Development:</strong> Timothy (that's you!)
          </div>
          <div className='mb-1'>
            <strong>Powered by:</strong> React, TypeScript, Tailwind CSS
          </div>
          <div className='mb-1'>
            <strong>Code Editor:</strong> Monaco Editor
          </div>
          <div className='mb-1'>
            <strong>AI Assistant:</strong> Claude (Anthropic)
          </div>
          <div className='text-xs text-center mt-3 pt-2 border-t border-gray-600 dark:border-gray-700'>
            Made with 💻 and way too much ☕<br />
            <em>Vibe coded with Claude Code ✨</em>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseDropdown
      buttonClassName='bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-lg px-4 py-2 glass hover:bg-opacity-20 dark:hover:bg-opacity-20 text-sm font-medium min-h-[38px]'
      dropdownContent={dropdownContent}
      onToggle={handleToggle}
      isOpen={isDropdownOpen}
      onClose={handleClose}
    >
      <span className='text-sm font-semibold'>⚙️</span>
    </BaseDropdown>
  );
}
