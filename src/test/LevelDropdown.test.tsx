import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LevelDropdown from '../components/LevelDropdown';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { levels } from '../data/levels';

const mockProps = {
  levels,
  currentLevelIndex: 0,
  completedLevels: new Set<number>(),
  failedLevels: new Set<number>(),
  onLevelSelect: vi.fn(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('LevelDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock createPortal to render in place for testing
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom');
      return {
        ...actual,
        createPortal: (children: React.ReactNode) => children,
      };
    });
  });

  it('should render current level title with status colors and emojis', () => {
    // Test normal state
    const { rerender } = renderWithTheme(<LevelDropdown {...mockProps} />);
    expect(screen.getByText("1: Baby's First Center")).toBeInTheDocument();
    const normalTitle = screen.getByText("1: Baby's First Center");
    expect(normalTitle).toHaveClass('text-gray-800', 'dark:text-white');

    // Test completed state
    rerender(
      <ThemeProvider>
        <LevelDropdown {...mockProps} completedLevels={new Set([0])} />
      </ThemeProvider>
    );
    const completedTitle = screen.getAllByText("1: Baby's First Center")[0];
    expect(completedTitle).toHaveClass(
      'text-emerald-600',
      'dark:text-emerald-400'
    );
    expect(screen.getByText('🎉')).toBeInTheDocument();

    // Test failed state
    rerender(
      <ThemeProvider>
        <LevelDropdown {...mockProps} failedLevels={new Set([0])} />
      </ThemeProvider>
    );
    const failedTitle = screen.getAllByText("1: Baby's First Center")[0];
    expect(failedTitle).toHaveClass('text-red-600', 'dark:text-red-400');
    expect(screen.getByText('😭')).toBeInTheDocument();
  });

  it('should handle dropdown interactions and level selection', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />);

    const button = screen.getByRole('button');
    const arrow = button.querySelector('svg');

    // Test dropdown opens and arrow rotates
    expect(arrow).not.toHaveClass('rotate-180');
    fireEvent.click(button);
    expect(arrow).toHaveClass('rotate-180');

    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument();
      expect(screen.getByText('3: Grid Power')).toBeInTheDocument();
    });

    // Test level selection
    fireEvent.click(screen.getByText('2: Add Vertical Too'));
    expect(mockProps.onLevelSelect).toHaveBeenCalledWith(1);

    // Test dropdown closes after selection
    await waitFor(() => {
      expect(screen.queryByText('2: Add Vertical Too')).not.toBeInTheDocument();
    });

    // Test clicking outside closes dropdown
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument();
    });
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('2: Add Vertical Too')).not.toBeInTheDocument();
    });
  });

  it('should display mixed status indicators in dropdown', async () => {
    const propsWithMixedStatus = {
      ...mockProps,
      currentLevelIndex: 2,
      completedLevels: new Set([0, 1]),
      failedLevels: new Set([3]),
    };

    renderWithTheme(<LevelDropdown {...propsWithMixedStatus} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // Should show celebration emojis for completed levels
      const celebrationEmojis = screen.getAllByText('🎉');
      expect(celebrationEmojis).toHaveLength(2); // Two completed levels

      // Should show sad emoji for failed level
      expect(screen.getByText('😭')).toBeInTheDocument();

      // Check colored level titles in dropdown
      const level1Titles = screen.getAllByText("1: Baby's First Center");
      const level2Title = screen.getByText('2: Add Vertical Too');

      // Find the dropdown occurrence (should be the last one)
      const level1Title = level1Titles[level1Titles.length - 1];

      expect(level1Title).toHaveClass(
        'text-emerald-600',
        'dark:text-emerald-400'
      );
      expect(level2Title).toHaveClass(
        'text-emerald-600',
        'dark:text-emerald-400'
      );

      // Check current level indicator (checkmark)
      const checkmarkPath = document.querySelector('path[d*="16.707 5.293"]'); // Checkmark path
      expect(checkmarkPath).toBeInTheDocument();

      // Should show level descriptions
      expect(
        screen.getByText(/Center this div horizontally using margins/)
      ).toBeInTheDocument();
    });
  });

  it('should show scroll indicator for many levels', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // Should show scroll indicator since we have 10 levels (> 6) - look for the SVG
      const scrollIcon = document.querySelector('svg.animate-bounce'); // Bouncing down arrow
      expect(scrollIcon).toBeInTheDocument();
    });
  });

  it('should handle different level indices and empty status sets', () => {
    const propsWithDifferentLevel = {
      ...mockProps,
      currentLevelIndex: 5,
      completedLevels: new Set<number>(),
      failedLevels: new Set<number>(),
    };

    renderWithTheme(<LevelDropdown {...propsWithDifferentLevel} />);

    expect(screen.getByText('6: Table Cell Vibes')).toBeInTheDocument();
    // Should not show any status emojis
    expect(screen.queryByText('🎉')).not.toBeInTheDocument();
    expect(screen.queryByText('😭')).not.toBeInTheDocument();
  });
});
