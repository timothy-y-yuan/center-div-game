import { useRef } from 'react';
import type { Level, UserProgress } from '../types';
import HintPopup from './HintPopup';
import LevelDropdown from './LevelDropdown';
import SettingsDropdown from './SettingsDropdown';

interface HeaderProps {
  levels: Level[];
  currentLevelIndex: number;
  completedLevels: Set<number>;
  failedLevels: Set<number>;
  showHint: boolean;
  userProgress: UserProgress;
  onToggleHint: () => void;
  onCheck: () => void;
  onLevelSelect: (index: number) => void;
  onRevealAnswer: () => void;
  onResetProgress: () => void;
  onNextLevel: () => void;
}

export default function Header({
  levels,
  currentLevelIndex,
  completedLevels,
  failedLevels,
  showHint,
  userProgress,
  onToggleHint,
  onCheck,
  onLevelSelect,
  onRevealAnswer,
  onResetProgress,
  onNextLevel,
}: HeaderProps) {
  const currentLevel = levels[currentLevelIndex];
  const hintButtonRef = useRef<HTMLButtonElement>(null);

  const getPlayerTitle = (completedCount: number) => {
    const titles = [
      '0.001x Engineer',
      'Copy-Paste Rookie',
      'Stack Overflow Searcher',
      'Margin Margin Margin',
      'Flexbox Fumbler',
      'CSS Semicolon Forgetter',
      'Div Soup Chef',
      'Bootstrap Dependent',
      'CSS Grid Apprentice',
      'Layout Learner',
      'CSS Ninja',
    ];
    return titles[Math.min(completedCount, titles.length - 1)];
  };

  const playerTitle = getPlayerTitle(completedLevels.size);
  const isCurrentLevelCompleted =
    completedLevels.has(currentLevelIndex) &&
    !failedLevels.has(currentLevelIndex);
  const isCurrentLevelFailed = failedLevels.has(currentLevelIndex);
  const showNextButton =
    (isCurrentLevelCompleted || isCurrentLevelFailed) &&
    currentLevelIndex < levels.length - 1;

  return (
    <header className="relative z-10 glass border-b border-gray-200 dark:border-white border-opacity-10 dark:border-opacity-10 px-6 py-4">
      {/* Top Row: Title & Controls */}
      <div className="flex items-center justify-between w-full mb-3">
        {/* Left: Title */}
        <h1 className="text-4xl font-bold gradient-text leading-tight">
          Can You Center The &lt;div&gt;?
        </h1>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <SettingsDropdown onResetProgress={onResetProgress} />
          <LevelDropdown
            levels={levels}
            currentLevelIndex={currentLevelIndex}
            completedLevels={completedLevels}
            failedLevels={failedLevels}
            onLevelSelect={onLevelSelect}
          />
          <button
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
            onClick={onCheck}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <span>🎯</span>
            <span>Check</span>
          </button>
          {showNextButton && (
            <button
              onClick={onNextLevel}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <span>➡️</span>
              <span>Next Level</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Player Status & Progress Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Player Title, Progress Bar & Stats */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {playerTitle}
          </div>
          <div className="w-48">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${(completedLevels.size / levels.length) * 100}%`,
                  }}
                />
                <div
                  className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                  style={{
                    width: `${(failedLevels.size / levels.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            🎉 {completedLevels.size} • 😭 {failedLevels.size} •{' '}
            {levels.length - completedLevels.size - failedLevels.size} left
          </div>
        </div>

        {/* Right: Current Level Description */}
        <div className="text-gray-700 dark:text-gray-200 text-sm font-medium max-w-md text-right">
          {currentLevel.description}
        </div>
      </div>

      <HintPopup
        isOpen={showHint}
        hint={currentLevel.hint}
        onClose={onToggleHint}
        buttonRef={hintButtonRef as React.RefObject<HTMLButtonElement>}
        onRevealAnswer={onRevealAnswer}
        isCompleted={
          completedLevels.has(currentLevelIndex) &&
          !failedLevels.has(currentLevelIndex)
        }
        isFailed={failedLevels.has(currentLevelIndex)}
        solutionCSS={currentLevel.solutionCSS}
        explanation={currentLevel.explanation}
      />
    </header>
  );
}
