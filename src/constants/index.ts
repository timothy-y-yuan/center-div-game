/**
 * @fileoverview Application constants and configuration values
 * Centralized location for all magic numbers, strings, and configuration
 */

// UI CONSTANTS

/**
 * User interface related constants
 */
export const UI_CONSTANTS = {
  DROPDOWN_MAX_VISIBLE_ITEMS: 6,
  COMPLETION_TOLERANCE_PX: 5,
  CONFETTI_DURATION_MS: 3000,
  TRANSITION_DURATION_MS: 200,
  DROPDOWN_MAX_WIDTH_PX: 320,
  FLOATING_Z_INDEX: 10000,
  CONFETTI_PIECE_COUNT: 50,
} as const;

// STORAGE KEYS

/**
 * LocalStorage keys for persisting data
 */
export const STORAGE_KEYS = {
  CURRENT_LEVEL: 'currentLevel',
  COMPLETED_LEVELS: 'completedLevels',
  FAILED_LEVELS: 'failedLevels',
  THEME: 'theme',
  USER_PROGRESS: 'userProgress',
  SETTINGS: 'settings',
} as const;

// GAME CONFIGURATION

/**
 * Core game mechanics configuration
 */
export const GAME_CONFIG = {
  TOTAL_LEVELS: 10,
  STARTING_LEVEL: 0,
  MAX_ATTEMPTS_BEFORE_HINT: 3,
  NO_HINT_BONUS_MULTIPLIER: 1.5,
  ANSWER_REVEAL_PENALTY: 0.5,
} as const;

// CSS VALIDATION CONSTANTS

/**
 * CSS parsing and validation configuration
 */
export const CSS_CONSTANTS = {
  CSS_RULE_REGEX: /([^{]+)\{([^}]*)\}/g,
  CSS_PROPERTY_REGEX: /([^:]+):([^;]+);?/g,
  CSS_COMMENT_REGEX: /\/\*[\s\S]*?\*\//g,
  WHITESPACE_CHARS: [' ', '\t', '\n', '\r'],
  MAX_CSS_LENGTH: 10000,
} as const;

// EDUCATIONAL CONTENT

/**
 * Educational messaging and content
 */
export const EDUCATIONAL_CONTENT = {
  PLAYER_TITLES: {
    0: '0.001x Engineer',
    1: 'Copy-Paste Padawan',
    2: 'Stack Overflow Scholar',
    3: '!important Abuser',
    4: 'Flexbox Whisperer',
    5: 'CSS Semicolon Slayer',
    6: 'Bootstrap Escapee',
    7: 'Grid Master Race',
    8: 'Layout Wizard Lord',
    9: 'CSS Chaos Architect',
    10: 'CSS Überwizardninjamaster',
  },

  COMPLETION_MESSAGES: {
    PERFECT: "Flawless! You're a CSS master!",
    GOOD: 'Great job! You nailed it!',
    OKAY: 'Nice work! You got it!',
    WITH_HINTS: 'Good job! (with a little help)',
    WITH_REVEAL: 'You learned something new today!',
  },

  FAILURE_MESSAGES: {
    FIRST_ATTEMPT: 'Not quite right. Try again!',
    SECOND_ATTEMPT: 'Close! Think about it differently.',
    THIRD_ATTEMPT: 'Still struggling? Try the hint!',
    MANY_ATTEMPTS: 'No worries, we all learn at our own pace.',
  },
} as const;

// THEME CONFIGURATION

/**
 * Theme and styling configuration
 */
export const THEME_CONFIG = {
  THEMES: ['light', 'dark', 'system'] as const,
  DEFAULT_THEME: 'system' as const,
  THEME_CLASSES: {
    LIGHT: '',
    DARK: 'dark',
  },
  DARK_MODE_MEDIA_QUERY: '(prefers-color-scheme: dark)',
} as const;

// PERFORMANCE CONSTANTS

/**
 * Performance optimization configuration
 */
export const PERFORMANCE_CONFIG = {
  CSS_VALIDATION_DEBOUNCE_MS: 300,
  RESIZE_THROTTLE_MS: 100,
  MAX_VALIDATION_MESSAGES: 10,
  IFRAME_LOAD_TIMEOUT_MS: 5000,
} as const;

// ACCESSIBILITY CONSTANTS

/**
 * Accessibility and usability configuration
 */
export const A11Y_CONFIG = {
  MIN_TOUCH_TARGET_SIZE: 44,
  FOCUS_OUTLINE_WIDTH: 2,
  ANNOUNCEMENTS: {
    LEVEL_COMPLETED: 'Level completed successfully!',
    LEVEL_FAILED: 'Level failed. Try again.',
    HINT_OPENED: 'Hint panel opened.',
    SETTINGS_OPENED: 'Settings panel opened.',
    VALIDATION_ERROR: 'CSS validation error:',
  },
} as const;

// ERROR MESSAGES

/**
 * Standardized error messages
 */
export const ERROR_MESSAGES = {
  CSS_VALIDATION: {
    INVALID_SYNTAX: 'Invalid CSS syntax',
    PROPERTY_NOT_ALLOWED: 'This CSS property is not allowed for this selector',
    PROPERTY_LOCKED: 'This CSS property cannot be modified',
    SELECTOR_NOT_FOUND: 'CSS selector not found in allowed list',
    MISSING_REQUIRED_PROPERTY: 'Required CSS property is missing',
  },

  STORAGE: {
    QUOTA_EXCEEDED: 'Browser storage quota exceeded',
    ACCESS_DENIED: 'Unable to access browser storage',
    INVALID_DATA: 'Invalid data format in storage',
  },

  APPLICATION: {
    LEVEL_NOT_FOUND: 'Requested level does not exist',
    INVALID_LEVEL_INDEX: 'Invalid level index provided',
    COMPONENT_RENDER_ERROR: 'Component failed to render',
  },
} as const;

// FEATURE FLAGS

/**
 * Feature flags for enabling/disabling functionality
 */
export const FEATURE_FLAGS = {
  ADVANCED_CSS_VALIDATION: true,
  PROGRESS_ANALYTICS: true,
  LEVEL_EDITOR: false,
  PERFORMANCE_MONITORING: false,
  ACCESSIBILITY_ENHANCEMENTS: true,
} as const;

// TYPE EXPORTS

// Export types for the constants to ensure type safety
export type StorageKey = keyof typeof STORAGE_KEYS;
export type ThemeMode = (typeof THEME_CONFIG.THEMES)[number];
export type PlayerTitle = keyof typeof EDUCATIONAL_CONTENT.PLAYER_TITLES;
