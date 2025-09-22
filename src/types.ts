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
  | 'margin' | 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'
  | 'padding' | 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'
  | 'display' | 'position' | 'top' | 'right' | 'bottom' | 'left'
  | 'width' | 'height' | 'max-width' | 'max-height' | 'min-width' | 'min-height'
  | 'flex' | 'flex-direction' | 'flex-wrap' | 'justify-content' | 'align-items' | 'align-content'
  | 'grid' | 'grid-template-columns' | 'grid-template-rows' | 'grid-gap' | 'grid-column' | 'grid-row'
  | 'text-align' | 'vertical-align' | 'line-height' | 'font-size' | 'color'
  | 'transform' | 'transform-origin'
  | 'border' | 'border-radius' | 'background' | 'background-color'
  | 'overflow' | 'z-index' | 'opacity' | 'visibility'
  | 'place-items' | 'justify-items' | 'content' | 'box-shadow'
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
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// ============================================================================
// LEVEL DEFINITION INTERFACES
// ============================================================================

/**
 * Configuration for what CSS properties can be edited on a specific selector
 */
export interface EditableSelector {
  /** CSS properties that cannot be changed or removed by the user */
  readonly lockedProperties: readonly CSSProperty[];

  /** CSS properties that the user is allowed to add or modify */
  readonly allowedProperties: readonly CSSProperty[];

  /** Initial CSS properties for this selector that the user can edit */
  readonly initialEditableCSS: string;

  /** Optional hint about what this selector is meant to accomplish */
  readonly hint?: string;
}

/**
 * Complete level definition with educational content and constraints
 */
export interface Level {
  /** Unique identifier for this level */
  readonly id: LevelId;

  /** Display title of the level */
  readonly title: string;

  /** Educational description explaining the goal */
  readonly description: string;

  /** Initial HTML structure for the level */
  readonly initialHTML: string;

  /** CSS that cannot be modified by the user (provides base styling) */
  readonly lockedCSS: string;

  /** Selectors and their editing constraints */
  readonly editableSelectors: Record<CSSSelector, EditableSelector>;

  /** Human-readable explanation of editing constraints */
  readonly constraints: string;

  /** Hint text to help users when they're stuck */
  readonly hint: string;

  /** Example solution CSS for reference */
  readonly solutionCSS: string;

  /** Educational explanation of the solution approach */
  readonly explanation: string;

  /** Difficulty level for educational progression */
  readonly difficulty: DifficultyLevel;

  /** Tags for categorizing learning concepts */
  readonly tags: readonly string[];
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
  /** The validation message text */
  readonly message: string;

  /** Severity level of this message */
  readonly severity: ValidationSeverity;

  /** CSS selector this message relates to (if applicable) */
  readonly selector?: CSSSelector;

  /** Specific CSS property this message relates to (if applicable) */
  readonly property?: CSSProperty;

  /** Line number in the CSS where the issue occurs (if applicable) */
  readonly line?: number;
}

/**
 * Complete result of CSS validation against level constraints
 */
export interface CSSValidationResult {
  /** Whether the CSS meets all requirements and constraints */
  readonly isValid: boolean;

  /** Error messages that prevent the CSS from being valid */
  readonly errors: readonly ValidationMessage[];

  /** Warning messages for potential issues */
  readonly warnings: readonly ValidationMessage[];

  /** Informational messages for educational feedback */
  readonly info: readonly ValidationMessage[];
}

// ============================================================================
// PROGRESS TRACKING INTERFACES
// ============================================================================

/**
 * Progress tracking for a single level
 */
export interface LevelProgress {
  /** Whether the level has been successfully completed */
  readonly completed: boolean;

  /** Total number of attempts made on this level */
  readonly attempts: number;

  /** Time taken to complete the level, null if not completed */
  readonly completionTime: DurationMs | null;

  /** Timestamp when the level was first attempted */
  readonly firstAttemptTime: TimestampMs;

  /** Timestamp when the level was completed, null if not completed */
  readonly completedTime: TimestampMs | null;

  /** Whether hints were used during completion */
  readonly hintsUsed: boolean;

  /** The user's successful CSS solution (if completed) */
  readonly successfulSolution: string | null;

  /** Number of times the user asked for the answer */
  readonly answersRevealed: number;
}

/**
 * Overall statistics for user progress
 */
export interface ProgressStats {
  /** Total number of levels completed successfully */
  readonly totalLevelsCompleted: number;

  /** Total time spent playing (in milliseconds) */
  readonly totalPlayTime: DurationMs;

  /** Average time to complete a level (in milliseconds) */
  readonly averageCompletionTime: DurationMs;

  /** Total number of attempts across all levels */
  readonly totalAttempts: number;

  /** Total number of hints used */
  readonly totalHintsUsed: number;

  /** Total number of answers revealed */
  readonly totalAnswersRevealed: number;
}

/**
 * Complete user progress tracking
 */
export interface UserProgress {
  /** Progress data for each level, keyed by level ID */
  readonly levels: Record<LevelId, LevelProgress>;

  /** Overall gameplay statistics */
  readonly stats: ProgressStats;

  /** Timestamp when the user first started playing */
  readonly firstPlayTime: TimestampMs;

  /** Timestamp of the last progress update */
  readonly lastUpdated: TimestampMs;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

/**
 * Base interface for components that handle level selection
 */
export interface LevelSelectionProps {
  /** Array of all available levels */
  readonly levels: readonly Level[];

  /** Currently selected level index */
  readonly currentLevelIndex: number;

  /** Callback when a new level is selected */
  readonly onLevelSelect: (levelIndex: number) => void;
}

/**
 * Base interface for components that display progress
 */
export interface ProgressDisplayProps {
  /** Set of completed level IDs */
  readonly completedLevels: ReadonlySet<LevelId>;

  /** Set of failed level IDs */
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
export type BrandedTypeConstructor<T, Brand> = (value: T) => T & { readonly __brand: Brand };

/**
 * Utility type to make all properties of an interface deeply readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Utility type for partial updates to objects
 */
export type PartialUpdate<T> = Partial<Pick<T, {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K;
}[keyof T]>>;

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
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'display', 'position', 'top', 'right', 'bottom', 'left',
    'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
    'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content',
    'grid', 'grid-template-columns', 'grid-template-rows', 'grid-gap', 'grid-column', 'grid-row',
    'text-align', 'vertical-align', 'line-height', 'font-size', 'color',
    'transform', 'transform-origin',
    'border', 'border-radius', 'background', 'background-color',
    'overflow', 'z-index', 'opacity', 'visibility',
    'place-items', 'justify-items', 'content', 'box-shadow',
    '*'
  ];
  return typeof value === 'string' && validProperties.includes(value as CSSProperty);
}