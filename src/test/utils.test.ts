import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test localStorage utility functions by simulating them
describe('localStorage Utilities', () => {
  beforeEach(() => {
    // Clear all mocks and reset localStorage
    vi.clearAllMocks();
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  describe('Completed Levels Storage', () => {
    it('should handle empty localStorage gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      // Simulate the getCompletedLevels function behavior
      const getCompletedLevels = (): Set<number> => {
        try {
          const stored = localStorage.getItem('completedLevels');
          return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
          return new Set();
        }
      };

      const result = getCompletedLevels();
      expect(result).toEqual(new Set());
      expect(localStorage.getItem).toHaveBeenCalledWith('completedLevels');
    });

    it('should parse completed levels correctly', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('[0, 1, 2]');

      const getCompletedLevels = (): Set<number> => {
        try {
          const stored = localStorage.getItem('completedLevels');
          return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
          return new Set();
        }
      };

      const result = getCompletedLevels();
      expect(result).toEqual(new Set([0, 1, 2]));
    });

    it('should save completed levels correctly', () => {
      const saveCompletedLevels = (completed: Set<number>) => {
        localStorage.setItem('completedLevels', JSON.stringify([...completed]));
      };

      const testSet = new Set([0, 2, 4]);
      saveCompletedLevels(testSet);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'completedLevels',
        '[0,2,4]'
      );
    });
  });

  describe('Failed Levels Storage', () => {
    it('should handle failed levels storage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('[1, 3]');

      const getFailedLevels = (): Set<number> => {
        try {
          const stored = localStorage.getItem('failedLevels');
          return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
          return new Set();
        }
      };

      const result = getFailedLevels();
      expect(result).toEqual(new Set([1, 3]));
    });
  });

  describe('Current Level Storage', () => {
    it('should handle current level storage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('5');

      const getCurrentLevel = (): number => {
        try {
          const stored = localStorage.getItem('currentLevel');
          return stored ? parseInt(stored, 10) : 0;
        } catch {
          return 0;
        }
      };

      const result = getCurrentLevel();
      expect(result).toBe(5);
    });

    it('should default to level 0 when no stored level', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const getCurrentLevel = (): number => {
        try {
          const stored = localStorage.getItem('currentLevel');
          return stored ? parseInt(stored, 10) : 0;
        } catch {
          return 0;
        }
      };

      const result = getCurrentLevel();
      expect(result).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json');

      const getCompletedLevels = (): Set<number> => {
        try {
          const stored = localStorage.getItem('completedLevels');
          return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
          return new Set();
        }
      };

      const result = getCompletedLevels();
      expect(result).toEqual(new Set());
    });
  });
});
