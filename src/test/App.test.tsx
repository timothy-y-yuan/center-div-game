import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock monaco editor
vi.mock('@monaco-editor/react', () => ({
  default: ({
    onChange,
    value,
  }: {
    onChange?: (value: string) => void;
    value?: string;
  }) => (
    <textarea
      data-testid='monaco-editor'
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  ),
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

  it('should render the main game interface', () => {
    renderWithTheme(<App />);

    expect(screen.getByText(/Can You Center The/)).toBeInTheDocument();
    expect(screen.getAllByTestId('monaco-editor')).toHaveLength(1); // CSS editor only
    expect(screen.getByText('Given Code')).toBeInTheDocument(); // CodeDisplay component
    expect(screen.getByText('Your Code')).toBeInTheDocument(); // CSS editor
    expect(screen.getByText('Check')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
  });

  it('should initialize with level 0', () => {
    renderWithTheme(<App />);

    expect(screen.getByText("1: Baby's First Center")).toBeInTheDocument();
    expect(screen.getByText('0.001x Engineer')).toBeInTheDocument();
  });

  it('should load saved progress from localStorage', () => {
    // Set localStorage data BEFORE rendering the component
    localStorage.setItem('currentLevel', '2');
    localStorage.setItem('completedLevels', '[0,1]');
    localStorage.setItem('failedLevels', '[3]');

    renderWithTheme(<App />);

    // Should start at level 2 with 2 completed levels
    expect(screen.getByText('3: Grid Power')).toBeInTheDocument();
    expect(screen.getByText(/🎉 2 • 😭 1/)).toBeInTheDocument();
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

    const hintButton = screen.getByText('Hint');
    fireEvent.click(hintButton);

    // Hint should be visible
    expect(screen.getByText(/Think about margins/)).toBeInTheDocument();

    fireEvent.click(hintButton);

    // Hint should be hidden
    expect(screen.queryByText(/Think about margins/)).not.toBeInTheDocument();
  });

  it('should mark level as failed when revealing answer', () => {
    renderWithTheme(<App />);

    // Open hint
    fireEvent.click(screen.getByText('Hint'));

    // Click "I'm a dumbass" button
    fireEvent.click(screen.getByText(/I'm a dumbass/));

    // Should show in failed levels
    expect(screen.getByText(/😭 1/)).toBeInTheDocument();

    // Should save to localStorage
    expect(localStorage.getItem('failedLevels')).toBe('[0]');
  });

  it('should reset all progress when reset is confirmed', async () => {
    // Set up some progress
    localStorage.setItem('currentLevel', '2');
    localStorage.setItem('completedLevels', '[0,1]');
    localStorage.setItem('failedLevels', '[3]');

    renderWithTheme(<App />);

    // Open settings dropdown
    fireEvent.click(screen.getByText('⚙️'));

    // Click reset progress
    fireEvent.click(screen.getByText('Reset All Progress'));

    // Confirm reset
    fireEvent.click(screen.getByText('Yes, Reset All'));

    // Should be back to initial state
    await waitFor(() => {
      expect(screen.getByText("1: Baby's First Center")).toBeInTheDocument();
      expect(screen.getByText('0.001x Engineer')).toBeInTheDocument();
      expect(screen.getByText(/🎉 0 • 😭 0/)).toBeInTheDocument();
    });

    // Should reset localStorage to initial state
    expect(localStorage.getItem('currentLevel')).toBe('0');
    expect(localStorage.getItem('completedLevels')).toBeNull();
    expect(localStorage.getItem('failedLevels')).toBeNull();
  });

  it('should show next level button when level is completed', () => {
    // Mock completion by setting up completed state
    localStorage.setItem('completedLevels', '[0]');

    renderWithTheme(<App />);

    // Should show next level button
    expect(screen.getByText('Next Level')).toBeInTheDocument();
  });

  it('should show next level button when level is failed', () => {
    // Mock failure by setting up failed state
    localStorage.setItem('failedLevels', '[0]');

    renderWithTheme(<App />);

    // Should show next level button
    expect(screen.getByText('Next Level')).toBeInTheDocument();
  });

  it('should not show next level button on last level', () => {
    // Go to last level (level 9) and mark as completed
    localStorage.setItem('currentLevel', '9');
    localStorage.setItem('completedLevels', '[9]');

    renderWithTheme(<App />);

    // Should not show next level button
    expect(screen.queryByText('Next Level')).not.toBeInTheDocument();
  });

  it('should advance to next level when next button is clicked', () => {
    localStorage.setItem('completedLevels', '[0]');

    renderWithTheme(<App />);

    // Click next level
    fireEvent.click(screen.getByText('Next Level'));

    // Should advance to level 1
    expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument();
    expect(localStorage.getItem('currentLevel')).toBe('1');
  });

  it('should update CSS editor when level changes', () => {
    renderWithTheme(<App />);

    // Check level has been loaded
    expect(screen.getByText("1: Baby's First Center")).toBeInTheDocument();

    // Change level
    fireEvent.click(screen.getByText("1: Baby's First Center"));
    fireEvent.click(screen.getByText('2: Add Vertical Too'));

    // Check level changed
    expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument();
  });

  it('should handle theme changes', () => {
    renderWithTheme(<App />);

    // Open settings
    fireEvent.click(screen.getByText('⚙️'));

    // Click dark theme
    fireEvent.click(screen.getByText('Dark'));

    // Theme should be applied (we can't easily test DOM classes in jsdom, but localStorage should be set)
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should show correct player titles based on completed levels', () => {
    const testCases = [
      { completed: 0, title: '0.001x Engineer' },
      { completed: 1, title: 'Copy-Paste Rookie' },
      { completed: 2, title: 'Stack Overflow Searcher' },
      { completed: 5, title: 'CSS Semicolon Forgetter' },
      { completed: 10, title: 'CSS Ninja' },
    ];

    testCases.forEach(({ completed, title }) => {
      localStorage.clear();
      if (completed > 0) {
        const completedArray = Array.from({ length: completed }, (_, i) => i);
        localStorage.setItem('completedLevels', JSON.stringify(completedArray));
      }

      const { unmount } = renderWithTheme(<App />);
      expect(screen.getByText(title)).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle editor changes', () => {
    renderWithTheme(<App />);

    const editors = screen.getAllByTestId('monaco-editor');
    const cssEditor = editors[0]; // CSS is the only Monaco editor now
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto; }' },
    });

    expect(cssEditor).toHaveValue('.target { margin: 0 auto; }');
  });

  it('should persist completed levels correctly', () => {
    renderWithTheme(<App />);

    // Mock a level completion by directly manipulating the component's completion check
    // This would normally happen through the iframe completion logic
    localStorage.setItem('completedLevels', '[0]');

    // Reload app
    const { unmount } = renderWithTheme(<App />);
    unmount();
    renderWithTheme(<App />);

    // Should maintain completed state
    expect(screen.getByText(/🎉 1/)).toBeInTheDocument();
  });
});
