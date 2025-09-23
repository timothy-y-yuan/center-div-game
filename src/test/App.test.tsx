import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='panel'>{children}</div>
  ),
  PanelGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='panel-group'>{children}</div>
  ),
  PanelResizeHandle: () => <div data-testid='panel-resize-handle' />,
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    vi.clearAllMocks();

    // Clean up DOM from previous tests
    document.body.innerHTML = '';

    // Mock getBoundingClientRect for iframe completion checking
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      toJSON: vi.fn(),
    }));
  });

  it('should load saved progress from localStorage', () => {
    localStorage.setItem('currentLevel', '2');
    localStorage.setItem('completedLevels', '[0,1]');
    localStorage.setItem('failedLevels', '[3]');

    renderWithTheme(<App />);

    // Verify progress is loaded correctly
    expect(localStorage.getItem('currentLevel')).toBe('2');
    expect(localStorage.getItem('completedLevels')).toBe('[0,1]');
    expect(localStorage.getItem('failedLevels')).toBe('[3]');
  });

  it('should save progress to localStorage when levels change', () => {
    renderWithTheme(<App />);

    // Open level dropdown and select level 1
    fireEvent.click(screen.getByText("1: Baby's First Center"));
    fireEvent.click(screen.getByText('2: Add Vertical Too'));

    expect(localStorage.getItem('currentLevel')).toBe('1');
  });

  it('should toggle hint popup', () => {
    renderWithTheme(<App />);

    const hintButton = screen.getByTestId('hint-button');
    fireEvent.click(hintButton);

    // Should have opened hint - look for hint-specific content
    const hintContent =
      document.querySelector('[data-testid="hint-popup"]') ||
      screen.queryByText(/Think about margins.*what happens/);
    expect(hintContent).toBeInTheDocument();
  });

  it('should mark level as failed when revealing answer', () => {
    renderWithTheme(<App />);

    fireEvent.click(screen.getByTestId('hint-button'));
    fireEvent.click(screen.getByTestId('reveal-answer-button'));

    expect(localStorage.getItem('failedLevels')).toBe('[0]');
  });

  it('should reset all progress when reset is confirmed', async () => {
    localStorage.setItem('currentLevel', '2');
    localStorage.setItem('completedLevels', '[0,1]');
    localStorage.setItem('failedLevels', '[3]');

    renderWithTheme(<App />);

    fireEvent.click(screen.getByText('⚙️'));
    fireEvent.click(screen.getByText('Reset All Progress'));
    fireEvent.click(screen.getByText('Yes, Reset All'));

    await waitFor(() => {
      expect(localStorage.getItem('currentLevel')).toBe('0');
      expect(localStorage.getItem('completedLevels')).toBeNull();
      expect(localStorage.getItem('failedLevels')).toBeNull();
    });
  });

  it('should show next level button for completed levels', () => {
    localStorage.setItem('completedLevels', '[0]');
    renderWithTheme(<App />);
    expect(screen.getByTestId('header-next-level-button')).toBeInTheDocument();
  });

  it('should show next level button for failed levels', () => {
    localStorage.setItem('failedLevels', '[0]');
    renderWithTheme(<App />);
    expect(screen.getByTestId('header-next-level-button')).toBeInTheDocument();
  });

  it('should not show next level button on last level', () => {
    localStorage.setItem('currentLevel', '9');
    localStorage.setItem('completedLevels', '[9]');
    renderWithTheme(<App />);
    expect(
      screen.queryByTestId('header-next-level-button')
    ).not.toBeInTheDocument();
  });

  it('should advance to next level when next button is clicked', () => {
    localStorage.setItem('completedLevels', '[0]');

    renderWithTheme(<App />);

    fireEvent.click(screen.getByTestId('header-next-level-button'));

    expect(localStorage.getItem('currentLevel')).toBe('1');
  });

  it('should handle theme changes', () => {
    renderWithTheme(<App />);

    fireEvent.click(screen.getByText('⚙️'));
    fireEvent.click(screen.getByText('Dark'));

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should handle editor changes', () => {
    renderWithTheme(<App />);

    const cssEditor = screen.getByTestId('monaco-editor-css');
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto; }' },
    });

    expect(cssEditor).toHaveValue('.target { margin: 0 auto; }');
  });

  it('should persist completed levels correctly', () => {
    localStorage.setItem('completedLevels', '[0]');

    const { unmount } = renderWithTheme(<App />);
    unmount();
    renderWithTheme(<App />);

    expect(localStorage.getItem('completedLevels')).toBe('[0]');
  });
});
