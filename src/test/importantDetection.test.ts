import { describe, it, expect } from 'vitest';
import { containsImportant } from '../utils/cssValidator';

describe('containsImportant', () => {
  it('should detect !important in simple CSS', () => {
    const css = '.target { margin: 0 auto !important; }';
    expect(containsImportant(css)).toBe(true);
  });

  it('should detect !important with spaces', () => {
    const css = '.target { margin: 0 auto ! important; }';
    expect(containsImportant(css)).toBe(true);
  });

  it('should detect !important case insensitively', () => {
    const css = '.target { margin: 0 auto !IMPORTANT; }';
    expect(containsImportant(css)).toBe(true);
  });

  it('should not detect !important in comments', () => {
    const css = '.target { /* margin: 0 auto !important; */ margin: 0 auto; }';
    expect(containsImportant(css)).toBe(false);
  });

  it('should not detect !important in regular CSS without it', () => {
    const css = '.target { margin: 0 auto; background: red; }';
    expect(containsImportant(css)).toBe(false);
  });

  it('should detect multiple !important declarations', () => {
    const css = `
      .target { 
        margin: 0 auto !important; 
        background: red !important;
      }
    `;
    expect(containsImportant(css)).toBe(true);
  });

  it('should detect !important in multi-line CSS', () => {
    const css = `
      .target {
        margin: 0 auto
          !important;
      }
    `;
    expect(containsImportant(css)).toBe(true);
  });

  it('should handle empty CSS', () => {
    expect(containsImportant('')).toBe(false);
  });

  it('should handle CSS with only comments', () => {
    const css = '/* This is a comment with !important in it */';
    expect(containsImportant(css)).toBe(false);
  });
});