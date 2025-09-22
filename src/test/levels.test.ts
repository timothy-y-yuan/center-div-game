import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';

describe('Levels Data', () => {
  it('should have proper level structure', () => {
    levels.forEach(level => {
      expect(level.title.length).toBeGreaterThan(0);
      expect(level.description.length).toBeGreaterThan(0);
      expect(level.initialHTML.length).toBeGreaterThan(0);
      expect(level.lockedCSS.length).toBeGreaterThan(0);
      expect(level.constraints.length).toBeGreaterThan(0);
      expect(level.hint.length).toBeGreaterThan(0);
      expect(level.solutionCSS.length).toBeGreaterThan(0);
      expect(level.explanation.length).toBeGreaterThan(0);
      expect(Object.keys(level.editableSelectors).length).toBeGreaterThan(0);
    });
  });

  it('should contain CSS container and target classes', () => {
    levels.forEach(level => {
      expect(level.initialHTML).toContain('container');
      expect(level.initialHTML).toContain('target');
      expect(level.lockedCSS).toContain('.container');
      expect(level.lockedCSS).toContain('.target');

      // solutionCSS should only contain selectors that are editable for this level
      const editableSelectors = Object.keys(level.editableSelectors);
      editableSelectors.forEach(selector => {
        expect(level.solutionCSS).toContain(selector);
      });
    });
  });

  it('should have unique hints for each level', () => {
    const hints = levels.map(level => level.hint);
    const uniqueHints = new Set(hints);
    expect(uniqueHints.size).toBe(levels.length);
  });

  it('should have different solutions for each level', () => {
    const solutions = levels.map(level => level.solutionCSS);
    const uniqueSolutions = new Set(solutions);
    expect(uniqueSolutions.size).toBe(levels.length);
  });
});
