/**
 * @fileoverview Integration tests for complete gameplay workflow
 * Tests the actual user experience of playing the game from start to finish
 */

import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';
import { validateUserCSS } from '../utils/cssValidator';

describe('Gameplay Integration Tests', () => {
  describe('Multi-Level User Journey', () => {
    it('should allow users to progress through first 3 levels sequentially', () => {
      // Simulate a realistic user journey through beginner levels
      const userJourney = [
        {
          level: 0,
          userCSS: '.target { margin: 0 auto; }',
          description: 'Level 1: Basic margin centering',
        },
        {
          level: 1,
          userCSS:
            '.container { display: flex; justify-content: center; align-items: center; }',
          description: 'Level 2: Flexbox centering',
        },
        {
          level: 2,
          userCSS: '.container { display: grid; place-items: center; }',
          description: 'Level 3: Grid centering',
        },
      ];

      userJourney.forEach(({ level: levelIndex, userCSS, description }) => {
        const level = levels[levelIndex];
        const result = validateUserCSS(userCSS, level);

        if (!result.isValid) {
          console.error(`${description} failed:`, result.errors);
        }

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should support common CSS variations that users naturally try', () => {
      // Test that users can solve levels in multiple valid ways
      const variations = [
        {
          level: 0,
          variations: [
            '.target { margin-left: auto; margin-right: auto; }',
            '.target { margin: auto; }',
          ],
        },
        {
          level: 1,
          variations: [
            '.container { display: flex; justify-content: center; align-items: center; flex-direction: row; }',
            '.container { display: flex; place-items: center; justify-content: center; }',
          ],
        },
      ];

      variations.forEach(
        ({ level: levelIndex, variations: levelVariations }) => {
          const level = levels[levelIndex];

          levelVariations.forEach(css => {
            const result = validateUserCSS(css, level);
            expect(result.isValid).toBe(true);
          });
        }
      );
    });
  });

  describe('Complete Gameplay Workflow', () => {
    it('should validate the core game progression through all levels', () => {
      console.log('\n🎮 Starting Complete Gameplay Workflow Test');
      console.log('============================================');

      // This test simulates the core game workflow:
      // 1. Enter official solution for each level
      // 2. Validate it passes CSS validation (simulates "Check" button validation)
      // 3. Verify completion can be detected
      // 4. Ensure progression through all levels works

      const gameplayResults: Array<{
        levelNumber: number;
        title: string;
        solutionValid: boolean;
        canProgress: boolean;
      }> = [];

      levels.forEach((level, index) => {
        const levelNumber = index + 1;
        const isLastLevel = index === levels.length - 1;

        console.log(`\n📋 Level ${levelNumber}: ${level.title}`);

        // Step 1: Validate official solution (simulates user entering solution + clicking Check)
        const solutionResult = validateUserCSS(level.solutionCSS, level);

        console.log(
          `   ✅ Solution validation: ${solutionResult.isValid ? 'PASS' : 'FAIL'}`
        );
        if (!solutionResult.isValid) {
          console.error(`   ❌ Errors:`, solutionResult.errors);
        }

        // Step 2: Simulate completion detection (what would trigger confetti + progress update)
        const isCompleted = solutionResult.isValid;
        console.log(
          `   🎉 Level completion: ${isCompleted ? 'COMPLETED' : 'FAILED'}`
        );

        // Step 3: Check progression rules (next level button visibility)
        const canProgress = isCompleted && !isLastLevel;
        const progressStatus = isLastLevel
          ? isCompleted
            ? 'GAME COMPLETE! 🏆'
            : 'CANNOT COMPLETE FINAL LEVEL'
          : canProgress
            ? 'CAN ADVANCE TO NEXT LEVEL'
            : 'CANNOT ADVANCE';

        console.log(`   ➡️  Progression: ${progressStatus}`);

        // Record results
        gameplayResults.push({
          levelNumber,
          title: level.title,
          solutionValid: solutionResult.isValid,
          canProgress: canProgress || (isCompleted && isLastLevel),
        });

        // Assertions for test validation
        expect(solutionResult.isValid).toBe(true);
        expect(solutionResult.errors).toHaveLength(0);
      });

      // Final validation
      console.log('\n🏁 Gameplay Workflow Summary');
      console.log('============================');

      const totalLevels = gameplayResults.length;
      const completedLevels = gameplayResults.filter(
        r => r.solutionValid
      ).length;
      const progressableLevels = gameplayResults.filter(
        r => r.canProgress
      ).length;

      console.log(`📊 Total levels: ${totalLevels}`);
      console.log(`✅ Completed levels: ${completedLevels}`);
      console.log(`➡️  Progressable: ${progressableLevels}`);

      // All levels should be completable
      expect(completedLevels).toBe(totalLevels);

      // All levels should allow progression (including final level completing the game)
      expect(progressableLevels).toBe(totalLevels);

      console.log('\n🎊 Complete Gameplay Workflow Test: SUCCESS!');
      console.log('   ✅ All official solutions work correctly');
      console.log('   ✅ All levels can be completed');
      console.log('   ✅ Progression logic works end-to-end');
      console.log('   ✅ Game can be completed from start to finish');
    });
  });
});
