import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  LevelId,
  UserProgress,
  LevelProgress,
  ProgressStats,
  TimestampMs,
  DurationMs,
} from '../types';
import { createTimestampMs } from '../utils/typeHelpers';
import { storageService } from '../services/StorageService';
import { gameStateService } from '../services/GameStateService';

export interface UseProgressResult {
  readonly userProgress: UserProgress | null;
  readonly progressStats: ProgressStats;
  readonly playerTitle: string;
  readonly isLoaded: boolean;
  readonly recordLevelCompletion: (
    levelId: LevelId,
    hintsUsed: boolean,
    answersRevealed: number,
    startTime: TimestampMs
  ) => void;
  readonly recordLevelAttempt: (levelId: LevelId) => void;
  readonly getLevelProgress: (levelId: LevelId) => LevelProgress | null;

  /** Clears all progress data */
  readonly clearProgress: () => void;

  /** Exports progress data as JSON */
  readonly exportProgress: () => string;

  /** Imports progress data from JSON */
  readonly importProgress: (jsonData: string) => boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for comprehensive progress management
 * @returns Progress state and management functions
 */
export function useProgress(): UseProgressResult {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Load progress from storage on mount
   */
  useEffect(() => {
    const loadProgress = () => {
      try {
        const storedProgress = storageService.getUserProgress();

        if (storedProgress) {
          setUserProgress(storedProgress);
        } else {
          // Create initial progress if none exists
          const initialProgress = gameStateService.createInitialUserProgress();
          setUserProgress(initialProgress);
          storageService.setUserProgress(initialProgress);
        }
      } catch (error) {
        console.warn('Failed to load user progress:', error);
        // Fallback to initial progress
        const initialProgress = gameStateService.createInitialUserProgress();
        setUserProgress(initialProgress);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * Current progress statistics
   */
  const progressStats = useMemo((): ProgressStats => {
    if (!userProgress) {
      return {
        totalLevelsCompleted: 0,
        totalPlayTime: 0 as DurationMs,
        averageCompletionTime: 0 as DurationMs,
        totalAttempts: 0,
        totalHintsUsed: 0,
        totalAnswersRevealed: 0,
      };
    }

    return gameStateService.calculateOverallStats(userProgress.levels);
  }, [userProgress]);

  /**
   * Player title based on completion count
   */
  const playerTitle = useMemo(
    () => gameStateService.getPlayerTitle(progressStats.totalLevelsCompleted),
    [progressStats.totalLevelsCompleted]
  );

  // ============================================================================
  // PROGRESS MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Records successful completion of a level
   */
  const recordLevelCompletion = useCallback(
    (
      levelId: LevelId,
      hintsUsed: boolean,
      answersRevealed: number,
      startTime: TimestampMs
    ) => {
      if (!userProgress) return;

      try {
        const levelProgress = gameStateService.calculateLevelProgress(
          levelId,
          true, // isCompleted
          startTime,
          hintsUsed,
          answersRevealed
        );

        const updatedProgress = gameStateService.updateUserProgress(
          userProgress,
          levelId,
          levelProgress
        );

        setUserProgress(updatedProgress);
        storageService.setUserProgress(updatedProgress);
      } catch (error) {
        console.error('Failed to record level completion:', error);
      }
    },
    [userProgress]
  );

  /**
   * Records an attempt on a level (increments attempt counter)
   */
  const recordLevelAttempt = useCallback(
    (levelId: LevelId) => {
      if (!userProgress) return;

      try {
        const existingProgress = userProgress.levels[levelId];

        if (existingProgress) {
          // Increment attempt count
          const updatedLevelProgress: LevelProgress = {
            ...existingProgress,
            attempts: existingProgress.attempts + 1,
          };

          const updatedProgress = gameStateService.updateUserProgress(
            userProgress,
            levelId,
            updatedLevelProgress
          );

          setUserProgress(updatedProgress);
          storageService.setUserProgress(updatedProgress);
        } else {
          // First attempt - create initial progress
          const initialProgress = gameStateService.calculateLevelProgress(
            levelId,
            false, // not completed yet
            createTimestampMs(),
            false, // no hints used yet
            0 // no answers revealed yet
          );

          const updatedProgress = gameStateService.updateUserProgress(
            userProgress,
            levelId,
            initialProgress
          );

          setUserProgress(updatedProgress);
          storageService.setUserProgress(updatedProgress);
        }
      } catch (error) {
        console.error('Failed to record level attempt:', error);
      }
    },
    [userProgress]
  );

  /**
   * Gets progress data for a specific level
   */
  const getLevelProgress = useCallback(
    (levelId: LevelId): LevelProgress | null => {
      return userProgress?.levels[levelId] || null;
    },
    [userProgress]
  );

  /**
   * Clears all progress data
   */
  const clearProgress = useCallback(() => {
    try {
      const initialProgress = gameStateService.createInitialUserProgress();
      setUserProgress(initialProgress);
      storageService.setUserProgress(initialProgress);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }, []);

  /**
   * Exports progress data as JSON string
   */
  const exportProgress = useCallback((): string => {
    if (!userProgress) {
      return JSON.stringify(
        gameStateService.createInitialUserProgress(),
        null,
        2
      );
    }

    return JSON.stringify(userProgress, null, 2);
  }, [userProgress]);

  /**
   * Imports progress data from JSON string
   */
  const importProgress = useCallback((jsonData: string): boolean => {
    try {
      const importedProgress = JSON.parse(jsonData) as UserProgress;

      // Basic validation
      if (!importedProgress.levels || !importedProgress.stats) {
        throw new Error('Invalid progress data format');
      }

      setUserProgress(importedProgress);
      storageService.setUserProgress(importedProgress);
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }, []);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return {
    userProgress,
    progressStats,
    playerTitle,
    isLoaded,
    recordLevelCompletion,
    recordLevelAttempt,
    getLevelProgress,
    clearProgress,
    exportProgress,
    importProgress,
  };
}
