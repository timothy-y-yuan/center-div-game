/**
 * @fileoverview Game state management service
 * Handles level completion logic, progress tracking, and game state transitions
 */

import { EDUCATIONAL_CONTENT, GAME_CONFIG, UI_CONSTANTS } from '../constants';
import type {
  Level,
  LevelId,
  LevelProgress,
  LevelRequirements,
  ProgressStats,
  TimestampMs,
  UserProgress,
} from '../types';
import {
  calculateDuration,
  createDurationMs,
  createTimestampMs,
} from '../utils/typeHelpers';

// ============================================================================
// COMPLETION MEASUREMENT TYPES
// ============================================================================

/**
 * Result of measuring element positioning for completion check
 */
export interface ElementMeasurement {
  readonly centerX: number;
  readonly centerY: number;
  readonly containerCenterX: number;
  readonly containerCenterY: number;
  readonly isValid: boolean;
}

/**
 * Result of checking level completion requirements
 */
export interface CompletionResult {
  readonly isCompleted: boolean;
  readonly isHorizontallyCentered: boolean;
  readonly isVerticallyCentered: boolean;
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
  readonly feedback: string;
}

// ============================================================================
// GAME STATE SERVICE INTERFACE
// ============================================================================

export interface IGameStateService {
  measureElementCentering(iframeId: string): ElementMeasurement;
  checkLevelCompletion(level: Level, iframeId: string): CompletionResult;
  calculateLevelProgress(
    levelId: LevelId,
    isCompleted: boolean,
    startTime: TimestampMs,
    hintsUsed: boolean,
    answersRevealed: number
  ): LevelProgress;
  calculateOverallStats(
    levelProgress: Record<LevelId, LevelProgress>
  ): ProgressStats;
  getPlayerTitle(completedLevelsCount: number): string;
  getCompletionMessage(
    isCompleted: boolean,
    hintsUsed: boolean,
    answersRevealed: number
  ): string;
  getFailureMessage(attemptNumber: number): string;
  createInitialUserProgress(): UserProgress;
  updateUserProgress(
    currentProgress: UserProgress,
    levelId: LevelId,
    levelProgress: LevelProgress
  ): UserProgress;
}

// ============================================================================
// GAME STATE SERVICE IMPLEMENTATION
// ============================================================================

/**
 * Service for managing game state and level completion logic
 */
export class GameStateService implements IGameStateService {
  measureElementCentering(iframeId: string): ElementMeasurement {
    try {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      if (!iframe?.contentDocument) {
        return this.createInvalidMeasurement();
      }

      const targetElement = iframe.contentDocument.querySelector('.target');
      const containerElement =
        iframe.contentDocument.querySelector('.container');

      if (!targetElement || !containerElement) {
        return this.createInvalidMeasurement();
      }

      const targetRect = targetElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      return {
        centerX: targetRect.left + targetRect.width / 2,
        centerY: targetRect.top + targetRect.height / 2,
        containerCenterX: containerRect.left + containerRect.width / 2,
        containerCenterY: containerRect.top + containerRect.height / 2,
        isValid: true,
      };
    } catch (error) {
      console.warn('Failed to measure element centering:', error);
      return this.createInvalidMeasurement();
    }
  }

  private createInvalidMeasurement(): ElementMeasurement {
    return {
      centerX: 0,
      centerY: 0,
      containerCenterX: 0,
      containerCenterY: 0,
      isValid: false,
    };
  }

  checkLevelCompletion(level: Level, iframeId: string): CompletionResult {
    const measurement = this.measureElementCentering(iframeId);

    if (!measurement.isValid) {
      return {
        isCompleted: false,
        isHorizontallyCentered: false,
        isVerticallyCentered: false,
        horizontalOffset: Infinity,
        verticalOffset: Infinity,
        feedback:
          'Unable to measure element positioning. Please check your HTML structure.',
      };
    }

    const requirements = level.requirements;
    const tolerance = UI_CONSTANTS.COMPLETION_TOLERANCE_PX;

    const horizontalOffset = Math.abs(
      measurement.centerX - measurement.containerCenterX
    );
    const verticalOffset = Math.abs(
      measurement.centerY - measurement.containerCenterY
    );

    const isHorizontallyCentered = horizontalOffset <= tolerance;
    const isVerticallyCentered = verticalOffset <= tolerance;

    // Check level-specific requirements
    const meetsHorizontalRequirement =
      !requirements.requiresHorizontalCentering || isHorizontallyCentered;
    const meetsVerticalRequirement =
      !requirements.requiresVerticalCentering || isVerticallyCentered;

    const isCompleted = meetsHorizontalRequirement && meetsVerticalRequirement;

    return {
      isCompleted,
      isHorizontallyCentered,
      isVerticallyCentered,
      horizontalOffset,
      verticalOffset,
      feedback: this.generateCompletionFeedback({
        isCompleted,
        isHorizontallyCentered,
        isVerticallyCentered,
        requirements,
        horizontalOffset,
        verticalOffset,
      }),
    };
  }

