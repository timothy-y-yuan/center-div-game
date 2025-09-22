/**
 * @fileoverview Type helper functions and branded type constructors
 * Provides safe constructors for branded types and validation utilities
 */

import type {
  LevelId,
  TimestampMs,
  DurationMs,
  ValidationMessage,
  ValidationSeverity,
  CSSProperty,
} from '../types';

// ============================================================================
// BRANDED TYPE CONSTRUCTORS
// ============================================================================

/**
 * Creates a LevelId from a number with validation
 * @param value - The numeric value to convert
 * @returns A validated LevelId
 * @throws {Error} If the value is not a valid level ID
 */
export function createLevelId(value: number): LevelId {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      `Invalid level ID: ${value}. Must be a non-negative integer.`
    );
  }
  return value as LevelId;
}

/**
 * Creates a TimestampMs from a number with validation
 * @param value - The timestamp value in milliseconds
 * @returns A validated TimestampMs
 * @throws {Error} If the value is not a valid timestamp
 */
export function createTimestampMs(value: number = Date.now()): TimestampMs {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid timestamp: ${value}. Must be a positive integer.`);
  }
  return value as TimestampMs;
}

/**
 * Creates a DurationMs from a number with validation
 * @param value - The duration value in milliseconds
 * @returns A validated DurationMs
 * @throws {Error} If the value is not a valid duration
 */
export function createDurationMs(value: number): DurationMs {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      `Invalid duration: ${value}. Must be a non-negative integer.`
    );
  }
  return value as DurationMs;
}

// ============================================================================
// VALIDATION MESSAGE HELPERS
// ============================================================================

/**
 * Creates a validation error message
 * @param message - The error message text
 * @param options - Additional context for the error
 * @returns A formatted ValidationMessage
 */
export function createValidationError(
  message: string,
  options: {
    selector?: string;
    property?: string;
    line?: number;
  } = {}
): ValidationMessage {
  return {
    message,
    severity: 'error' as ValidationSeverity,
    selector: options.selector,
    property: options.property as CSSProperty | undefined,
    line: options.line,
  };
}

/**
 * Creates a validation warning message
 * @param message - The warning message text
 * @param options - Additional context for the warning
 * @returns A formatted ValidationMessage
 */
export function createValidationWarning(
  message: string,
  options: {
    selector?: string;
    property?: string;
    line?: number;
  } = {}
): ValidationMessage {
  return {
    message,
    severity: 'warning' as ValidationSeverity,
    selector: options.selector,
    property: options.property as CSSProperty | undefined,
    line: options.line,
  };
}

/**
 * Creates a validation info message
 * @param message - The info message text
 * @param options - Additional context for the info
 * @returns A formatted ValidationMessage
 */
export function createValidationInfo(
  message: string,
  options: {
    selector?: string;
    property?: string;
    line?: number;
  } = {}
): ValidationMessage {
  return {
    message,
    severity: 'info' as ValidationSeverity,
    selector: options.selector,
    property: options.property as CSSProperty | undefined,
    line: options.line,
  };
}

// ============================================================================
// COLLECTION HELPERS
// ============================================================================

/**
 * Safely converts a numeric array to a Set of LevelIds
 * @param values - Array of numbers to convert
 * @returns A Set of validated LevelIds
 */
export function createLevelIdSet(
  values: readonly number[]
): ReadonlySet<LevelId> {
  const validatedIds = values.map(createLevelId);
  return new Set(validatedIds);
}

/**
 * Safely converts a Set of LevelIds to a numeric array
 * @param levelIds - Set of LevelIds to convert
 * @returns Array of numbers
 */
export function levelIdSetToArray(
  levelIds: ReadonlySet<LevelId>
): readonly number[] {
  return Array.from(levelIds).map(id => id as number);
}

// ============================================================================
// TIME HELPERS
// ============================================================================

/**
 * Calculates the duration between two timestamps
 * @param start - Start timestamp
 * @param end - End timestamp
 * @returns Duration in milliseconds
 */
export function calculateDuration(
  start: TimestampMs,
  end: TimestampMs
): DurationMs {
  const durationValue = (end as number) - (start as number);
  return createDurationMs(Math.max(0, durationValue));
}

/**
 * Formats a duration for human-readable display
 * @param duration - Duration in milliseconds
 * @returns Formatted string (e.g., "1m 30s", "45s")
 */
export function formatDuration(duration: DurationMs): string {
  const totalSeconds = Math.floor((duration as number) / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Formats a timestamp for human-readable display
 * @param timestamp - Timestamp in milliseconds
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: TimestampMs,
  options: {
    includeTime?: boolean;
    format?: 'short' | 'medium' | 'long';
  } = {}
): string {
  const date = new Date(timestamp as number);

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: options.format === 'short' ? 'numeric' : 'short',
    day: 'numeric',
  };

  if (options.includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
  }

  return date.toLocaleDateString(undefined, formatOptions);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates that a value is a non-empty string
 * @param value - Value to validate
 * @param fieldName - Name of the field for error messages
 * @returns The validated string
 * @throws {Error} If validation fails
 */
export function validateNonEmptyString(
  value: unknown,
  fieldName: string
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}

/**
 * Validates that a value is within a numeric range
 * @param value - Value to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @param fieldName - Name of the field for error messages
 * @returns The validated number
 * @throws {Error} If validation fails
 */
export function validateNumberRange(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number`);
  }

  if (value < min || value > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max}, got ${value}`
    );
  }

  return value;
}

/**
 * Validates that an array contains only unique values
 * @param array - Array to validate
 * @param fieldName - Name of the field for error messages
 * @returns The validated array
 * @throws {Error} If the array contains duplicates
 */
export function validateUniqueArray<T>(
  array: readonly T[],
  fieldName: string
): readonly T[] {
  const seen = new Set<T>();
  const duplicates: T[] = [];

  for (const item of array) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }

  if (duplicates.length > 0) {
    throw new Error(
      `${fieldName} contains duplicate values: ${duplicates.join(', ')}`
    );
  }

  return array;
}

// ============================================================================
// DEEP EQUALITY HELPERS
// ============================================================================

/**
 * Performs a deep equality check on two values
 * @param a - First value
 * @param b - Second value
 * @returns True if values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== 'object') {
    return a === b;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  if (Array.isArray(a)) {
    const arrayA = a as unknown[];
    const arrayB = b as unknown[];

    if (arrayA.length !== arrayB.length) {
      return false;
    }

    return arrayA.every((item, index) => deepEqual(item, arrayB[index]));
  }

  const objectA = a as Record<string, unknown>;
  const objectB = b as Record<string, unknown>;

  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(
    key => keysB.includes(key) && deepEqual(objectA[key], objectB[key])
  );
}

/**
 * Creates a shallow copy of an object with selected properties
 * @param source - Source object
 * @param keys - Keys to include in the copy
 * @returns New object with selected properties
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Creates a shallow copy of an object excluding selected properties
 * @param source - Source object
 * @param keys - Keys to exclude from the copy
 * @returns New object without excluded properties
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...source };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}
