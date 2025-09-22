/**
 * @fileoverview Custom hook for level completion checking and feedback
 * Provides completion validation and feedback messaging
 */

import { useCallback } from 'react';
import type { Level, LevelId } from '../types';
import { gameStateService } from '../services/GameStateService';

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseLevelCompletionResult {
  /** Checks if the current level is completed */
  readonly checkCompletion: (
    level: Level,
    iframeId: string
  ) => CompletionCheckResult;

  /** Gets completion requirements for a level */
  readonly getLevelRequirements: (
    levelId: LevelId
  ) => import('../services/GameStateService').LevelRequirements;

  /** Gets appropriate completion message */
  readonly getCompletionMessage: (
    isCompleted: boolean,
    hintsUsed: boolean,
    answersRevealed: number
  ) => string;

  /** Gets appropriate failure message */
  readonly getFailureMessage: (attemptNumber: number) => string;

  /** Gets player title for completion count */
  readonly getPlayerTitle: (completedLevelsCount: number) => string;
}

export interface CompletionCheckResult {
  /** Whether the level is completed */
  readonly isCompleted: boolean;

  /** Whether horizontal centering requirement is met */
  readonly isHorizontallyCentered: boolean;

  /** Whether vertical centering requirement is met */
  readonly isVerticallyCentered: boolean;

  /** Distance from perfect horizontal center in pixels */
  readonly horizontalOffset: number;

  /** Distance from perfect vertical center in pixels */
  readonly verticalOffset: number;

  /** Human-readable feedback about the completion status */
  readonly feedback: string;

  /** Raw element measurement data */
  readonly measurement: import('../services/GameStateService').ElementMeasurement;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for level completion logic
 * @returns Completion checking functions and utilities
 */
export function useLevelCompletion(): UseLevelCompletionResult {
  // ============================================================================
  // COMPLETION CHECKING
  // ============================================================================

  /**
   * Checks if a level is completed and provides detailed feedback
   */
  const checkCompletion = useCallback(
    (level: Level, iframeId: string): CompletionCheckResult => {
      try {
        const result = gameStateService.checkLevelCompletion(level, iframeId);
        const measurement = gameStateService.measureElementCentering(iframeId);

        return {
          isCompleted: result.isCompleted,
          isHorizontallyCentered: result.isHorizontallyCentered,
          isVerticallyCentered: result.isVerticallyCentered,
          horizontalOffset: result.horizontalOffset,
          verticalOffset: result.verticalOffset,
          feedback: result.feedback,
          measurement,
        };
      } catch (error) {
        console.error('Error checking level completion:', error);

        // Return safe fallback result
        return {
          isCompleted: false,
          isHorizontallyCentered: false,
          isVerticallyCentered: false,
          horizontalOffset: Infinity,
          verticalOffset: Infinity,
          feedback:
            'Unable to check completion. Please ensure your HTML structure is correct.',
          measurement: {
            centerX: 0,
            centerY: 0,
            containerCenterX: 0,
            containerCenterY: 0,
            isValid: false,
          },
        };
      }
    },
    []
  );

  /**
   * Gets the completion requirements for a specific level
   */
  const getLevelRequirements = useCallback((levelId: LevelId) => {
    return gameStateService.getLevelRequirements(levelId);
  }, []);

  // ============================================================================
  // MESSAGE GENERATION
  // ============================================================================

  /**
   * Gets appropriate completion message based on performance
   */
  const getCompletionMessage = useCallback(
    (
      isCompleted: boolean,
      hintsUsed: boolean,
      answersRevealed: number
    ): string => {
      return gameStateService.getCompletionMessage(
        isCompleted,
        hintsUsed,
        answersRevealed
      );
    },
    []
  );

  /**
   * Gets appropriate failure message based on attempt number
   */
  const getFailureMessage = useCallback((attemptNumber: number): string => {
    return gameStateService.getFailureMessage(attemptNumber);
  }, []);

  /**
   * Gets player title based on completion progress
   */
  const getPlayerTitle = useCallback((completedLevelsCount: number): string => {
    return gameStateService.getPlayerTitle(completedLevelsCount);
  }, []);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return {
    checkCompletion,
    getLevelRequirements,
    getCompletionMessage,
    getFailureMessage,
    getPlayerTitle,
  };
}
