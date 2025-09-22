import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageService } from '../services/StorageService';

describe('StorageService - Secret Level', () => {
  let storageService: ReturnType<typeof createStorageService>;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storageService = createStorageService();
  });

  it('should get and set secret level unlock status', () => {
    // Initially should be false
    expect(storageService.getSecretLevelUnlocked()).toBe(false);

    // Set to true
    storageService.setSecretLevelUnlocked(true);
    expect(storageService.getSecretLevelUnlocked()).toBe(true);

    // Set to false
    storageService.setSecretLevelUnlocked(false);
    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });

  it('should persist secret level unlock status across instances', () => {
    // Set unlock status
    storageService.setSecretLevelUnlocked(true);

    // Create new service instance
    const newService = createStorageService();
    expect(newService.getSecretLevelUnlocked()).toBe(true);
  });

  it('should handle invalid data gracefully', () => {
    // Manually set invalid data in localStorage
    localStorage.setItem('secretLevelUnlocked', 'invalid-json');

    // Should return false as default
    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });
});