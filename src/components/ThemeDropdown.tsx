import type { Theme } from '../contexts/themeContext';
import { useTheme } from '../hooks/useTheme';
import BaseDropdown from './BaseDropdown';
import { CheckIcon } from './Icon';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: string;
}

// Simple inline theme helpers
const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const getThemeOptions = (systemTheme: string): ThemeOption[] => [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: `System (${systemTheme})`, icon: '💻' },
];

export default function ThemeDropdown() {
  const { theme, actualTheme, setTheme } = useTheme();

  const systemTheme = getSystemTheme();
  const options = getThemeOptions(systemTheme);
  const currentOption = options.find(opt => opt.value === theme) || options[0];

  const dropdownContent = (
    <div>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
            actualTheme === 'dark'
              ? `hover:bg-gray-700 ${
                  theme === option.value
                    ? 'bg-blue-900/20 text-blue-300'
                    : 'text-gray-200'
                }`
              : `hover:bg-gray-100 ${
                  theme === option.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700'
                }`
          }`}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
          {theme === option.value && <CheckIcon className='w-4 h-4 ml-auto' />}
        </button>
      ))}
    </div>
  );

  return (
    <BaseDropdown
      buttonClassName='bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors'
      dropdownContent={dropdownContent}
      dropdownWidth='w-40'
      aria-label={`Theme: ${currentOption.label}`}
    >
      <span>{currentOption.icon}</span>
      <span className='hidden sm:inline'>{currentOption.label}</span>
    </BaseDropdown>
  );
}
