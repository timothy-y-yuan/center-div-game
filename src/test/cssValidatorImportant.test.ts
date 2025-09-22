import { describe, it, expect } from 'vitest';
import { validateUserCSS } from '../utils/cssValidator';
import { levels } from '../data/levels';

describe('validateUserCSS with !important detection', () => {
  const firstLevel = levels[0];

  it('should fail validation when CSS contains !important', () => {
    const userCSS = '.target { margin: 0 auto !important; }';
    const result = validateUserCSS(userCSS, firstLevel);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('!important is not allowed');
  });

  it('should pass validation when CSS is valid and has no !important', () => {
    const userCSS = '.target { margin: 0 auto; }';
    const result = validateUserCSS(userCSS, firstLevel);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation for !important before other validation errors', () => {
    // This CSS has both !important AND a disallowed property
    const userCSS = '.target { color: blue !important; }';
    const result = validateUserCSS(userCSS, firstLevel);

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
    const result = validateUserCSS(userCSS, firstLevel);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('!important is not allowed');
  });
});