/**
 * @fileoverview Game state management service
 * Handles level completion logic, progress tracking, and game state transitions
 */

import { UI_CONSTANTS, GAME_CONFIG, EDUCATIONAL_CONTENT } from '../constants';
import type {
  LevelId,
  Level,
  LevelState,
  TimestampMs,
  DurationMs,
  UserProgress,
  LevelProgress,
  ProgressStats,
} from '../types';
import {
  createLevelId,
  createTimestampMs,
  createDurationMs,
  calculateDuration,
} from '../utils/typeHelpers';

// ============================================================================
// COMPLETION MEASUREMENT TYPES
// ============================================================================

/**
 * Result of measuring element positioning for completion check
 */
export interface ElementMeasurement {
  /** Element's center X coordinate */
  readonly centerX: number;

  /** Element's center Y coordinate */
  readonly centerY: number;

  /** Container's center X coordinate */
  readonly containerCenterX: number;

  /** Container's center Y coordinate */
  readonly containerCenterY: number;

  /** Whether the element exists and is measurable */
  readonly isValid: boolean;
}

/**
 * Result of checking level completion requirements
 */
export interface CompletionResult {
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
}

/**
 * Level requirements configuration
 */
export interface LevelRequirements {
  /** Whether horizontal centering is required */
  readonly requiresHorizontalCentering: boolean;

  /** Whether vertical centering is required */
  readonly requiresVerticalCentering: boolean;

  /** Custom validation function for advanced requirements */
  readonly customValidator?: (measurement: ElementMeasurement) => boolean;
}

// ============================================================================
// GAME STATE SERVICE INTERFACE
// ============================================================================

