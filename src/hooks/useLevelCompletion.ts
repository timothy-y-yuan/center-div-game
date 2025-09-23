import { useCallback } from 'react';
import { gameStateService } from '../services/GameStateService';
import type { Level } from '../types';

export interface UseLevelCompletionResult {
  readonly checkCompletion: (
    level: Level,
    iframeId: string
  ) => CompletionCheckResult;

  readonly getCompletionMessage: (
    isCompleted: boolean,
    hintsUsed: boolean,
    answersRevealed: number
  ) => string;

  readonly getFailureMessage: (attemptNumber: number) => string;

  readonly getPlayerTitle: (completedLevelsCount: number) => string;
}

export interface CompletionCheckResult {
  readonly isCompleted: boolean;
  readonly isHorizontallyCentered: boolean;
  readonly isVerticallyCentered: boolean;
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
  readonly feedback: string;
  readonly measurement: import('../services/GameStateService').ElementMeasurement;
}

export function useLevelCompletion(): UseLevelCompletionResult {
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

  const getFailureMessage = useCallback((attemptNumber: number): string => {
    return gameStateService.getFailureMessage(attemptNumber);
  }, []);

  const getPlayerTitle = useCallback((completedLevelsCount: number): string => {
    return gameStateService.getPlayerTitle(completedLevelsCount);
  }, []);

  return {
    checkCompletion,
    getCompletionMessage,
    getFailureMessage,
    getPlayerTitle,
  };
}