  /**
   * Generates human-readable feedback about completion status
   * @param params - Parameters for generating feedback
   * @returns Feedback message
   */
  private generateCompletionFeedback(params: {
    isCompleted: boolean;
    isHorizontallyCentered: boolean;
    isVerticallyCentered: boolean;
    requirements: LevelRequirements;
    horizontalOffset: number;
    verticalOffset: number;
  }): string {
    const {
      isCompleted,
      isHorizontallyCentered,
      isVerticallyCentered,
      requirements,
    } = params;

    if (isCompleted) {
      return 'Perfect! The element is properly centered.';
    }

    const issues: string[] = [];

    if (requirements.requiresHorizontalCentering && !isHorizontallyCentered) {
      issues.push(
        `horizontally off by ${Math.round(params.horizontalOffset)}px`
      );
    }

    if (requirements.requiresVerticalCentering && !isVerticallyCentered) {
      issues.push(`vertically off by ${Math.round(params.verticalOffset)}px`);
    }

    if (issues.length === 0) {
      return 'Not quite right. Check your CSS implementation.';
    }

    return `Close! The element is ${issues.join(' and ')}.`;
  }

  calculateLevelProgress(
    _levelId: LevelId,
    isCompleted: boolean,
    startTime: TimestampMs,
    hintsUsed: boolean,
    answersRevealed: number
  ): LevelProgress {
    const now = createTimestampMs();
    const completionTime = isCompleted
      ? calculateDuration(startTime, now)
      : null;

    return {
      completed: isCompleted,
      attempts: 1, // This would be incremented by the calling code
      completionTime,
      firstAttemptTime: startTime,
      completedTime: isCompleted ? now : null,
      hintsUsed,
      successfulSolution: null, // This would be set by the calling code
      answersRevealed,
    };
  }

  calculateOverallStats(
    levelProgress: Record<LevelId, LevelProgress>
  ): ProgressStats {
    const progressArray = Object.values(levelProgress);

    const totalLevelsCompleted = progressArray.filter(p => p.completed).length;
    const totalAttempts = progressArray.reduce((sum, p) => sum + p.attempts, 0);
    const totalHintsUsed = progressArray.filter(p => p.hintsUsed).length;
    const totalAnswersRevealed = progressArray.reduce(
      (sum, p) => sum + p.answersRevealed,
      0
    );

    // Calculate total play time and average completion time
    const completedLevels = progressArray.filter(
      p => p.completed && p.completionTime !== null
    );
    const totalPlayTime = completedLevels.reduce(
      (sum, p) => sum + (p.completionTime as number),
      0
    );

    const averageCompletionTime =
      completedLevels.length > 0
        ? createDurationMs(Math.round(totalPlayTime / completedLevels.length))
        : createDurationMs(0);

    return {
      totalLevelsCompleted,
      totalPlayTime: createDurationMs(totalPlayTime),
      averageCompletionTime,
      totalAttempts,
      totalHintsUsed,
      totalAnswersRevealed,
    };
  }

  getPlayerTitle(completedLevelsCount: number): string {
    const clampedCount = Math.max(
      0,
      Math.min(completedLevelsCount, GAME_CONFIG.TOTAL_LEVELS)
    );
    return EDUCATIONAL_CONTENT.PLAYER_TITLES[
      clampedCount as keyof typeof EDUCATIONAL_CONTENT.PLAYER_TITLES
    ];
  }

  getCompletionMessage(
    isCompleted: boolean,
    hintsUsed: boolean,
    answersRevealed: number
  ): string {
    if (!isCompleted) {
      return EDUCATIONAL_CONTENT.FAILURE_MESSAGES.FIRST_ATTEMPT;
    }

    if (answersRevealed > 0) {
      return EDUCATIONAL_CONTENT.COMPLETION_MESSAGES.WITH_REVEAL;
    }

    if (hintsUsed) {
      return EDUCATIONAL_CONTENT.COMPLETION_MESSAGES.WITH_HINTS;
    }

    return EDUCATIONAL_CONTENT.COMPLETION_MESSAGES.PERFECT;
  }

  getFailureMessage(attemptNumber: number): string {
    switch (attemptNumber) {
      case 1:
        return EDUCATIONAL_CONTENT.FAILURE_MESSAGES.FIRST_ATTEMPT;
      case 2:
        return EDUCATIONAL_CONTENT.FAILURE_MESSAGES.SECOND_ATTEMPT;
      case 3:
        return EDUCATIONAL_CONTENT.FAILURE_MESSAGES.THIRD_ATTEMPT;
      default:
        return EDUCATIONAL_CONTENT.FAILURE_MESSAGES.MANY_ATTEMPTS;
    }
  }

  createInitialUserProgress(): UserProgress {
    const now = createTimestampMs();

    return {
      levels: {},
      stats: {
        totalLevelsCompleted: 0,
        totalPlayTime: createDurationMs(0),
        averageCompletionTime: createDurationMs(0),
        totalAttempts: 0,
        totalHintsUsed: 0,
        totalAnswersRevealed: 0,
      },
      firstPlayTime: now,
      lastUpdated: now,
    };
  }

  updateUserProgress(
    currentProgress: UserProgress,
    levelId: LevelId,
    levelProgress: LevelProgress
  ): UserProgress {
    const updatedLevels = {
      ...currentProgress.levels,
      [levelId]: levelProgress,
    };

    const updatedStats = this.calculateOverallStats(updatedLevels);

    return {
      ...currentProgress,
      levels: updatedLevels,
      stats: updatedStats,
      lastUpdated: createTimestampMs(),
    };
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export function createGameStateService(): IGameStateService {
  return new GameStateService();
}

/**
 * Default game state service instance
 */
export const gameStateService = createGameStateService();
