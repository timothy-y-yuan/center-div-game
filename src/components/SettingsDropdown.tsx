import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsDropdownProps {
  onResetProgress: () => void;
}

export default function SettingsDropdown({
  onResetProgress,
}: SettingsDropdownProps) {
  const { theme, setTheme, actualTheme, systemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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
        setShowResetConfirm(false);
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
    }
    setIsOpen(!isOpen);
    setShowResetConfirm(false);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleResetProgress = () => {
    onResetProgress();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  const getThemeIcon = (themeType: 'light' | 'dark' | 'system') => {
    switch (themeType) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '🌓';
      default:
        return '🌓';
    }
  };

  const getThemeLabel = (themeType: 'light' | 'dark' | 'system') => {
    switch (themeType) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return `Auto (${systemTheme})`;
      default:
        return 'Auto';
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="inline-flex items-center gap-3 bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-10 rounded-lg px-4 py-2 glass hover:bg-opacity-20 dark:hover:bg-opacity-20 transition-all duration-200"
      >
        <span className="text-lg">⚙️</span>
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
            className={`fixed w-80 rounded-lg shadow-xl z-[10000] ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-white border border-gray-200'
            }`}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
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
              <div className="space-y-1">
                {(['light', 'dark', 'system'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
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
                    <span className="text-base">
                      {getThemeIcon(themeOption)}
                    </span>
                    <span>{getThemeLabel(themeOption)}</span>
                    {theme === themeOption && (
                      <svg
                        className="w-4 h-4 ml-auto flex-shrink-0"
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
                  <span className="text-base">🗑️</span>
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
                    This will permanently delete all your progress, completed
                    levels, and scores.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetProgress}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
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
            <div className="px-4 py-3">
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
                <div className="mb-1">
                  <strong>Game Design & Development:</strong> Timothy (that's
                  you!)
                </div>
                <div className="mb-1">
                  <strong>Powered by:</strong> React, TypeScript, Tailwind CSS
                </div>
                <div className="mb-1">
                  <strong>Code Editor:</strong> Monaco Editor
                </div>
                <div className="mb-1">
                  <strong>AI Assistant:</strong> Claude (Anthropic)
                </div>
                <div className="text-xs text-center mt-3 pt-2 border-t border-gray-600 dark:border-gray-700">
                  Made with 💻 and way too much ☕<br />
                  <em>Vibe coded with Claude Code ✨</em>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
