import { useState, useCallback, useMemo } from 'react';
import type { Level, CSSValidationResult } from '../types';
import {
  getInitialEditableCSS,
  validateUserCSS,
  generateCompleteCSS,
} from '../utils/cssValidator';

export interface UseLevelContentResult {
  readonly html: string;
  readonly editableCSS: string;
  readonly cssValidation: CSSValidationResult;
  readonly completeCSS: string;
  readonly previewContent: string;
  readonly setHTML: (html: string) => void;
  readonly updateCSS: (css: string) => void;
  readonly setSolutionCSS: (level: Level) => void;
  readonly resetForLevel: (level: Level) => void;
}

export function useLevelContent(currentLevel: Level): UseLevelContentResult {
  const [html, setHtml] = useState(currentLevel.initialHTML);
  const [editableCSS, setEditableCSS] = useState(() =>
    getInitialEditableCSS(currentLevel)
  );
  const [cssValidation, setCssValidation] = useState(() =>
    validateUserCSS('', currentLevel)
  );

  const completeCSS = useMemo(
    () => generateCompleteCSS(editableCSS, currentLevel),
    [editableCSS, currentLevel]
  );

  const previewContent = useMemo(
    () => `<!DOCTYPE html>
<html>
<head><style>${completeCSS}</style></head>
<body>${html}</body>
</html>`,
    [html, completeCSS]
  );

  const setHTML = useCallback((newHtml: string) => setHtml(newHtml), []);

  const updateCSS = useCallback(
    (newCSS: string) => {
      setEditableCSS(newCSS);
      setCssValidation(validateUserCSS(newCSS, currentLevel));
    },
    [currentLevel]
  );

  const setSolutionCSS = useCallback((level: Level) => {
    setEditableCSS(level.solutionCSS);
    setCssValidation(validateUserCSS(level.solutionCSS, level));
  }, []);

  const resetForLevel = useCallback((level: Level) => {
    setHtml(level.initialHTML);
    setEditableCSS(getInitialEditableCSS(level));
    setCssValidation(validateUserCSS('', level));
  }, []);

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
