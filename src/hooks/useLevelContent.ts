/**
 * @fileoverview Custom hook for managing level content and CSS editing
 * Handles HTML/CSS state and validation with level-specific constraints
 */

import { useState, useCallback, useMemo } from 'react';
import type { Level, CSSValidationResult } from '../types';
import { getInitialEditableCSS, validateUserCSS, generateCompleteCSS } from '../utils/cssValidator';

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseLevelContentResult {
  /** Current HTML content */
  readonly html: string;

  /** Current editable CSS content */
  readonly editableCSS: string;

  /** CSS validation result */
  readonly cssValidation: CSSValidationResult;

  /** Complete CSS combining locked and editable parts */
  readonly completeCSS: string;

  /** Complete HTML document for preview iframe */
  readonly previewContent: string;

  /** Updates the HTML content */
  readonly setHTML: (html: string) => void;

  /** Updates the editable CSS and triggers validation */
  readonly updateCSS: (css: string) => void;

  /** Sets the CSS to the level's solution */
  readonly setSolutionCSS: (level: Level) => void;

  /** Resets content for a new level */
  readonly resetForLevel: (level: Level) => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for managing level content with validation
 * @param currentLevel - The current level to load content for
 * @returns Level content state and management functions
 */
export function useLevelContent(currentLevel: Level): UseLevelContentResult {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [html, setHtml] = useState(currentLevel.initialHTML);
  const [editableCSS, setEditableCSS] = useState(() =>
    getInitialEditableCSS(currentLevel)
  );

  const [cssValidation, setCssValidation] = useState(() =>
    validateUserCSS('', currentLevel)
  );

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * Generates complete CSS by combining locked and editable parts
   */
  const completeCSS = useMemo(() =>
    generateCompleteCSS(editableCSS, currentLevel),
    [editableCSS, currentLevel]
  );

  /**
   * Generates complete HTML document for preview iframe
   */
  const previewContent = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${completeCSS}</style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `, [html, completeCSS]);

  // ============================================================================
  // CONTENT MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Updates the HTML content
   * @param newHtml - New HTML content
   */
  const setHTML = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  /**
   * Updates the editable CSS and triggers validation
   * @param newCSS - New CSS content
   */
  const updateCSS = useCallback((newCSS: string) => {
    setEditableCSS(newCSS);

    // Validate the CSS against level constraints
    const validation = validateUserCSS(newCSS, currentLevel);
    setCssValidation(validation);
  }, [currentLevel]);

  /**
   * Sets the CSS to the level's solution (used when revealing answer)
   * @param level - The current level
   */
  const setSolutionCSS = useCallback((level: Level) => {
    setEditableCSS(level.solutionCSS);

    // Clear validation errors since solution is always valid
    const validation = validateUserCSS(level.solutionCSS, level);
    setCssValidation(validation);
  }, []);

  /**
   * Resets all content for a new level
   * @param level - The new level to reset content for
   */
  const resetForLevel = useCallback((level: Level) => {
    setHtml(level.initialHTML);
    setEditableCSS(getInitialEditableCSS(level));
    setCssValidation(validateUserCSS('', level));
  }, []);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return {
    html,
    editableCSS,
    cssValidation,
    completeCSS,
    previewContent,
    setHTML,
    updateCSS,
    setSolutionCSS,
    resetForLevel,
  };
}