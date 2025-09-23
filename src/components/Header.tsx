/**
 * @fileoverview Header component with level controls and navigation
 */

import { memo, useRef, useState } from 'react';
import type {
  Level,
  ValidationFeedback as ValidationFeedbackData,
} from '../types';
import HintPopup from './HintPopup';
import ValidationFeedback from './ValidationFeedback';
import LevelDropdown from './LevelDropdown';
import SettingsDropdown from './SettingsDropdown';
import { calculateCenteringMetrics } from '../services/GameStateService';

// Simple inline utility functions
const isLevelCompleted = (
  levelIndex: number,
  completedLevels: ReadonlySet<number>,
  failedLevels: ReadonlySet<number>
) => completedLevels.has(levelIndex) && !failedLevels.has(levelIndex);
const isLevelFailed = (levelIndex: number, failedLevels: ReadonlySet<number>) =>
  failedLevels.has(levelIndex);

interface HeaderProps {
  levels: Level[];
  currentLevelIndex: number;
  completedLevels: ReadonlySet<number>;
  failedLevels: ReadonlySet<number>;
  showHint: boolean;
  onToggleHint: () => void;
  onCheck: () => void;
  onLevelSelect: (index: number) => void;
  onRevealAnswer: () => void;
  onResetProgress: () => void;
  onNextLevel: () => void;
}

/**
 * Header component with level navigation and controls
 * Memoized for optimal performance with shallow comparison
 */
const Header = memo(function Header({
  levels,
  currentLevelIndex,
  completedLevels,
  failedLevels,
  showHint,
  onToggleHint,
  onCheck,
  onLevelSelect,
  onRevealAnswer,
  onResetProgress,
  onNextLevel,
}: HeaderProps) {
  const currentLevel = levels[currentLevelIndex];
  const hintButtonRef = useRef<HTMLButtonElement>(null);
  const checkButtonRef = useRef<HTMLButtonElement>(null);
  const [showValidationFeedback, setShowValidationFeedback] = useState(false);
  const [validationFeedback, setValidationFeedback] =
    useState<ValidationFeedbackData | null>(null);

  const getPlayerTitle = (completedCount: number) => {
    const titles = [
      '0.001x Engineer',
      'Copy-Paste Padawan',
      'Stack Overflow Scholar',
      '!important Abuser',
      'Flexbox Whisperer',
      'CSS Semicolon Slayer',
      'Bootstrap Escapee',
      'Grid Master Race',
      'Layout Wizard Lord',
      'CSS Chaos Architect',
      'CSS Überwizardninjamaster',
    ];
    return titles[Math.min(completedCount, titles.length - 1)];
  };

  const playerTitle = getPlayerTitle(completedLevels.size);
  const isCurrentLevelCompleted = isLevelCompleted(
    currentLevelIndex,
    completedLevels,
    failedLevels
  );
  const isCurrentLevelFailed = isLevelFailed(currentLevelIndex, failedLevels);
  const showNextButton =
    (isCurrentLevelCompleted || isCurrentLevelFailed) &&
    currentLevelIndex < levels.length - 1;

  const handleCheck = () => {
    const feedback = calculateCenteringMetrics(currentLevel, 'preview');
    setValidationFeedback(feedback);

    if (feedback && !feedback.isCompleted) {
      setShowValidationFeedback(true);
    }

    onCheck();
  };

  return (
    <header className='relative z-10 glass border-b border-gray-200 dark:border-white border-opacity-10 dark:border-opacity-10 px-6 py-4'>
      {/* Top Row: Title & Controls */}
      <div className='flex items-center justify-between w-full mb-3'>
        {/* Left: Title */}
        <h1 className='text-4xl font-bold gradient-text leading-tight'>
          Can You Center The &lt;div&gt;?
        </h1>

        {/* Right: Controls */}
        <div className='flex items-center gap-3'>
          <SettingsDropdown onResetProgress={onResetProgress} />
          <LevelDropdown
            levels={levels}
            currentLevelIndex={currentLevelIndex}
            completedLevels={completedLevels}
            failedLevels={failedLevels}
            onLevelSelect={onLevelSelect}
          />
          <button
            data-testid='hint-button'
            ref={hintButtonRef}
            onClick={onToggleHint}
            className={`flex items-center gap-3 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
              showHint
                ? 'bg-amber-500 shadow-lg ring-2 ring-amber-300 ring-opacity-50'
                : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            <span>💡</span>
            <span>Hint</span>
          </button>
          <button
            data-testid='check-button'
            ref={checkButtonRef}
            onClick={handleCheck}
            className='flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors'
          >
            <span>🎯</span>
            <span>Check</span>
          </button>
          {showNextButton && (
            <button
              data-testid='header-next-level-button'
              onClick={onNextLevel}
              className='flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors'
            >
              <span>➡️</span>
              <span>Next Level</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Player Status & Progress Bar */}
      <div className='flex items-center justify-between w-full'>
        {/* Left: Player Title, Progress Bar & Stats */}
        <div className='flex items-center gap-4'>
          <div className='text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            {playerTitle}
          </div>
          <div className='w-48'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden'>
              <div className='h-full flex'>
                <div
                  className='bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500'
                  style={{
                    width: `${(completedLevels.size / levels.length) * 100}%`,
                  }}
                />
                <div
                  className='bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500'
                  style={{
                    width: `${(failedLevels.size / levels.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className='text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
            🎉 {completedLevels.size} • 😭 {failedLevels.size} •{' '}
            {levels.length - completedLevels.size - failedLevels.size} left
          </div>
        </div>

        {/* Right: Current Level Description */}
        <div className='text-gray-700 dark:text-gray-200 text-sm font-medium max-w-2xl text-right'>
          {currentLevel.description}
        </div>
      </div>

      <HintPopup
        isOpen={showHint}
        hint={currentLevel.hint}
        onClose={onToggleHint}
        buttonRef={hintButtonRef as React.RefObject<HTMLButtonElement>}
        onRevealAnswer={onRevealAnswer}
        isCompleted={isCurrentLevelCompleted}
        isFailed={isCurrentLevelFailed}
        solutionCSS={currentLevel.solutionCSS}
        explanation={currentLevel.explanation}
      />

      <ValidationFeedback
        isOpen={showValidationFeedback}
        feedback={validationFeedback}
        onClose={() => setShowValidationFeedback(false)}
        buttonRef={checkButtonRef as React.RefObject<HTMLButtonElement>}
      />
    </header>
  );
});

export default Header;
