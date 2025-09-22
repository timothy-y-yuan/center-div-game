/**
 * @fileoverview Integration tests for complete gameplay workflow
 * Tests the actual user experience of playing the game from start to finish
 * These tests would have caught the allowedProperties validation bug
 */

import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';
import type { EditableSelector, Level } from '../types';
import { validateUserCSS } from '../utils/cssValidator';

describe('Gameplay Integration Tests', () => {
  describe('Complete Level Playthrough', () => {
    levels.forEach((level, index) => {
      describe(`Level ${index + 1}: ${level.title}`, () => {
        it('should accept the provided solution CSS', () => {
          const result = validateUserCSS(level.solutionCSS, level);

          if (!result.isValid) {
            console.error(`Level ${index + 1} solution failed validation:`, {
              errors: result.errors,
              warnings: result.warnings,
              solutionCSS: level.solutionCSS,
              level: level.title,
            });
          }

          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });

        it('should allow reasonable variations of the solution', () => {
          // Test common variations that users might try
          const variations = getCommonVariations(level, index + 1);

          variations.forEach((variation, varIndex) => {
            const result = validateUserCSS(variation.css, level);

            if (!result.isValid && variation.shouldPass) {
              console.error(
                `Level ${index + 1} variation ${varIndex + 1} failed:`,
                {
                  variation: variation.description,
                  css: variation.css,
                  errors: result.errors,
                }
              );
            }

            if (variation.shouldPass) {
              expect(result.isValid).toBe(true);
            }
          });
        });

        it('should reject invalid attempts appropriately', () => {
          const invalidAttempts = getInvalidAttempts(level);

          invalidAttempts.forEach(attempt => {
            const result = validateUserCSS(attempt.css, level);

            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          });
        });

        // Critical test that would have caught the allowedProperties bug
        if (hasEmptyAllowedProperties(level)) {
          it('should allow any CSS property when allowedProperties is empty array', () => {
            const commonProperties = [
              '.target { margin: 0 auto; }',
              '.target { padding: 10px; }',
              '.target { color: red; }',
              '.target { transform: translateX(50px); }',
              '.container { display: flex; }',
              '.container { position: relative; }',
            ];

            commonProperties.forEach(css => {
              const result = validateUserCSS(css, level);

              if (!result.isValid) {
                console.error(
                  `Level ${index + 1} rejected valid CSS when allowedProperties is empty:`,
                  {
                    css,
                    errors: result.errors,
                    levelTitle: level.title,
                  }
                );
              }

              expect(result.isValid).toBe(true);
            });
          });
        }
      });
    });
  });

  describe('Progressive Difficulty', () => {
    it('should have solutions that work with real CSS validation', () => {
      // Test that all solutions are actually valid CSS that achieves centering
      levels.forEach(level => {
        const result = validateUserCSS(level.solutionCSS, level);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should allow users to progress through levels sequentially', () => {
      // Simulate a user playing through levels 1-3
      const userJourney = [
        { level: 0, userCSS: '.target { margin: 0 auto; }' },
        {
          level: 1,
          userCSS:
            '.container { display: flex; justify-content: center; align-items: center; }',
        },
        {
          level: 2,
          userCSS: '.container { display: grid; place-items: center; }',
        },
      ];

      userJourney.forEach(({ level: levelIndex, userCSS }) => {
        const level = levels[levelIndex];
        const result = validateUserCSS(userCSS, level);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Constraint Validation', () => {
    it('should properly enforce locked properties across all levels', () => {
      levels.forEach(level => {
        Object.entries(level.editableSelectors).forEach(
          ([selector, config]) => {
            config.lockedProperties.forEach(lockedProp => {
              const invalidCSS = `${selector} { ${lockedProp}: different-value; }`;
              const result = validateUserCSS(invalidCSS, level);

              expect(result.isValid).toBe(false);
              expect(
                result.errors.some(
                  error =>
                    error.message.includes(lockedProp) &&
                    error.message.includes('cannot be modified')
                )
              ).toBe(true);
            });
          }
        );
      });
    });

    it('should allow all properties when wildcard is specified', () => {
      const wildcardLevels = levels.filter(level =>
        Object.values(level.editableSelectors).some(config =>
          config.allowedProperties.includes('*')
        )
      );

      wildcardLevels.forEach(level => {
        // Find a selector that has wildcard permissions
        const wildcardSelector = Object.keys(level.editableSelectors).find(
          selector =>
            level.editableSelectors[selector].allowedProperties.includes('*')
        );

        if (wildcardSelector) {
          const testCSS = `${wildcardSelector} { margin: 10px; padding: 5px; color: blue; transform: rotate(45deg); }`;
          const result = validateUserCSS(testCSS, level);

          if (!result.isValid) {
            console.error(`Wildcard level failed:`, {
              level: level.title,
              selector: wildcardSelector,
              css: testCSS,
              errors: result.errors,
              allowedProperties:
                level.editableSelectors[wildcardSelector].allowedProperties,
            });
          }

          expect(result.isValid).toBe(true);
        }
      });
    });
  });

  describe('Real User Scenarios', () => {
    it('should handle the most obvious solution for Level 1', () => {
      // This is the test that would have caught the bug!
      const level1 = levels[0];
      const obviousSolution = '.target { margin: 0 auto; }';

      const result = validateUserCSS(obviousSolution, level1);

      if (!result.isValid) {
        console.error('Level 1 rejected the most obvious solution!', {
          css: obviousSolution,
          errors: result.errors,
          allowedProperties:
            level1.editableSelectors['.target']?.allowedProperties,
        });
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle progressive learning curve', () => {
      // Test that beginners can progress naturally
      const beginnerAttempts = [
        {
          level: 0,
          css: '.target { margin: 0 auto; }',
          description: 'Basic margin auto',
        },
        {
          level: 0,
          css: '.target { margin-left: auto; margin-right: auto; }',
          description: 'Explicit left/right auto',
        },
        {
          level: 1,
          css: '.container { display: flex; justify-content: center; align-items: center; }',
          description: 'Standard flexbox',
        },
        {
          level: 2,
          css: '.container { display: grid; place-items: center; }',
          description: 'Grid place-items',
        },
      ];

      beginnerAttempts.forEach(({ level: levelIndex, css }) => {
        const level = levels[levelIndex];
        const result = validateUserCSS(css, level);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });
});

/**
 * Generate common variations users might try for each level
 */
function getCommonVariations(
  _level: Level,
  levelNumber: number
): Array<{ css: string; description: string; shouldPass: boolean }> {
  const variations: Array<{
    css: string;
    description: string;
    shouldPass: boolean;
  }> = [];

  switch (levelNumber) {
    case 1:
      variations.push(
        {
          css: '.target { margin-left: auto; margin-right: auto; }',
          description: 'Explicit left/right auto margins',
          shouldPass: true,
        },
        {
          css: '.target { margin: auto; }',
          description: 'Full margin auto',
          shouldPass: true,
        },
        {
          css: '.target { margin-left: auto; margin-right: auto; margin-top: 0; margin-bottom: 0; }',
          description: 'Verbose margin specification',
          shouldPass: true,
        }
      );
      break;
    case 2:
      variations.push(
        {
          css: '.container { display: flex; justify-content: center; align-items: center; flex-direction: row; }',
          description: 'Explicit flex-direction',
          shouldPass: true,
        },
        {
          css: '.container { display: flex; justify-content: center; align-items: center; gap: 0; }',
          description: 'With gap property',
          shouldPass: true,
        }
      );
      break;
    case 3:
      variations.push(
        {
          css: '.container { display: grid; justify-items: center; align-items: center; }',
          description: 'Explicit grid alignment',
          shouldPass: true,
        },
        {
          css: '.container { display: grid; place-items: center center; }',
          description: 'Explicit place-items values',
          shouldPass: true,
        }
      );
      break;
  }

  return variations;
}

/**
 * Generate invalid attempts that should be rejected
 */
function getInvalidAttempts(
  level: Level
): Array<{ css: string; description: string }> {
  const invalid: Array<{ css: string; description: string }> = [];

  // Try to modify locked properties
  Object.entries(level.editableSelectors).forEach(
    ([selector, config]: [string, EditableSelector]) => {
      config.lockedProperties.forEach(prop => {
        invalid.push({
          css: `${selector} { ${prop}: invalid-value; }`,
          description: `Attempt to modify locked property ${prop}`,
        });
      });
    }
  );

  // Try to use selectors that aren't editable
  const nonEditableSelectors = ['.forbidden', '#invalid', 'body', 'html'];
  nonEditableSelectors.forEach(selector => {
    invalid.push({
      css: `${selector} { color: red; }`,
      description: `Attempt to use non-editable selector ${selector}`,
    });
  });

  return invalid;
}

/**
 * Check if level has any selectors with empty allowedProperties array
 */
function hasEmptyAllowedProperties(level: Level): boolean {
  return Object.values(level.editableSelectors).some(
    (config: EditableSelector) =>
      Array.isArray(config.allowedProperties) &&
      config.allowedProperties.length === 0
  );
}
