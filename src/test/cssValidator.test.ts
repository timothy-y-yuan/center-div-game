import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';
import type { Level } from '../types';
import {
  generateCompleteCSS,
  getInitialEditableCSS,
  parseCSS,
  validateUserCSS,
} from '../utils/cssValidator';

describe('CSS Validator Utilities', () => {
  const level = levels[0];

  describe('parseCSS', () => {
    it('should parse simple CSS correctly', () => {
      const css = `.test { color: red; font-size: 14px; }`;
      const result = parseCSS(css);

      expect(result).toEqual({
        '.test': {
          color: 'red',
          'font-size': '14px',
        },
      });
    });

    it('should handle multiple selectors', () => {
      const css = `.test { color: red; } .other { margin: 10px; }`;
      const result = parseCSS(css);

      expect(result).toEqual({
        '.test': { color: 'red' },
        '.other': { margin: '10px' },
      });
    });

    it('should handle whitespace and comments', () => {
      const css = `
        /* Comment */
        .test {
          color: red;
          margin: 0 auto;
        }
      `;
      const result = parseCSS(css);

      expect(result).toEqual({
        '.test': {
          color: 'red',
          margin: '0 auto',
        },
      });
    });
  });

  describe('validateUserCSS', () => {
    it('should validate allowed properties', () => {
      const userCSS = '.target { margin: 0 auto; }';
      const result = validateUserCSS(userCSS, level);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject locked properties', () => {
      const userCSS = '.target { width: 100px; }';
      const result = validateUserCSS(userCSS, level);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          error =>
            error.message ===
            'Property "width" in ".target" cannot be modified.'
        )
      ).toBe(true);
    });

    it('should reject unknown selectors', () => {
      const userCSS = '.unknown { color: blue; }';
      const result = validateUserCSS(userCSS, level);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          error =>
            error.message ===
            'Selector ".unknown" is not allowed to be modified in this level.'
        )
      ).toBe(true);
    });
  });

  describe('generateCompleteCSS', () => {
    it('should combine locked CSS with user editable CSS', () => {
      const userCSS = '.target { margin: 0 auto; }';
      const result = generateCompleteCSS(userCSS, level);

      expect(result).toContain(level.lockedCSS);
      expect(result).toContain('margin: 0 auto');
    });

    it('should handle empty user CSS', () => {
      const userCSS = '';
      const result = generateCompleteCSS(userCSS, level);

      expect(result).toContain(level.lockedCSS);
    });
  });

  describe('getInitialEditableCSS', () => {
    it('should return initial editable CSS for level', () => {
      const result = getInitialEditableCSS(level);

      expect(result).toContain('.target {');
      expect(result).toContain('/* come on. just center me. */');
    });

    it('should handle multiple editable selectors', () => {
      const levelWithMultiple: Level = levels[3];
      const result = getInitialEditableCSS(levelWithMultiple);

      expect(result).toContain('.container {');
      expect(result).toContain('.target {');
      expect(result).toContain(
        '/* i just want my child to be happy and centered */'
      );
      expect(result).toContain('/* come on. just center me. */');
    });
  });
});
