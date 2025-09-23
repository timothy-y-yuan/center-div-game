/**
 * @fileoverview Simple completion checking logic
 */

import type { Level, ValidationFeedback } from '../types';

const TOLERANCE_PX = 5;

export function calculateCenteringMetrics(
  level: Level,
  iframeId: string
): ValidationFeedback | null {
  try {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe?.contentDocument) {
      return null;
    }

    const target = iframe.contentDocument.querySelector('.target');
    const container = iframe.contentDocument.querySelector('.container');
    if (!target || !container) {
      return null;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const horizontalOffset = Math.abs(targetCenterX - containerCenterX);
    const verticalOffset = Math.abs(targetCenterY - containerCenterY);

    const horizontalCentered = horizontalOffset <= TOLERANCE_PX;
    const verticallyCentered = verticalOffset <= TOLERANCE_PX;

    const meetsHorizontal =
      !level.requirements.requiresHorizontalCentering || horizontalCentered;
    const meetsVertical =
      !level.requirements.requiresVerticalCentering || verticallyCentered;

    return {
      isCompleted: meetsHorizontal && meetsVertical,
      horizontalCentered,
      verticallyCentered,
      horizontalOffset,
      verticalOffset,
      requiresHorizontal: level.requirements.requiresHorizontalCentering,
      requiresVertical: level.requirements.requiresVerticalCentering,
    };
  } catch (error) {
    console.log('🔍 Centering calculation failed with error:', error);
    return null;
  }
}

export function checkLevelCompletion(level: Level, iframeId: string): boolean {
  return calculateCenteringMetrics(level, iframeId)?.isCompleted ?? false;
}

export function getPlayerTitle(completedCount: number): string {
  const titles = [
    '0.001x Engineer',
    'Copy-Paste Padawan',
    'Stack Overflow Scholar',
    '!important Abuser',
    'Flexbox Whisperer',
    'CSS Semicolon Slayer',
    'Bootstrap Escapee',
    'Grid Master Race',
    'Layout Wizard Lord',
    'CSS Chaos Architect',
    'CSS Überwizardninjamaster',
  ];
  return titles[Math.min(completedCount, titles.length - 1)];
}
