/**
 * @fileoverview Type definitions for the Center Div Game
 */

// Basic types - removing over-engineered branded types
export type LevelId = number;
export type CSSSelector = string;
export type CSSProperty = string;

export type ThemeMode = 'light' | 'dark' | 'system';

export interface EditableSelector {
  readonly lockedProperties: readonly string[];
  readonly allowedProperties: readonly string[];
  readonly initialEditableCSS: string;
  readonly hint?: string;
}

export interface Level {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly initialHTML: string;
  readonly lockedCSS: string;
  readonly editableSelectors: Record<string, EditableSelector>;
  readonly constraints: string;
  readonly requirements: LevelRequirements;
  readonly hint: string;
  readonly solutionCSS: string;
  readonly explanation: string;
  readonly tags: readonly string[];
}

export interface LevelRequirements {
  readonly requiresHorizontalCentering: boolean;
  readonly requiresVerticalCentering: boolean;
}

export interface ValidationMessage {
  readonly message: string;
  readonly severity: 'error' | 'warning' | 'info';
}

export interface CSSValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationMessage[];
  readonly warnings: readonly ValidationMessage[];
  readonly info: readonly ValidationMessage[];
}

export interface ValidationFeedback {
  readonly isCompleted: boolean;
  readonly horizontalCentered: boolean;
  readonly verticallyCentered: boolean;
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
  readonly requiresHorizontal: boolean;
  readonly requiresVertical: boolean;
}

// Simplified progress tracking - removing over-engineered tracking
export interface UserProgress {
  readonly completedLevels: Set<number>;
  readonly failedLevels: Set<number>;
  readonly currentLevel: number;
}
