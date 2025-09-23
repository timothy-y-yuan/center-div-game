import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import BaseDropdown from './BaseDropdown';
import ThemeSelector from './ThemeSelector';
import ResetConfirmation from './ResetConfirmation';
import CreditsSection from './CreditsSection';

interface SettingsDropdownProps {
  onResetProgress: () => void;
}

export default function SettingsDropdown({
  onResetProgress,
}: SettingsDropdownProps) {
  const { actualTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
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

      <ThemeSelector actualTheme={actualTheme} />

      <ResetConfirmation
        actualTheme={actualTheme}
        onResetProgress={onResetProgress}
        onClose={handleClose}
      />

      <CreditsSection actualTheme={actualTheme} />
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
