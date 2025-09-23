import { type RefObject } from 'react';

interface HeaderControlsProps {
  showHint: boolean;
  onToggleHint: () => void;
  onCheck: () => void;
  onNextLevel: () => void;
  showNextButton: boolean;
  hintButtonRef: RefObject<HTMLButtonElement | null>;
  checkButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function HeaderControls({
  showHint,
  onToggleHint,
  onCheck,
  onNextLevel,
  showNextButton,
  hintButtonRef,
  checkButtonRef,
}: HeaderControlsProps) {
  return (
    <div className='flex items-center gap-3'>
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
        onClick={onCheck}
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
  );
}