export interface IGameStateService {
  measureElementCentering(iframeId: string): ElementMeasurement;
  checkLevelCompletion(level: Level, iframeId: string): CompletionResult;
  getLevelRequirements(levelId: LevelId): LevelRequirements;
  calculateLevelProgress(
    levelId: LevelId,
    isCompleted: boolean,
    startTime: TimestampMs,
    hintsUsed: boolean,
    answersRevealed: number
  ): LevelProgress;
  calculateOverallStats(levelProgress: Record<LevelId, LevelProgress>): ProgressStats;
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
  /**
   * Measures the positioning of the target element within its container
   * @param iframeId - ID of the iframe containing the preview
   * @returns Measurement data for completion checking
   */
  measureElementCentering(iframeId: string): ElementMeasurement {
    try {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      if (!iframe?.contentDocument) {
        return this.createInvalidMeasurement();
      }

      const targetElement = iframe.contentDocument.querySelector('.target');
      const containerElement = iframe.contentDocument.querySelector('.container');

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

  /**
   * Creates an invalid measurement result
   * @returns Invalid measurement with default values
   */
  private createInvalidMeasurement(): ElementMeasurement {
    return {
      centerX: 0,
      centerY: 0,
      containerCenterX: 0,
      containerCenterY: 0,
      isValid: false,
    };
  }

  /**
   * Checks if a level's completion requirements are met
   * @param level - The level to check
   * @param iframeId - ID of the iframe containing the preview
   * @returns Detailed completion result
   */
  checkLevelCompletion(level: Level, iframeId: string): CompletionResult {
    const measurement = this.measureElementCentering(iframeId);

    if (!measurement.isValid) {
      return {
        isCompleted: false,
        isHorizontallyCentered: false,
        isVerticallyCentered: false,
        horizontalOffset: Infinity,
        verticalOffset: Infinity,
        feedback: 'Unable to measure element positioning. Please check your HTML structure.',
      };
    }

    const requirements = this.getLevelRequirements(level.id);
    const tolerance = UI_CONSTANTS.COMPLETION_TOLERANCE_PX;

    const horizontalOffset = Math.abs(measurement.centerX - measurement.containerCenterX);
    const verticalOffset = Math.abs(measurement.centerY - measurement.containerCenterY);

    const isHorizontallyCentered = horizontalOffset <= tolerance;
    const isVerticallyCentered = verticalOffset <= tolerance;

    // Check level-specific requirements
    const meetsHorizontalRequirement = !requirements.requiresHorizontalCentering || isHorizontallyCentered;
    const meetsVerticalRequirement = !requirements.requiresVerticalCentering || isVerticallyCentered;
    const meetsCustomRequirement = !requirements.customValidator || requirements.customValidator(measurement);

    const isCompleted = meetsHorizontalRequirement && meetsVerticalRequirement && meetsCustomRequirement;

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
    const { isCompleted, isHorizontallyCentered, isVerticallyCentered, requirements } = params;

    if (isCompleted) {
      return 'Perfect! The element is properly centered.';
    }

    const issues: string[] = [];

    if (requirements.requiresHorizontalCentering && !isHorizontallyCentered) {
      issues.push(`horizontally off by ${Math.round(params.horizontalOffset)}px`);
    }

    if (requirements.requiresVerticalCentering && !isVerticallyCentered) {
      issues.push(`vertically off by ${Math.round(params.verticalOffset)}px`);
    }

    if (issues.length === 0) {
      return 'Not quite right. Check your CSS implementation.';
    }

    return `Close! The element is ${issues.join(' and ')}.`;
  }

  /**
   * Gets the completion requirements for a specific level
   * @param levelId - ID of the level
   * @returns Level-specific requirements
   */
  getLevelRequirements(levelId: LevelId): LevelRequirements {
    const levelNumber = levelId as number;

    // Level 1 (index 0) only requires horizontal centering
    if (levelNumber === 0) {
      return {
        requiresHorizontalCentering: true,
        requiresVerticalCentering: false,
      };
    }

    // All other levels require both horizontal and vertical centering
    return {
      requiresHorizontalCentering: true,
      requiresVerticalCentering: true,
    };
  }

  /**
   * Calculates level progress statistics
   * @param levelId - ID of the level
   * @param isCompleted - Whether the level was completed
   * @param startTime - When the level attempt started
   * @param hintsUsed - Whether hints were used
   * @param answersRevealed - Number of times the answer was revealed
   * @returns Complete level progress data
   */
  calculateLevelProgress(
    levelId: LevelId,
    isCompleted: boolean,
    startTime: TimestampMs,
    hintsUsed: boolean,
    answersRevealed: number
  ): LevelProgress {
    const now = createTimestampMs();
    const completionTime = isCompleted ? calculateDuration(startTime, now) : null;

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

  /**
   * Calculates overall progress statistics from individual level progress
   * @param levelProgress - Progress data for all levels
   * @returns Aggregated statistics
   */
  calculateOverallStats(levelProgress: Record<LevelId, LevelProgress>): ProgressStats {
    const progressArray = Object.values(levelProgress);

    const totalLevelsCompleted = progressArray.filter(p => p.completed).length;
    const totalAttempts = progressArray.reduce((sum, p) => sum + p.attempts, 0);
    const totalHintsUsed = progressArray.filter(p => p.hintsUsed).length;
    const totalAnswersRevealed = progressArray.reduce((sum, p) => sum + p.answersRevealed, 0);

    // Calculate total play time and average completion time
    const completedLevels = progressArray.filter(p => p.completed && p.completionTime !== null);
    const totalPlayTime = completedLevels.reduce(
      (sum, p) => sum + (p.completionTime as number),
      0
    );

    const averageCompletionTime = completedLevels.length > 0
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

  /**
   * Gets the player title based on completion progress
   * @param completedLevelsCount - Number of completed levels
   * @returns Player title string
   */
  getPlayerTitle(completedLevelsCount: number): string {
    const clampedCount = Math.max(0, Math.min(completedLevelsCount, GAME_CONFIG.TOTAL_LEVELS));
    return EDUCATIONAL_CONTENT.PLAYER_TITLES[clampedCount as keyof typeof EDUCATIONAL_CONTENT.PLAYER_TITLES];
  }

  /**
   * Gets an appropriate completion message based on performance
   * @param isCompleted - Whether the level was completed
   * @param hintsUsed - Whether hints were used
   * @param answersRevealed - Number of times the answer was revealed
   * @returns Completion message
   */
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

  /**
   * Gets an appropriate failure message based on attempt number
   * @param attemptNumber - Current attempt number (1-based)
   * @returns Failure message
   */
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

  /**
   * Creates initial user progress data for a new player
   * @returns Fresh user progress structure
   */
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

  /**
   * Updates user progress with new level completion data
   * @param currentProgress - Current user progress
   * @param levelId - ID of the completed level
   * @param levelProgress - New progress data for the level
   * @returns Updated user progress
   */
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

/**
 * Creates a game state service instance
 * @returns Game state service instance
 */
export function createGameStateService(): IGameStateService {
  return new GameStateService();
}

/**
 * Default game state service instance
 */
export const gameStateService = createGameStateService();