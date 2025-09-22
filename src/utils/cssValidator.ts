import type { Level, CSSValidationResult, ValidationMessage, CSSProperty } from '../types';
import { createValidationError } from './typeHelpers';

/**
 * Parses CSS text into a simple object structure
 * Returns: { selector: { property: value } }
 */
export function parseCSS(css: string): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  // Remove comments and normalize whitespace
  const cleanCSS = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

  // Split into selector blocks
  const blocks = cleanCSS.split('}').filter(block => block.trim());

  for (const block of blocks) {
    const [selectorPart, propertiesPart] = block.split('{');
    if (!selectorPart || !propertiesPart) continue;

    const selector = selectorPart.trim();
    const properties: Record<string, string> = {};

    // Parse properties
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

/**
 * Validates user CSS against level constraints
 */
export function validateUserCSS(
  userCSS: string,
  level: Level
): CSSValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  try {
    const parsedCSS = parseCSS(userCSS);

    // Check each selector in user CSS
    for (const [selector, properties] of Object.entries(parsedCSS)) {
      const editableConfig = level.editableSelectors[selector];

      if (!editableConfig) {
        errors.push(createValidationError(
          `Selector "${selector}" is not allowed to be modified in this level.`,
          { selector }
        ));
        continue;
      }

      // Check each property
      for (const [property,] of Object.entries(properties)) {
        const isLocked = editableConfig.lockedProperties.includes(property as CSSProperty);
        const isAllowed = editableConfig.allowedProperties.includes(property as CSSProperty) ||
                         editableConfig.allowedProperties.includes('*');

        if (isLocked) {
          errors.push(createValidationError(
            `Property "${property}" in "${selector}" cannot be modified.`,
            { selector, property }
          ));
        } else if (!isAllowed) {
          errors.push(createValidationError(
            `Property "${property}" is not allowed in "${selector}" for this level.`,
            { selector, property }
          ));
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info: []
    };
  } catch {
    return {
      isValid: false,
      errors: [createValidationError('Invalid CSS syntax')],
      warnings,
      info: []
    };
  }
}

/**
 * Generates the complete CSS by combining locked CSS with user's editable CSS
 */
export function generateCompleteCSS(userEditableCSS: string, level: Level): string {
  const result: string[] = [];

  // Add locked CSS first
  result.push(level.lockedCSS);

  // Parse user CSS and add to appropriate selectors
  const parsedUserCSS = parseCSS(userEditableCSS);

  for (const [selector,] of Object.entries(level.editableSelectors)) {
    const userProperties = parsedUserCSS[selector] || {};

    if (Object.keys(userProperties).length > 0) {
      result.push(`\n${selector} {`);

      // Add user's properties
      for (const [property, value] of Object.entries(userProperties)) {
        result.push(`  ${property}: ${value};`);
      }

      result.push('}');
    }
  }

  return result.join('\n');
}

/**
 * Gets the initial editable CSS that the user starts with
 */
export function getInitialEditableCSS(level: Level): string {
  const result: string[] = [];

  for (const [selector, config] of Object.entries(level.editableSelectors)) {
    if (config.initialEditableCSS.trim()) {
      result.push(`${selector} {`);
      result.push(config.initialEditableCSS);
      result.push('}');
      result.push('');
    }
  }

  return result.join('\n').trim();
}

/**
 * Generates a visual representation showing what's locked vs editable
 */
export function generateEditableTemplate(level: Level): string {
  const result: string[] = [];

  // Add locked CSS with comments
  result.push('/* ===== LOCKED CSS (Cannot be modified) ===== */');
  result.push(level.lockedCSS);
  result.push('');
  result.push('/* ===== EDITABLE SECTION ===== */');
  result.push(`/* ${level.constraints} */`);
  result.push('');

  // Add editable sections
  for (const [selector, config] of Object.entries(level.editableSelectors)) {
    result.push(`${selector} {`);
    if (config.initialEditableCSS.trim()) {
      result.push(config.initialEditableCSS);
    } else {
      result.push('  /* Add your CSS properties here */');
      if (config.allowedProperties.length > 0 && !config.allowedProperties.includes('*')) {
        result.push(`  /* Allowed properties: ${config.allowedProperties.join(', ')} */`);
      }
    }
    result.push('}');
    result.push('');
  }

  return result.join('\n');
}