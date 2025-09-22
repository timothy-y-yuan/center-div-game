import { describe, it, expect } from 'vitest'
import { parseCSS, validateUserCSS, generateCompleteCSS, getInitialEditableCSS } from '../utils/cssValidator'
import type { Level } from '../types'
import { createLevelId } from '../utils/typeHelpers'

describe('CSS Validator Utilities', () => {
  const mockLevel: Level = {
    id: createLevelId(1),
    title: "Test Level",
    description: "Test description",
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
        initialEditableCSS: '  /* Add margin properties */'
      }
    },
    constraints: "You can only add margin properties to .target",
    hint: "Test hint",
    solutionCSS: "Test solution",
    explanation: "Test explanation",
    difficulty: 'beginner',
    tags: ['test', 'margin'],
  }

  describe('parseCSS', () => {
    it('should parse simple CSS correctly', () => {
      const css = `.test { color: red; font-size: 14px; }`
      const result = parseCSS(css)

      expect(result).toEqual({
        '.test': {
          'color': 'red',
          'font-size': '14px'
        }
      })
    })

    it('should handle multiple selectors', () => {
      const css = `.test { color: red; } .other { margin: 10px; }`
      const result = parseCSS(css)

      expect(result).toEqual({
        '.test': { 'color': 'red' },
        '.other': { 'margin': '10px' }
      })
    })

    it('should handle whitespace and comments', () => {
      const css = `
        /* Comment */
        .test {
          color: red;
          margin: 0 auto;
        }
      `
      const result = parseCSS(css)

      expect(result).toEqual({
        '.test': {
          'color': 'red',
          'margin': '0 auto'
        }
      })
    })
  })

  describe('validateUserCSS', () => {
    it('should validate allowed properties', () => {
      const userCSS = '.target { margin: 0 auto; }'
      const result = validateUserCSS(userCSS, mockLevel)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject locked properties', () => {
      const userCSS = '.target { width: 100px; }'
      const result = validateUserCSS(userCSS, mockLevel)

      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.message === 'Property "width" in ".target" cannot be modified.')).toBe(true)
    })

    it('should reject disallowed properties', () => {
      const userCSS = '.target { color: blue; }'
      const result = validateUserCSS(userCSS, mockLevel)

      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.message === 'Property "color" is not allowed in ".target" for this level.')).toBe(true)
    })

    it('should reject unknown selectors', () => {
      const userCSS = '.unknown { color: blue; }'
      const result = validateUserCSS(userCSS, mockLevel)

      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.message === 'Selector ".unknown" is not allowed to be modified in this level.')).toBe(true)
    })
  })

  describe('generateCompleteCSS', () => {
    it('should combine locked CSS with user editable CSS', () => {
      const userCSS = '.target { margin: 0 auto; }'
      const result = generateCompleteCSS(userCSS, mockLevel)

      expect(result).toContain(mockLevel.lockedCSS)
      expect(result).toContain('margin: 0 auto')
    })

    it('should handle empty user CSS', () => {
      const userCSS = ''
      const result = generateCompleteCSS(userCSS, mockLevel)

      expect(result).toContain(mockLevel.lockedCSS)
    })
  })

  describe('getInitialEditableCSS', () => {
    it('should return initial editable CSS for level', () => {
      const result = getInitialEditableCSS(mockLevel)

      expect(result).toContain('.target {')
      expect(result).toContain('/* Add margin properties */')
    })

    it('should handle multiple editable selectors', () => {
      const levelWithMultiple: Level = {
        ...mockLevel,
        editableSelectors: {
          '.container': {
            lockedProperties: [],
            allowedProperties: ['display'],
            initialEditableCSS: '  /* Add display */'
          },
          '.target': {
            lockedProperties: [],
            allowedProperties: ['margin'],
            initialEditableCSS: '  /* Add margin */'
          }
        }
      }

      const result = getInitialEditableCSS(levelWithMultiple)

      expect(result).toContain('.container {')
      expect(result).toContain('.target {')
      expect(result).toContain('/* Add display */')
      expect(result).toContain('/* Add margin */')
    })
  })
})