import { describe, it, expect } from 'vitest'
import { levels } from '../data/levels'

describe('Levels Data', () => {
  it('should have exactly 10 levels', () => {
    expect(levels).toHaveLength(10)
  })

  it('should have proper level structure', () => {
    levels.forEach((level, index) => {
      expect(level).toHaveProperty('id')
      expect(level).toHaveProperty('title')
      expect(level).toHaveProperty('description')
      expect(level).toHaveProperty('initialHTML')
      expect(level).toHaveProperty('lockedCSS')
      expect(level).toHaveProperty('editableSelectors')
      expect(level).toHaveProperty('constraints')
      expect(level).toHaveProperty('hint')
      expect(level).toHaveProperty('solutionCSS')
      expect(level).toHaveProperty('explanation')

      // Check that all properties are correct types
      expect(typeof level.title).toBe('string')
      expect(typeof level.description).toBe('string')
      expect(typeof level.initialHTML).toBe('string')
      expect(typeof level.lockedCSS).toBe('string')
      expect(typeof level.editableSelectors).toBe('object')
      expect(typeof level.constraints).toBe('string')
      expect(typeof level.hint).toBe('string')
      expect(typeof level.solutionCSS).toBe('string')
      expect(typeof level.explanation).toBe('string')

      // Check that all strings are not empty
      expect(level.title.length).toBeGreaterThan(0)
      expect(level.description.length).toBeGreaterThan(0)
      expect(level.initialHTML.length).toBeGreaterThan(0)
      expect(level.lockedCSS.length).toBeGreaterThan(0)
      expect(level.constraints.length).toBeGreaterThan(0)
      expect(level.hint.length).toBeGreaterThan(0)
      expect(level.solutionCSS.length).toBeGreaterThan(0)
      expect(level.explanation.length).toBeGreaterThan(0)

      // Check that editableSelectors is properly structured
      expect(Object.keys(level.editableSelectors).length).toBeGreaterThan(0)
      Object.entries(level.editableSelectors).forEach(([selector, config]) => {
        expect(typeof selector).toBe('string')
        expect(config).toHaveProperty('lockedProperties')
        expect(config).toHaveProperty('allowedProperties')
        expect(config).toHaveProperty('initialEditableCSS')
        expect(Array.isArray(config.lockedProperties)).toBe(true)
        expect(Array.isArray(config.allowedProperties)).toBe(true)
        expect(typeof config.initialEditableCSS).toBe('string')
      })

      // Check that ID matches index + 1
      expect(level.id).toBe(index + 1)
    })
  })

  it('should have progressive difficulty in titles', () => {
    expect(levels[0].title).toContain("1:")
    expect(levels[1].title).toContain("2:")
    expect(levels[9].title).toContain("10:")
  })

  it('should contain CSS container and target classes', () => {
    levels.forEach(level => {
      expect(level.initialHTML).toContain('container')
      expect(level.initialHTML).toContain('target')
      expect(level.lockedCSS).toContain('.container')
      expect(level.lockedCSS).toContain('.target')
      expect(level.solutionCSS).toContain('.container')
      expect(level.solutionCSS).toContain('.target')
    })
  })

  it('should have unique hints for each level', () => {
    const hints = levels.map(level => level.hint)
    const uniqueHints = new Set(hints)
    expect(uniqueHints.size).toBe(levels.length)
  })

  it('should have educational explanations', () => {
    levels.forEach(level => {
      // Explanations should be descriptive and educational
      expect(level.explanation.length).toBeGreaterThan(50)
      // Should contain CSS-related keywords
      const explanation = level.explanation.toLowerCase()
      const cssKeywords = ['css', 'center', 'flex', 'grid', 'margin', 'position', 'display']
      const hasKeyword = cssKeywords.some(keyword => explanation.includes(keyword))
      expect(hasKeyword).toBe(true)
    })
  })

  it('should have different solutions for each level', () => {
    const solutions = levels.map(level => level.solutionCSS)
    const uniqueSolutions = new Set(solutions)
    expect(uniqueSolutions.size).toBe(levels.length)
  })
})