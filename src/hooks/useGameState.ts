import { useState, useCallback } from 'react';
import type { Level } from '../types';
import { storageService } from '../services/StorageService';
import { checkLevelCompletion } from '../services/GameStateService';

export interface UseGameStateResult {
  readonly currentLevel: number;
  readonly isCompleted: boolean;
  readonly showHint: boolean;
  readonly showConfetti: boolean;

  /** Set of completed level IDs */
  readonly completedLevels: ReadonlySet<LevelId>;

  /** Set of failed level IDs */
  readonly failedLevels: ReadonlySet<LevelId>;

  /** Whether the secret level has been unlocked */
  readonly isSecretLevelUnlocked: boolean;

  /** Changes to a specific level */
  readonly changeLevel: (levelIndex: number) => void;
  readonly nextLevel: (totalLevels: number) => void;
  readonly toggleHint: () => void;
  readonly revealAnswer: () => void;
  readonly resetProgress: () => void;
  readonly checkCompletion: (level: Level, iframeId: string) => void;
  readonly clearConfetti: () => void;

  /** Unlocks secret level and switches to it */
  readonly unlockSecretLevel: () => void;
}

export function useGameState(): UseGameStateResult {
  const [currentLevel, setCurrentLevel] = useState(() =>
    storageService.getCurrentLevel()
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedLevels, setCompletedLevels] = useState(() =>
    storageService.getCompletedLevels()
  );
  const [failedLevels, setFailedLevels] = useState(() =>
    storageService.getFailedLevels()
  );
  const [isSecretLevelUnlocked, setIsSecretLevelUnlocked] = useState(() =>
    storageService.getSecretLevelUnlocked()
  );

  const changeLevel = useCallback(
    (levelIndex: number) => {
      setCurrentLevel(levelIndex);
      setShowHint(false);
      setIsCompleted(
        completedLevels.has(levelIndex) && !failedLevels.has(levelIndex)
      );
      storageService.setCurrentLevel(levelIndex);
    },
    [completedLevels, failedLevels]
  );

  const nextLevel = useCallback(
    (totalLevels: number) => {
      if (currentLevel < totalLevels - 1) {
        changeLevel(currentLevel + 1);
      }
    },
    [currentLevel, changeLevel]
  );

  const toggleHint = useCallback(() => setShowHint(prev => !prev), []);

  const revealAnswer = useCallback(() => {
    const newFailedLevels = new Set(failedLevels);
    newFailedLevels.add(currentLevel);
    setFailedLevels(newFailedLevels);
    setShowHint(false);
    storageService.setFailedLevels(newFailedLevels);
  }, [currentLevel, failedLevels]);

  const resetProgress = useCallback(() => {
    storageService.clearAllData();
    setCompletedLevels(new Set());
    setFailedLevels(new Set());
    changeLevel(0);
  }, [changeLevel]);

  const checkCompletion = useCallback(
    (level: Level, iframeId: string) => {
      const isLevelCompleted = checkLevelCompletion(level, iframeId);
      const canComplete = isLevelCompleted && !failedLevels.has(currentLevel);

      console.log(`🎮 useGameState Processing Results:`);
      console.log(`  - Service returned: ${isLevelCompleted}`);
      console.log(
        `  - Current level in failed set: ${failedLevels.has(currentLevel)}`
      );
      console.log(`  - Can complete: ${canComplete}`);
      console.log(`  - Currently completed: ${isCompleted}`);

      if (canComplete && !isCompleted) {
        console.log('🎉 Triggering completion: confetti + saving progress');
        setShowConfetti(true);
        const newCompletedLevels = new Set(completedLevels);
        newCompletedLevels.add(currentLevel);
        setCompletedLevels(newCompletedLevels);
        storageService.setCompletedLevels(newCompletedLevels);
      }
      setIsCompleted(canComplete);
    },
    [currentLevel, completedLevels, failedLevels, isCompleted]
  );

  const clearConfetti = useCallback(() => setShowConfetti(false), []);

  const unlockSecretLevel = useCallback(() => {
    setIsSecretLevelUnlocked(true);
    storageService.setSecretLevelUnlocked(true);
    changeLevel(999);
  }, [changeLevel]);

  return {
    currentLevel,
    isCompleted,
    showHint,
    showConfetti,
    completedLevels,
    failedLevels,
    isSecretLevelUnlocked,
    changeLevel,
    nextLevel,
    toggleHint,
    revealAnswer,
    resetProgress,
    checkCompletion,
    clearConfetti,
    unlockSecretLevel,
  };
}
