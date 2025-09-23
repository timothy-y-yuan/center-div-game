/**
 * @fileoverview Simple localStorage wrapper
 */

const STORAGE_KEYS = {
  CURRENT_LEVEL: 'currentLevel',
  COMPLETED_LEVELS: 'completedLevels',
  FAILED_LEVELS: 'failedLevels',
  SECRET_LEVEL_UNLOCKED: 'secretLevelUnlocked',
};

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export const storageService = {
  getCurrentLevel(): number {
    return parseInt(
      localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) || '0',
      10
    );
  },

  setCurrentLevel(level: number): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, String(level));
  },

  getCompletedLevels(): Set<number> {
    const data = safeJsonParse(
      localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS),
      []
    );
    return new Set(data);
  },

  setCompletedLevels(levels: Set<number>): void {
    localStorage.setItem(
      STORAGE_KEYS.COMPLETED_LEVELS,
      JSON.stringify([...levels])
    );
  },

  getFailedLevels(): Set<number> {
    const data = safeJsonParse(
      localStorage.getItem(STORAGE_KEYS.FAILED_LEVELS),
      []
    );
    return new Set(data);
  },

  setFailedLevels(levels: Set<number>): void {
    localStorage.setItem(
      STORAGE_KEYS.FAILED_LEVELS,
      JSON.stringify([...levels])
    );
  },

  getSecretLevelUnlocked(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SECRET_LEVEL_UNLOCKED) === 'true';
  },

  setSecretLevelUnlocked(unlocked: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SECRET_LEVEL_UNLOCKED, String(unlocked));
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
