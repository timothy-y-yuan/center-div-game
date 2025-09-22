/**
 * @fileoverview Custom hook for managing overall game state
 * Provides centralized game state management with service layer integration
 */

import { useState, useCallback } from 'react';
import type { LevelId, Level } from '../types';
import { createLevelId } from '../utils/typeHelpers';
import { storageService } from '../services/StorageService';
import { gameStateService } from '../services/GameStateService';

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseGameStateResult {
  /** Current level index */
  readonly currentLevel: number;

  /** Whether the current level is completed */
  readonly isCompleted: boolean;

  /** Whether hint panel is visible */
  readonly showHint: boolean;

  /** Whether confetti animation should show */
  readonly showConfetti: boolean;

  /** Set of completed level IDs */
  readonly completedLevels: ReadonlySet<LevelId>;

  /** Set of failed level IDs */
  readonly failedLevels: ReadonlySet<LevelId>;

  /** Changes to a specific level */
  readonly changeLevel: (levelIndex: number) => void;

  /** Moves to the next level */
  readonly nextLevel: (totalLevels: number) => void;

  /** Toggles hint visibility */
  readonly toggleHint: () => void;

  /** Reveals the answer for current level */
  readonly revealAnswer: () => void;

  /** Resets all progress data */
  readonly resetProgress: () => void;

  /** Checks if current level is completed */
  readonly checkCompletion: (level: Level, iframeId: string) => void;

  /** Clears confetti animation */
  readonly clearConfetti: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for managing overall game state with persistence
 * @returns Game state and state management functions
 */
export function useGameState(): UseGameStateResult {
  // Initialize state from storage
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

  // ============================================================================
  // STATE MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Changes to a specific level with full state reset
   */
  const changeLevel = useCallback(
    (levelIndex: number) => {
      const levelId = createLevelId(levelIndex);

      setCurrentLevel(levelIndex);
      setShowHint(false);
      setIsCompleted(
        completedLevels.has(levelId) && !failedLevels.has(levelId)
      );

      // Persist the change
      storageService.setCurrentLevel(levelId);
    },
    [completedLevels, failedLevels]
  );

  /**
   * Moves to the next level if available
   */
  const nextLevel = useCallback(
    (totalLevels: number) => {
      if (currentLevel < totalLevels - 1) {
        changeLevel(currentLevel + 1);
      }
    },
    [currentLevel, changeLevel]
  );

  /**
   * Toggles hint panel visibility
   */
  const toggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  /**
   * Reveals the answer and marks level as failed
   */
  const revealAnswer = useCallback(() => {
    const levelId = createLevelId(currentLevel);
    const newFailedLevels = new Set(failedLevels);
    newFailedLevels.add(levelId);

    setFailedLevels(newFailedLevels);
    setShowHint(false);

    // Persist the failed level
    storageService.setFailedLevels(newFailedLevels);
  }, [currentLevel, failedLevels]);

  /**
   * Resets all progress and returns to first level
   */
  const resetProgress = useCallback(() => {
    storageService.clearAllData();

    setCompletedLevels(new Set());
    setFailedLevels(new Set());
    changeLevel(0);
  }, [changeLevel]);

  /**
   * Checks if the current level is completed using the game state service
   */
  const checkCompletion = useCallback(
    (level: Level, iframeId: string) => {
      const result = gameStateService.checkLevelCompletion(level, iframeId);
      const levelId = createLevelId(currentLevel);

      // Only allow completion if level wasn't previously failed
      const canComplete = result.isCompleted && !failedLevels.has(levelId);

      if (canComplete && !isCompleted) {
        // Trigger confetti on first completion
        setShowConfetti(true);

        // Mark level as completed
        const newCompletedLevels = new Set(completedLevels);
        newCompletedLevels.add(levelId);

        setCompletedLevels(newCompletedLevels);
        storageService.setCompletedLevels(newCompletedLevels);
      }

      setIsCompleted(canComplete);
    },
    [currentLevel, completedLevels, failedLevels, isCompleted]
  );

  /**
   * Clears the confetti animation
   */
  const clearConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

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
