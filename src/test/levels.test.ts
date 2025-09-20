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
      expect(level).toHaveProperty('initialCSS')
      expect(level).toHaveProperty('hint')
      expect(level).toHaveProperty('solutionCSS')
      expect(level).toHaveProperty('explanation')

      // Check that all properties are strings
      expect(typeof level.title).toBe('string')
      expect(typeof level.description).toBe('string')
      expect(typeof level.initialHTML).toBe('string')
      expect(typeof level.initialCSS).toBe('string')
      expect(typeof level.hint).toBe('string')
      expect(typeof level.solutionCSS).toBe('string')
      expect(typeof level.explanation).toBe('string')

      // Check that all strings are not empty
      expect(level.title.length).toBeGreaterThan(0)
      expect(level.description.length).toBeGreaterThan(0)
      expect(level.initialHTML.length).toBeGreaterThan(0)
      expect(level.initialCSS.length).toBeGreaterThan(0)
      expect(level.hint.length).toBeGreaterThan(0)
      expect(level.solutionCSS.length).toBeGreaterThan(0)
      expect(level.explanation.length).toBeGreaterThan(0)

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
      expect(level.initialCSS).toContain('.container')
      expect(level.initialCSS).toContain('.target')
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