/**
 * @fileoverview Type definitions for the Center Div Game
 * Provides comprehensive type safety with branded types and strict constraints
 */

// ============================================================================
// BRANDED TYPES
// ============================================================================

/**
 * Branded type for level identifiers to prevent mixing with regular numbers
 */
export type LevelId = number & { readonly __brand: unique symbol };

/**
 * Branded type for timestamp values in milliseconds
 */
export type TimestampMs = number & { readonly __brand: unique symbol };

/**
 * Branded type for time duration values in milliseconds
 */
export type DurationMs = number & { readonly __brand: unique symbol };

/**
 * Type-safe CSS selector string that must start with . or #
 */
export type CSSSelector = `.${string}` | `#${string}` | string;

/**
 * Valid CSS property names (subset of commonly used properties)
 */
export type CSSProperty =
  | 'margin'
  | 'margin-top'
  | 'margin-right'
  | 'margin-bottom'
  | 'margin-left'
  | 'padding'
  | 'padding-top'
  | 'padding-right'
  | 'padding-bottom'
  | 'padding-left'
  | 'display'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'width'
  | 'height'
  | 'max-width'
  | 'max-height'
  | 'min-width'
  | 'min-height'
  | 'flex'
  | 'flex-direction'
  | 'flex-wrap'
  | 'justify-content'
  | 'align-items'
  | 'align-content'
  | 'grid'
  | 'grid-template-columns'
  | 'grid-template-rows'
  | 'grid-gap'
  | 'grid-column'
  | 'grid-row'
  | 'text-align'
  | 'vertical-align'
  | 'line-height'
  | 'font-size'
  | 'color'
  | 'transform'
  | 'transform-origin'
  | 'border'
  | 'border-radius'
  | 'background'
  | 'background-color'
  | 'overflow'
  | 'z-index'
  | 'opacity'
  | 'visibility'
  | 'place-items'
  | 'justify-items'
  | 'content'
  | 'box-shadow'
  | '*'; // Special wildcard to allow all properties

// ============================================================================
// GAME STATE TYPES
// ============================================================================

/**
 * All possible states a level can be in
 */
export type LevelState = 'idle' | 'checking' | 'completed' | 'failed';

/**
 * Theme modes supported by the application
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Difficulty levels for educational progression
 */
export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

// ============================================================================
// LEVEL DEFINITION INTERFACES
// ============================================================================

/**
 * Configuration for what CSS properties can be edited on a specific selector
 */
export interface EditableSelector {
  readonly lockedProperties: readonly CSSProperty[];
  readonly allowedProperties: readonly CSSProperty[];
  readonly initialEditableCSS: string;
  readonly hint?: string;
}

/**
 * Complete level definition with educational content and constraints
 */
export interface Level {
  readonly id: LevelId;
  readonly title: string;
  readonly description: string;
  readonly initialHTML: string;
  readonly lockedCSS: string;
  readonly editableSelectors: Record<CSSSelector, EditableSelector>;
  readonly constraints: string;
  readonly requirements: LevelRequirements;
  readonly hint: string;
  readonly solutionCSS: string;
  readonly explanation: string;
  readonly difficulty: DifficultyLevel;
  readonly tags: readonly string[];
}

/**
 * Level requirements configuration
 */
export interface LevelRequirements {
  readonly requiresHorizontalCentering: boolean;
  readonly requiresVerticalCentering: boolean;
}

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

/**
 * Severity levels for validation messages
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Individual validation message with context
 */
export interface ValidationMessage {
  readonly message: string;
  readonly severity: ValidationSeverity;
  readonly selector?: CSSSelector;
  readonly property?: CSSProperty;
  readonly line?: number;
}

/**
 * Complete result of CSS validation against level constraints
 */
export interface CSSValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationMessage[];
  readonly warnings: readonly ValidationMessage[];
  readonly info: readonly ValidationMessage[];
}

// ============================================================================
// PROGRESS TRACKING INTERFACES
// ============================================================================

/**
 * Progress tracking for a single level
 */
export interface LevelProgress {
  readonly completed: boolean;
  readonly attempts: number;
  readonly completionTime: DurationMs | null;
  readonly firstAttemptTime: TimestampMs;
  readonly completedTime: TimestampMs | null;
  readonly hintsUsed: boolean;
  readonly successfulSolution: string | null;
  readonly answersRevealed: number;
}

/**
 * Overall statistics for user progress
 */
export interface ProgressStats {
  readonly totalLevelsCompleted: number;
  readonly totalPlayTime: DurationMs;
  readonly averageCompletionTime: DurationMs;
  readonly totalAttempts: number;
  readonly totalHintsUsed: number;
  readonly totalAnswersRevealed: number;
}

/**
 * Complete user progress tracking
 */
export interface UserProgress {
  readonly levels: Record<LevelId, LevelProgress>;
  readonly stats: ProgressStats;
  readonly firstPlayTime: TimestampMs;
  readonly lastUpdated: TimestampMs;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

/**
 * Base interface for components that handle level selection
 */
export interface LevelSelectionProps {
  readonly levels: readonly Level[];
  readonly currentLevelIndex: number;
  readonly onLevelSelect: (levelIndex: number) => void;
}

/**
 * Base interface for components that display progress
 */
export interface ProgressDisplayProps {
  readonly completedLevels: ReadonlySet<LevelId>;
  readonly failedLevels: ReadonlySet<LevelId>;
}

/**
 * Base interface for theme-aware components
 */
export interface ThemeProps {
  /** Current theme mode */
  readonly theme: ThemeMode;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Creates a branded type constructor function
 */
export type BrandedTypeConstructor<T, Brand> = (
  value: T
) => T & { readonly __brand: Brand };

/**
 * Utility type to make all properties of an interface deeply readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Utility type for partial updates to objects
 */
export type PartialUpdate<T> = Partial<
  Pick<
    T,
    {
      [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K;
    }[keyof T]
  >
>;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid LevelId
 */
export function isLevelId(value: unknown): value is LevelId {
  return typeof value === 'number' && value >= 0 && Number.isInteger(value);
}

/**
 * Type guard to check if a value is a valid TimestampMs
 */
export function isTimestampMs(value: unknown): value is TimestampMs {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
}

/**
 * Type guard to check if a value is a valid CSSProperty
 */
export function isCSSProperty(value: unknown): value is CSSProperty {
  const validProperties: CSSProperty[] = [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'flex',
    'flex-direction',
    'flex-wrap',
    'justify-content',
    'align-items',
    'align-content',
    'grid',
    'grid-template-columns',
    'grid-template-rows',
    'grid-gap',
    'grid-column',
    'grid-row',
    'text-align',
    'vertical-align',
    'line-height',
    'font-size',
    'color',
    'transform',
    'transform-origin',
    'border',
    'border-radius',
    'background',
    'background-color',
    'overflow',
    'z-index',
    'opacity',
    'visibility',
    'place-items',
    'justify-items',
    'content',
    'box-shadow',
    '*',
  ];
  return (
    typeof value === 'string' && validProperties.includes(value as CSSProperty)
  );
}
