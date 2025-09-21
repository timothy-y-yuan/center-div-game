/**
 * @fileoverview Application constants and configuration values
 * Centralized location for all magic numbers, strings, and configuration
 */

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * User interface related constants
 */
export const UI_CONSTANTS = {
  /** Maximum number of levels visible in dropdown before scrolling */
  DROPDOWN_MAX_VISIBLE_ITEMS: 6,

  /** Pixel tolerance for considering an element "centered" */
  COMPLETION_TOLERANCE_PX: 5,

  /** Duration for confetti animation in milliseconds */
  CONFETTI_DURATION_MS: 3000,

  /** Duration for CSS transitions in milliseconds */
  TRANSITION_DURATION_MS: 200,

  /** Maximum width for dropdowns in pixels */
  DROPDOWN_MAX_WIDTH_PX: 320,

  /** Z-index for floating elements */
  FLOATING_Z_INDEX: 10000,

  /** Number of confetti pieces to generate */
  CONFETTI_PIECE_COUNT: 50,
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * LocalStorage keys for persisting data
 */
export const STORAGE_KEYS = {
  /** Current level index */
  CURRENT_LEVEL: 'currentLevel',

  /** Completed levels array */
  COMPLETED_LEVELS: 'completedLevels',

  /** Failed levels array */
  FAILED_LEVELS: 'failedLevels',

  /** User theme preference */
  THEME: 'theme',

  /** User progress data */
  USER_PROGRESS: 'userProgress',

  /** Settings and preferences */
  SETTINGS: 'settings',
} as const;

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

/**
 * Core game mechanics configuration
 */
export const GAME_CONFIG = {
  /** Total number of levels in the game */
  TOTAL_LEVELS: 10,

  /** Starting level index (0-based) */
  STARTING_LEVEL: 0,

  /** Maximum attempts before suggesting hints */
  MAX_ATTEMPTS_BEFORE_HINT: 3,

  /** Score multiplier for completing without hints */
  NO_HINT_BONUS_MULTIPLIER: 1.5,

  /** Score penalty for revealing answers */
  ANSWER_REVEAL_PENALTY: 0.5,
} as const;

// ============================================================================
// CSS VALIDATION CONSTANTS
// ============================================================================

/**
 * CSS parsing and validation configuration
 */
export const CSS_CONSTANTS = {
  /** Regular expression for parsing CSS rules */
  CSS_RULE_REGEX: /([^{]+)\{([^}]*)\}/g,

  /** Regular expression for parsing CSS properties */
  CSS_PROPERTY_REGEX: /([^:]+):([^;]+);?/g,

  /** Regular expression for CSS comments */
  CSS_COMMENT_REGEX: /\/\*[\s\S]*?\*\//g,

  /** Characters to ignore when parsing CSS */
  WHITESPACE_CHARS: [' ', '\t', '\n', '\r'],

  /** Maximum length for CSS input */
  MAX_CSS_LENGTH: 10000,
} as const;

// ============================================================================
// EDUCATIONAL CONTENT
// ============================================================================

/**
 * Educational messaging and content
 */
export const EDUCATIONAL_CONTENT = {
  /** Player titles based on completion progress */
  PLAYER_TITLES: {
    0: '0.001x Engineer',
    1: 'Intern',
    2: 'Junior Developer',
    3: 'Developer',
    4: 'Senior Developer',
    5: 'Staff Engineer',
    6: 'Principal Engineer',
    7: 'Distinguished Engineer',
    8: 'CSS Wizard',
    9: 'CSS Master',
    10: 'CSS Grandmaster',
  },

  /** Completion messages for different achievement levels */
  COMPLETION_MESSAGES: {
    PERFECT: 'Flawless! You\'re a CSS master!',
    GOOD: 'Great job! You nailed it!',
    OKAY: 'Nice work! You got it!',
    WITH_HINTS: 'Good job! (with a little help)',
    WITH_REVEAL: 'You learned something new today!',
  },

  /** Encouragement messages for failures */
  FAILURE_MESSAGES: {
    FIRST_ATTEMPT: 'Not quite right. Try again!',
    SECOND_ATTEMPT: 'Close! Think about it differently.',
    THIRD_ATTEMPT: 'Still struggling? Try the hint!',
    MANY_ATTEMPTS: 'No worries, we all learn at our own pace.',
  },
} as const;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

/**
 * Theme and styling configuration
 */
export const THEME_CONFIG = {
  /** Available theme modes */
  THEMES: ['light', 'dark', 'system'] as const,

  /** Default theme mode */
  DEFAULT_THEME: 'system' as const,

  /** CSS class names for themes */
  THEME_CLASSES: {
    LIGHT: '',
    DARK: 'dark',
  },

  /** Media query for detecting system dark mode preference */
  DARK_MODE_MEDIA_QUERY: '(prefers-color-scheme: dark)',
} as const;

// ============================================================================
// PERFORMANCE CONSTANTS
// ============================================================================

/**
 * Performance optimization configuration
 */
export const PERFORMANCE_CONFIG = {
  /** Debounce delay for CSS validation in milliseconds */
  CSS_VALIDATION_DEBOUNCE_MS: 300,

  /** Throttle delay for window resize events in milliseconds */
  RESIZE_THROTTLE_MS: 100,

  /** Maximum number of validation messages to display */
  MAX_VALIDATION_MESSAGES: 10,

  /** Timeout for iframe content loading in milliseconds */
  IFRAME_LOAD_TIMEOUT_MS: 5000,
} as const;

// ============================================================================
// ACCESSIBILITY CONSTANTS
// ============================================================================

/**
 * Accessibility and usability configuration
 */
export const A11Y_CONFIG = {
  /** Minimum target size for clickable elements in pixels */
  MIN_TOUCH_TARGET_SIZE: 44,

  /** Focus outline width in pixels */
  FOCUS_OUTLINE_WIDTH: 2,

  /** Screen reader announcements */
  ANNOUNCEMENTS: {
    LEVEL_COMPLETED: 'Level completed successfully!',
    LEVEL_FAILED: 'Level failed. Try again.',
    HINT_OPENED: 'Hint panel opened.',
    SETTINGS_OPENED: 'Settings panel opened.',
    VALIDATION_ERROR: 'CSS validation error:',
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Standardized error messages
 */
export const ERROR_MESSAGES = {
  /** CSS validation errors */
  CSS_VALIDATION: {
    INVALID_SYNTAX: 'Invalid CSS syntax',
    PROPERTY_NOT_ALLOWED: 'This CSS property is not allowed for this selector',
    PROPERTY_LOCKED: 'This CSS property cannot be modified',
    SELECTOR_NOT_FOUND: 'CSS selector not found in allowed list',
    MISSING_REQUIRED_PROPERTY: 'Required CSS property is missing',
  },

  /** Storage errors */
  STORAGE: {
    QUOTA_EXCEEDED: 'Browser storage quota exceeded',
    ACCESS_DENIED: 'Unable to access browser storage',
    INVALID_DATA: 'Invalid data format in storage',
  },

  /** General application errors */
  APPLICATION: {
    LEVEL_NOT_FOUND: 'Requested level does not exist',
    INVALID_LEVEL_INDEX: 'Invalid level index provided',
    COMPONENT_RENDER_ERROR: 'Component failed to render',
  },
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Feature flags for enabling/disabling functionality
 */
export const FEATURE_FLAGS = {
  /** Enable advanced CSS validation features */
  ADVANCED_CSS_VALIDATION: true,

  /** Enable progress analytics tracking */
  PROGRESS_ANALYTICS: true,

  /** Enable experimental level editor */
  LEVEL_EDITOR: false,

  /** Enable performance monitoring */
  PERFORMANCE_MONITORING: false,

  /** Enable accessibility enhancements */
  ACCESSIBILITY_ENHANCEMENTS: true,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Export types for the constants to ensure type safety
export type StorageKey = keyof typeof STORAGE_KEYS;
export type ThemeMode = typeof THEME_CONFIG.THEMES[number];
export type PlayerTitle = keyof typeof EDUCATIONAL_CONTENT.PLAYER_TITLES;