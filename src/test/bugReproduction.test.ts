/**
 * @fileoverview Simple test to demonstrate the bug that was fixed
 * This test would have failed before the fix and passes after
 */

import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';
import { validateUserCSS } from '../utils/cssValidator';

describe('Bug Reproduction Test', () => {
  it('should demonstrate the bug that was fixed - Level 1 rejecting margin property', () => {
    const level1 = levels[0]; // Level 1: Baby's First Center

    // Before the fix: This CSS would be rejected because allowedProperties: []
    // was interpreted as "allow no properties" instead of "allow any properties"
    const userCSS = '.target { margin: 0 auto; }';

    const result = validateUserCSS(userCSS, level1);

    // This assertion would have FAILED before the fix
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);

    // Verify this is actually the expected solution for level 1
    expect(level1.solutionCSS.trim()).toContain('margin: 0 auto');
  });

  it('should verify that the obvious solution works for each beginner level', () => {
    const testCases = [
      {
        level: 0,
        css: '.target { margin: 0 auto; }',
        description: 'Level 1 - margin centering',
      },
      {
        level: 1,
        css: '.container { display: flex; justify-content: center; align-items: center; }',
        description: 'Level 2 - flexbox centering',
      },
      {
        level: 2,
        css: '.container { display: grid; place-items: center; }',
        description: 'Level 3 - grid centering',
      },
    ];

    testCases.forEach(({ level: levelIndex, css, description }) => {
      const level = levels[levelIndex];
      const result = validateUserCSS(css, level);

      if (!result.isValid) {
        console.error(`${description} failed validation:`, result.errors);
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
