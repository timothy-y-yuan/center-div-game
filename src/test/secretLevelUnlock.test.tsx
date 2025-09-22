import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { act } from 'react';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Secret Level Unlock Feature', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should unlock secret level when !important is used on a normal level', async () => {
    renderWithTheme(<App />);

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Get the CSS editor
    const editor = screen.getByRole('textbox');

    // Enter CSS with !important
    await act(async () => {
      fireEvent.change(editor, {
        target: { value: '.target { margin: 0 auto !important; }' }
      });
    });

    // Should show the important modal
    await waitFor(() => {
      expect(screen.getByText(/nuclear option/i)).toBeInTheDocument();
    });

    // Check that we've been switched to the secret level
    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });

    // Verify secret level is unlocked in localStorage
    const secretLevelUnlocked = JSON.parse(localStorage.getItem('secretLevelUnlocked') || 'false');
    expect(secretLevelUnlocked).toBe(true);
  });

  it('should allow !important usage on the secret level', async () => {
    // Manually unlock the secret level
    localStorage.setItem('secretLevelUnlocked', 'true');
    localStorage.setItem('currentLevel', '999');

    renderWithTheme(<App />);

    // Wait for the app to load on the secret level
    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });

    // Get the CSS editor
    const editor = screen.getByRole('textbox');

    // Enter CSS with !important (should be allowed)
    await act(async () => {
      fireEvent.change(editor, {
        target: { value: '.target { top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; }' }
      });
    });

    // Should NOT show the important modal
    expect(screen.queryByText(/nuclear option/i)).not.toBeInTheDocument();

    // The CSS should be accepted and editor should contain the new value
    await waitFor(() => {
      expect(editor).toHaveValue(expect.stringContaining('!important'));
    });
  });

  it('should include secret level in levels dropdown when unlocked', async () => {
    // Manually unlock the secret level
    localStorage.setItem('secretLevelUnlocked', 'true');

    renderWithTheme(<App />);

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Find and click the level dropdown
    const levelDropdown = screen.getByRole('button', { name: /current level/i });
    await act(async () => {
      fireEvent.click(levelDropdown);
    });

    // Should show the secret level option
    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });
  });

  it('should persist secret level unlock across sessions', async () => {
    // First session: unlock the secret level
    renderWithTheme(<App />);

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Get the CSS editor and use !important
    const editor = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(editor, {
        target: { value: '.target { margin: 0 auto !important; }' }
      });
    });

    // Wait for secret level unlock
    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });

    // Cleanup and re-render (simulating new session)
    const secretLevelUnlocked = localStorage.getItem('secretLevelUnlocked');
    renderWithTheme(<App />);

    // The secret level should still be available
    const levelDropdown = screen.getByRole('button', { name: /current level/i });
    await act(async () => {
      fireEvent.click(levelDropdown);
    });

    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });

    expect(secretLevelUnlocked).toBe('true');
  });

  it('should not allow navigation to next level from secret level', async () => {
    // Set up secret level
    localStorage.setItem('secretLevelUnlocked', 'true');
    localStorage.setItem('currentLevel', '999');

    renderWithTheme(<App />);

    // Wait for the secret level to load
    await waitFor(() => {
      expect(screen.getByText(/Secret: !important Override Master/i)).toBeInTheDocument();
    });

    // Try to find next level button - it should either not exist or be disabled
    const nextButton = screen.queryByRole('button', { name: /next/i });
    if (nextButton) {
      expect(nextButton).toBeDisabled();
    }
  });
});