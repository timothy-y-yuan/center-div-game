import { describe, it, expect } from 'vitest';
import { validateUserCSS } from '../utils/cssValidator';
import type { Level } from '../types';
import { createLevelId } from '../utils/typeHelpers';

describe('validateUserCSS with !important detection', () => {
  const mockLevel: Level = {
    id: createLevelId(1),
    title: 'Test Level',
    description: 'Test description',
    initialHTML: '<div class="container"><div class="target">Test</div></div>',
    lockedCSS: `.container {
  width: 300px;
  height: 300px;
  border: 2px solid #333;
}

.target {
  width: 50px;
  height: 50px;
  background: #ff6b6b;
}`,
    editableSelectors: {
      '.target': {
        lockedProperties: ['width', 'height', 'background'],
        allowedProperties: ['margin', 'margin-top', 'margin-left'],
        initialEditableCSS: '  /* Add margin properties */',
      },
    },
    constraints: 'You can only modify the .target selector.',
    hint: 'Think about margins',
    solutionCSS: '.target { margin: 0 auto; }',
    explanation: 'This centers the element horizontally using auto margins.',
    difficulty: 'beginner',
    tags: ['margin', 'horizontal'],
  };

  it('should fail validation when CSS contains !important', () => {
    const userCSS = '.target { margin: 0 auto !important; }';
    const result = validateUserCSS(userCSS, mockLevel);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('!important is not allowed');
  });

  it('should pass validation when CSS is valid and has no !important', () => {
    const userCSS = '.target { margin: 0 auto; }';
    const result = validateUserCSS(userCSS, mockLevel);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation for !important before other validation errors', () => {
    // This CSS has both !important AND a disallowed property
    const userCSS = '.target { color: blue !important; }';
    const result = validateUserCSS(userCSS, mockLevel);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('!important is not allowed');
    // Should not show the "property not allowed" error since !important is checked first
  });

  it('should handle !important in multiple properties', () => {
    const userCSS = `
      .target { 
        margin: 0 auto !important;
        margin-top: 10px !important;
      }
    `;
    const result = validateUserCSS(userCSS, mockLevel);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('!important is not allowed');
  });
});