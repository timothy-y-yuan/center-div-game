import { useState, useCallback } from 'react';
import type { LevelId, Level } from '../types';
import { createLevelId } from '../utils/typeHelpers';
import { storageService } from '../services/StorageService';
import { gameStateService } from '../services/GameStateService';

export interface UseGameStateResult {
  readonly currentLevel: number;
  readonly isCompleted: boolean;
  readonly showHint: boolean;
  readonly showConfetti: boolean;
  readonly completedLevels: ReadonlySet<LevelId>;
  readonly failedLevels: ReadonlySet<LevelId>;
  readonly changeLevel: (levelIndex: number) => void;
  readonly nextLevel: (totalLevels: number) => void;
  readonly toggleHint: () => void;
  readonly revealAnswer: () => void;
  readonly resetProgress: () => void;
  readonly checkCompletion: (level: Level, iframeId: string) => void;
  readonly clearConfetti: () => void;
}

export function useGameState(): UseGameStateResult {
  const [currentLevel, setCurrentLevel] = useState(
    () => storageService.getCurrentLevel() as number
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

  const changeLevel = useCallback(
    (levelIndex: number) => {
      const levelId = createLevelId(levelIndex);

      setCurrentLevel(levelIndex);
      setShowHint(false);
      setIsCompleted(
        completedLevels.has(levelId) && !failedLevels.has(levelId)
      );

      storageService.setCurrentLevel(levelId);
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

  const toggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  const revealAnswer = useCallback(() => {
    const levelId = createLevelId(currentLevel);
    const newFailedLevels = new Set(failedLevels);
    newFailedLevels.add(levelId);

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
      const result = gameStateService.checkLevelCompletion(level, iframeId);
      const levelId = createLevelId(currentLevel);

      const canComplete = result.isCompleted && !failedLevels.has(levelId);

      if (canComplete && !isCompleted) {
        setShowConfetti(true);

        const newCompletedLevels = new Set(completedLevels);
        newCompletedLevels.add(levelId);

        setCompletedLevels(newCompletedLevels);
        storageService.setCompletedLevels(newCompletedLevels);
      }

      setIsCompleted(canComplete);
    },
    [currentLevel, completedLevels, failedLevels, isCompleted]
  );

  const clearConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return {
    currentLevel,
    isCompleted,
    showHint,
    showConfetti,
    completedLevels,
    failedLevels,
    changeLevel,
    nextLevel,
    toggleHint,
    revealAnswer,
    resetProgress,
    checkCompletion,
    clearConfetti,
  };
}
