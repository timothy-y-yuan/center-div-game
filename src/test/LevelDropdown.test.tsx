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
});
