import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageService } from '../services/StorageService';

describe('StorageService - Secret Level', () => {
  let storageService: ReturnType<typeof createStorageService>;

  beforeEach(() => {
    localStorage.clear();
    storageService = createStorageService();
  });

  it('should get and set secret level unlock status', () => {
    expect(storageService.getSecretLevelUnlocked()).toBe(false);

    storageService.setSecretLevelUnlocked(true);
    expect(storageService.getSecretLevelUnlocked()).toBe(true);

    storageService.setSecretLevelUnlocked(false);
    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });

  it('should persist secret level unlock status across instances', () => {
    storageService.setSecretLevelUnlocked(true);

    const newService = createStorageService();
    expect(newService.getSecretLevelUnlocked()).toBe(true);
  });

  it('should handle invalid data gracefully', () => {
    localStorage.setItem('secretLevelUnlocked', 'invalid-json');

    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });
});