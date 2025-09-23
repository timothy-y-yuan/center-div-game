/**
 * @fileoverview Simple completion checking logic
 */

import type { Level } from '../types';

const TOLERANCE_PX = 5;

export function checkLevelCompletion(level: Level, iframeId: string): boolean {
  try {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe?.contentDocument) {
      console.log(
        '🔍 Verification failed: iframe or contentDocument not found'
      );
      return false;
    }

    const target = iframe.contentDocument.querySelector('.target');
    const container = iframe.contentDocument.querySelector('.container');
    if (!target || !container) {
      console.log(
        '🔍 Verification failed: target or container element not found'
      );
      return false;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const horizontalDiff = Math.abs(targetCenterX - containerCenterX);
    const verticalDiff = Math.abs(targetCenterY - containerCenterY);

    const horizontalCentered = horizontalDiff <= TOLERANCE_PX;
    const verticallyCentered = verticalDiff <= TOLERANCE_PX;

    const meetsHorizontal =
      !level.requirements.requiresHorizontalCentering || horizontalCentered;
    const meetsVertical =
      !level.requirements.requiresVerticalCentering || verticallyCentered;

    const result = meetsHorizontal && meetsVertical;

    console.log(`🎯 Level ${level.id} Verification Results`);
    console.log(`✅ Level completed: ${result}`);
    console.log(
      `📏 Horizontal centering: ${horizontalCentered ? '✅ Correct' : `❌ Off by ${horizontalDiff.toFixed(1)}px`}`
    );
    console.log(
      `📐 Vertical centering: ${verticallyCentered ? '✅ Correct' : `❌ Off by ${verticalDiff.toFixed(1)}px`}`
    );
    console.log(
      `💬 Feedback: ${result ? 'Perfect!' : 'Close! ' + (!horizontalCentered ? `The element is horizontally off by ${horizontalDiff.toFixed(1)}px.` : '') + (!verticallyCentered ? `The element is vertically off by ${verticalDiff.toFixed(1)}px.` : '')}`
    );
    console.log(`📋 Requirements:`);
    console.log(
      `  - Horizontal centering required: ${level.requirements.requiresHorizontalCentering}`
    );
    console.log(
      `  - Vertical centering required: ${level.requirements.requiresVerticalCentering}`
    );
    console.log(`🔍 Debug Logic:`);
    console.log(`  - Meets horizontal requirement: ${meetsHorizontal}`);
    console.log(`  - Meets vertical requirement: ${meetsVertical}`);
    console.log(`  - Should be completed: ${result}`);

    return result;
  } catch (error) {
    console.log('🔍 Verification failed with error:', error);
    return false;
  }
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
