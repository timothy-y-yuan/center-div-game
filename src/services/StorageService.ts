/**
 * @fileoverview Local storage service with type safety and error handling
 * Provides a consistent interface for persisting game data
 */

import { STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import type { LevelId, UserProgress } from '../types';
import {
  createLevelId,
  createLevelIdSet,
  levelIdSetToArray,
} from '../utils/typeHelpers';

// ============================================================================
// STORAGE ERROR CLASSES
// ============================================================================

/**
 * Base class for storage-related errors
 */
export abstract class StorageError extends Error {
  abstract readonly code: string;
}

/**
 * Error thrown when storage quota is exceeded
 */
export class StorageQuotaExceededError extends StorageError {
  readonly code = 'STORAGE_QUOTA_EXCEEDED';

  constructor() {
    super(ERROR_MESSAGES.STORAGE.QUOTA_EXCEEDED);
    this.name = 'StorageQuotaExceededError';
  }
}

/**
 * Error thrown when storage access is denied
 */
export class StorageAccessDeniedError extends StorageError {
  readonly code = 'STORAGE_ACCESS_DENIED';

  constructor() {
    super(ERROR_MESSAGES.STORAGE.ACCESS_DENIED);
    this.name = 'StorageAccessDeniedError';
  }
}

/**
 * Error thrown when stored data is invalid
 */
export class InvalidStorageDataError extends StorageError {
  readonly code = 'INVALID_STORAGE_DATA';

  constructor(key: string, reason: string) {
    super(`${ERROR_MESSAGES.STORAGE.INVALID_DATA} for key "${key}": ${reason}`);
    this.name = 'InvalidStorageDataError';
  }
}

// ============================================================================
// STORAGE SERVICE INTERFACE
// ============================================================================

/**
 * Interface for storage operations
 */
export interface IStorageService {
  getCurrentLevel(): LevelId;
  setCurrentLevel(levelId: LevelId): void;
  getCompletedLevels(): ReadonlySet<LevelId>;
  setCompletedLevels(levelIds: ReadonlySet<LevelId>): void;
  getFailedLevels(): ReadonlySet<LevelId>;
  setFailedLevels(levelIds: ReadonlySet<LevelId>): void;
  getUserProgress(): UserProgress | null;
  setUserProgress(progress: UserProgress): void;
  getSecretLevelUnlocked(): boolean;
  setSecretLevelUnlocked(unlocked: boolean): void;
  clearAllData(): void;
  isStorageAvailable(): boolean;
}

// ============================================================================
// STORAGE SERVICE IMPLEMENTATION
// ============================================================================

/**
 * Local storage service implementation with comprehensive error handling
 */
export class StorageService implements IStorageService {
  private readonly storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  /**
   * Checks if storage is available and accessible
   * @returns True if storage can be used
   */
  isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely gets an item from storage with error handling
   * @param key - Storage key
   * @returns The stored value or null if not found/invalid
   */
  private safeGetItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.warn(`Failed to read from storage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Safely sets an item in storage with error handling
   * @param key - Storage key
   * @param value - Value to store
   * @throws {StorageError} If storage operation fails
   */
  private safeSetItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'QuotaExceededError':
          case 'NS_ERROR_DOM_QUOTA_REACHED':
            throw new StorageQuotaExceededError();
          default:
            throw new StorageAccessDeniedError();
        }
      }
      throw new StorageAccessDeniedError();
    }
  }

  /**
   * Parses and validates JSON data from storage
   * @param data - Raw string data from storage
   * @param validator - Function to validate the parsed data
   * @returns Validated parsed data
   * @throws {InvalidStorageDataError} If data is invalid
   */
  private parseAndValidate<T>(
    data: string | null,
    validator: (data: unknown) => data is T,
    key: string
  ): T | null {
    if (data === null) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      if (validator(parsed)) {
        return parsed;
      }
      throw new InvalidStorageDataError(
        key,
        'Data does not match expected format'
      );
    } catch (error) {
      if (error instanceof InvalidStorageDataError) {
        throw error;
      }
      throw new InvalidStorageDataError(key, 'Invalid JSON format');
    }
  }

  // ============================================================================
  // LEVEL MANAGEMENT
  // ============================================================================

  /**
   * Gets the current level ID from storage
   * @returns Current level ID (defaults to 0 if not set)
   */
  getCurrentLevel(): LevelId {
    const data = this.safeGetItem(STORAGE_KEYS.CURRENT_LEVEL);

    if (data === null) {
      return createLevelId(0);
    }

    try {
      const levelNumber = parseInt(data, 10);
      return createLevelId(levelNumber);
    } catch {
      console.warn('Invalid current level in storage, defaulting to 0');
      return createLevelId(0);
    }
  }

  /**
   * Sets the current level ID in storage
   * @param levelId - Level ID to store
   */
  setCurrentLevel(levelId: LevelId): void {
    this.safeSetItem(STORAGE_KEYS.CURRENT_LEVEL, String(levelId));
  }

  /**
   * Gets completed level IDs from storage
   * @returns Set of completed level IDs
   */
  getCompletedLevels(): ReadonlySet<LevelId> {
    const data = this.safeGetItem(STORAGE_KEYS.COMPLETED_LEVELS);

    const validator = (data: unknown): data is number[] => {
      return (
        Array.isArray(data) &&
        data.every(
          item =>
            typeof item === 'number' && Number.isInteger(item) && item >= 0
        )
      );
    };

    try {
      const completedArray = this.parseAndValidate(
        data,
        validator,
        STORAGE_KEYS.COMPLETED_LEVELS
      );
      return completedArray ? createLevelIdSet(completedArray) : new Set();
    } catch (error) {
      console.warn('Invalid completed levels in storage:', error);
      return new Set();
    }
  }

  /**
   * Sets completed level IDs in storage
   * @param levelIds - Set of completed level IDs
   */
  setCompletedLevels(levelIds: ReadonlySet<LevelId>): void {
    const array = levelIdSetToArray(levelIds);
    this.safeSetItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(array));
  }

  /**
   * Gets failed level IDs from storage
   * @returns Set of failed level IDs
   */
  getFailedLevels(): ReadonlySet<LevelId> {
    const data = this.safeGetItem(STORAGE_KEYS.FAILED_LEVELS);

    const validator = (data: unknown): data is number[] => {
      return (
        Array.isArray(data) &&
        data.every(
          item =>
            typeof item === 'number' && Number.isInteger(item) && item >= 0
        )
      );
    };

    try {
      const failedArray = this.parseAndValidate(
        data,
        validator,
        STORAGE_KEYS.FAILED_LEVELS
      );
      return failedArray ? createLevelIdSet(failedArray) : new Set();
    } catch (error) {
      console.warn('Invalid failed levels in storage:', error);
      return new Set();
    }
  }

  /**
   * Sets failed level IDs in storage
   * @param levelIds - Set of failed level IDs
   */
  setFailedLevels(levelIds: ReadonlySet<LevelId>): void {
    const array = levelIdSetToArray(levelIds);
    this.safeSetItem(STORAGE_KEYS.FAILED_LEVELS, JSON.stringify(array));
  }

  // ============================================================================
  // USER PROGRESS MANAGEMENT
  // ============================================================================

  /**
   * Type guard for UserProgress validation
   */
  private isValidUserProgress(data: unknown): data is UserProgress {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const progress = data as Record<string, unknown>;

    // Check required properties exist and have correct types
    return (
      typeof progress.levels === 'object' &&
      typeof progress.stats === 'object' &&
      typeof progress.firstPlayTime === 'number' &&
      typeof progress.lastUpdated === 'number'
    );
  }

  /**
   * Gets comprehensive user progress from storage
   * @returns Complete user progress or null if not found
   */
  getUserProgress(): UserProgress | null {
    const data = this.safeGetItem(STORAGE_KEYS.USER_PROGRESS);

    try {
      return this.parseAndValidate(
        data,
        this.isValidUserProgress.bind(this),
        STORAGE_KEYS.USER_PROGRESS
      );
    } catch (error) {
      console.warn('Invalid user progress in storage:', error);
      return null;
    }
  }

  /**
   * Sets comprehensive user progress in storage
   * @param progress - Complete user progress data
   */
  setUserProgress(progress: UserProgress): void {
    this.safeSetItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  }

  /**
   * Gets whether the secret level has been unlocked
   * @returns Boolean indicating if secret level is unlocked
   */
  getSecretLevelUnlocked(): boolean {
    const data = this.safeGetItem(STORAGE_KEYS.SECRET_LEVEL_UNLOCKED);

    try {
      const unlocked = this.parseAndValidate(
        data,
        (data: unknown): data is boolean => typeof data === 'boolean',
        STORAGE_KEYS.SECRET_LEVEL_UNLOCKED
      );
      return unlocked ?? false;
    } catch (error) {
      console.warn('Invalid secret level unlock status in storage:', error);
      return false;
    }
  }

  /**
   * Sets whether the secret level has been unlocked
   * @param unlocked - Boolean indicating if secret level should be unlocked
   */
  setSecretLevelUnlocked(unlocked: boolean): void {
    this.safeSetItem(
      STORAGE_KEYS.SECRET_LEVEL_UNLOCKED,
      JSON.stringify(unlocked)
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Clears all game data from storage
   */
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear storage data:', error);
    }
  }

  /**
   * Gets the size of stored data in bytes (approximate)
   * @returns Estimated storage size in bytes
   */
  getStorageSize(): number {
    let totalSize = 0;

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = this.storage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      });
    } catch {
      // If we can't read storage, return 0
      totalSize = 0;
    }

    return totalSize;
  }

  /**
   * Exports all game data as a JSON string for backup
   * @returns JSON string containing all game data
   */
  exportData(): string {
    const exportData: Record<string, string | null> = {};

    Object.values(STORAGE_KEYS).forEach(key => {
      exportData[key] = this.safeGetItem(key);
    });

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Imports game data from a JSON string
   * @param jsonData - JSON string containing game data
   * @throws {InvalidStorageDataError} If the data format is invalid
   */
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData) as Record<string, string | null>;

      // Validate that all required keys exist
      const requiredKeys = Object.values(STORAGE_KEYS);
      const hasAllKeys = requiredKeys.every(key => key in data);

      if (!hasAllKeys) {
        throw new InvalidStorageDataError(
          'import',
          'Missing required data keys'
        );
      }

      // Import each piece of data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          this.safeSetItem(key, value);
        }
      });
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new InvalidStorageDataError('import', 'Invalid JSON format');
    }
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

/**
 * Creates a storage service instance with error handling
 * @param storage - Storage implementation to use (defaults to localStorage)
 * @returns Storage service instance or mock service if storage unavailable
 */
export function createStorageService(
  storage: Storage = localStorage
): IStorageService {
  const service = new StorageService(storage);

  if (!service.isStorageAvailable()) {
    console.warn('Local storage is not available, using mock storage service');
    return createMockStorageService();
  }

  return service;
}

/**
 * Creates a mock storage service for environments where localStorage is unavailable
 * @returns Mock storage service that stores data in memory
 */
export function createMockStorageService(): IStorageService {
  const data = new Map<string, string>();

  return {
    getCurrentLevel: () => createLevelId(0),
    setCurrentLevel: () => {
      /* no-op */
    },
    getCompletedLevels: () => new Set(),
    setCompletedLevels: () => {
      /* no-op */
    },
    getFailedLevels: () => new Set(),
    setFailedLevels: () => {
      /* no-op */
    },
    getUserProgress: () => null,
    setUserProgress: () => {
      /* no-op */
    },
    getSecretLevelUnlocked: () => false,
    setSecretLevelUnlocked: () => {
      /* no-op */
    },
    clearAllData: () => {
      data.clear();
    },
    isStorageAvailable: () => false,
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Default storage service instance
 */
export const storageService = createStorageService();
