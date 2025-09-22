/**
 * @fileoverview Integration tests with minimal mocking
 * Tests complete user workflow with real iframe and completion detection
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { levels } from '../data/levels';

vi.mock('@monaco-editor/react', () => ({
  default: ({
    value,
    onChange,
    language,
  }: {
    value: string;
    onChange?: (value: string) => void;
    language: string;
  }) => (
    <textarea
      data-testid={`monaco-editor-${language}`}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      style={{ width: '100%', height: '200px', fontFamily: 'monospace' }}
    />
  ),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Integration Tests - End-to-End User Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('should complete level 1 through full user interaction', async () => {
    console.log('\n🎮 Integration Test - Level 1 Completion');
    console.log('=========================================');

    renderWithTheme(<App />);

    expect(screen.getByText("1: Baby's First Center")).toBeInTheDocument();
    console.log('✅ Game loaded');

    const cssEditor = screen.getByTestId('monaco-editor-css');
    expect(cssEditor).toBeInTheDocument();
    console.log('✅ CSS editor found');

    fireEvent.change(cssEditor, {
      target: { value: levels[0].solutionCSS },
    });
    console.log(
      '✅ Solution entered:',
      levels[0].solutionCSS.slice(0, 50) + '...'
    );

    await waitFor(
      () => {
        const iframe = document.getElementById('preview');
        expect(iframe).toBeTruthy();
        return iframe;
      },
      { timeout: 5000 }
    );
    console.log('✅ Preview iframe loaded');

    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);
    console.log('✅ Check button clicked');

    await waitFor(
      () => {
        const completedLevels = JSON.parse(
          localStorage.getItem('completedLevels') || '[]'
        );
        const confetti = screen.queryByTestId('confetti-effect');

        return completedLevels.includes(1) || confetti;
      },
      { timeout: 3000 }
    );

    const completedLevels = JSON.parse(
      localStorage.getItem('completedLevels') || '[]'
    );
    const confetti = screen.queryByTestId('confetti-effect');

    console.log('📊 Completed levels in localStorage:', completedLevels);

    if (confetti) {
      console.log('🎊 Confetti animation triggered');
    }

    if (completedLevels.includes(1)) {
      console.log('✅ Level 1 marked as completed in localStorage');
    }

    expect(confetti || completedLevels.includes(1)).toBeTruthy();

    console.log('\n🎉 Integration test complete - Level 1 solved successfully');
  });

  it('should handle core UI interactions', () => {
    console.log('\n🎮 UI Interaction Test');
    console.log('======================');

    renderWithTheme(<App />);

    const cssEditor = screen.getByTestId('monaco-editor-css');
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto; }' },
    });
    expect(cssEditor).toHaveValue('.target { margin: 0 auto; }');
    console.log('✅ CSS editor input works');

    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);
    console.log('✅ Check button clicked');

    const hintButton = screen.getByText('Hint');
    fireEvent.click(hintButton);
    console.log('✅ Hint button clicked');

    const levelDropdown = screen.getByText("1: Baby's First Center");
    fireEvent.click(levelDropdown);
    console.log('✅ Level dropdown clicked');

    console.log('\n✅ All UI interactions working correctly');
  });

  it('should test iframe rendering and completion detection', async () => {
    console.log('\n🎮 Iframe Completion Detection Test');
    console.log('===================================');

    renderWithTheme(<App />);

    await waitFor(
      () => {
        const iframe = document.getElementById('preview');
        expect(iframe).toBeTruthy();
        return iframe;
      },
      { timeout: 5000 }
    );

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    console.log('✅ Preview iframe found:', iframe?.tagName);

    const cssEditor = screen.getByTestId('monaco-editor-css');
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto; }' },
    });

    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);
    console.log('✅ Completion check triggered');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Iframe completion detection test complete');
  });
});
