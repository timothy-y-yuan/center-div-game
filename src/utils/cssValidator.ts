import type { Level, CSSValidationResult } from '../types';
import { createValidationError } from './typeHelpers';

export function containsImportant(css: string): boolean {
  return /!\s*important/i.test(css.replace(/\/\*[\s\S]*?\*\//g, ''));
}

export function parseCSS(css: string): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  const cleanCSS = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const blocks = cleanCSS.split('}').filter(block => block.trim());

  for (const block of blocks) {
    const [selectorPart, propertiesPart] = block.split('{');
    if (!selectorPart || !propertiesPart) continue;

    const selector = selectorPart.trim();
    const properties: Record<string, string> = {};
    const propertyLines = propertiesPart.split(';').filter(line => line.trim());

    for (const line of propertyLines) {
      const [prop, value] = line.split(':');
      if (prop && value) {
        properties[prop.trim()] = value.trim();
      }
    }
    result[selector] = properties;
  }
  return result;
}

export function validateUserCSS(
  userCSS: string,
  level: Level
): CSSValidationResult {
  try {
    const parsedCSS = parseCSS(userCSS);
    const errors = [];
    const warnings = [];

    // Check for !important usage - only allowed on the secret level
    if (containsImportant(userCSS) && level.id !== 999) {
      errors.push(
        createValidationError(
          'Using !important is not allowed in this game. Try to solve the level using proper CSS techniques instead!'
        )
      );
      return {
        isValid: false,
        errors,
        warnings,
        info: [],
      };
    }

    for (const [selector, properties] of Object.entries(parsedCSS)) {
      const editableConfig = level.editableSelectors[selector];
      if (!editableConfig) {
        errors.push(
          createValidationError(
            `Selector "${selector}" is not allowed to be modified in this level.`
          )
        );
        continue;
      }

      for (const property of Object.keys(properties)) {
        const isLocked = editableConfig.lockedProperties.includes(property);
        const isAllowed =
          editableConfig.allowedProperties.includes(property) ||
          editableConfig.allowedProperties.includes('*');

        if (isLocked) {
          errors.push(
            createValidationError(
              `Property "${property}" in "${selector}" cannot be modified.`
            )
          );
        } else if (!isAllowed) {
          errors.push(
            createValidationError(
              `Property "${property}" in "${selector}" is not allowed.`
            )
          );
        }
      }
    }

    return { isValid: errors.length === 0, errors, warnings: [], info: [] };
  } catch {
    return {
      isValid: false,
      errors: [createValidationError('Invalid CSS syntax')],
      warnings: [],
      info: [],
    };
  }
}

export function generateCompleteCSS(
  userEditableCSS: string,
  level: Level
): string {
  const result = [level.lockedCSS];
  const parsedUserCSS = parseCSS(userEditableCSS);

  for (const selector of Object.keys(level.editableSelectors)) {
    const userProperties = parsedUserCSS[selector];
    if (userProperties && Object.keys(userProperties).length > 0) {
      result.push(`\n${selector} {`);
      for (const [property, value] of Object.entries(userProperties)) {
        result.push(`  ${property}: ${value};`);
      }
      result.push('}');
    }
  }
  return result.join('\n');
}

export function getInitialEditableCSS(level: Level): string {
  const result = [];
  for (const [selector, config] of Object.entries(level.editableSelectors)) {
    if (config.initialEditableCSS.trim()) {
      result.push(`${selector} {\n${config.initialEditableCSS}\n}\n`);
    }
  }
  return result.join('').trim();
}
