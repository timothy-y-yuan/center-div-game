/**
 * @fileoverview Simple utility functions
 */

export function createValidationError(message: string): {
  message: string;
  severity: 'error';
} {
  return { message, severity: 'error' };
}
