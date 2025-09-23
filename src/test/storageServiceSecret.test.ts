import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/StorageService';

describe('StorageService - Secret Level', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should get and set secret level unlock status', () => {
    expect(storageService.getSecretLevelUnlocked()).toBe(false);

    storageService.setSecretLevelUnlocked(true);
    expect(storageService.getSecretLevelUnlocked()).toBe(true);

    storageService.setSecretLevelUnlocked(false);
    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });

  it('should persist secret level unlock status across operations', () => {
    storageService.setSecretLevelUnlocked(true);
    expect(storageService.getSecretLevelUnlocked()).toBe(true);

    storageService.setSecretLevelUnlocked(false);
    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });

  it('should handle invalid data gracefully', () => {
    localStorage.setItem('secretLevelUnlocked', 'invalid-json');

    expect(storageService.getSecretLevelUnlocked()).toBe(false);
  });
});
