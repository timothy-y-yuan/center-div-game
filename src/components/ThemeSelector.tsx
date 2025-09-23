import { useTheme } from '../hooks/useTheme';
import { CheckIcon } from './Icon';

interface ThemeSelectorProps {
  actualTheme: string;
}

const getThemeIcon = (theme: string) =>
  theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻';

const getThemeLabel = (theme: string, systemTheme: string) =>
  theme === 'system'
    ? `System (${systemTheme})`
    : theme.charAt(0).toUpperCase() + theme.slice(1);

export default function ThemeSelector({ actualTheme }: ThemeSelectorProps) {
  const { theme, setTheme, systemTheme } = useTheme();

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
  );
}