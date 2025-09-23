import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsDropdown from '../components/SettingsDropdown';
import { ThemeProvider } from '../contexts/ThemeProvider';

const mockProps = {
  onResetProgress: vi.fn(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SettingsDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock createPortal to render in place for testing
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom');
      return {
        ...actual,
        createPortal: (children: React.ReactNode) => children,
      };
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should open dropdown when settings button is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
    });
  });

  it('should close dropdown when clicking outside', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('⚙️ Settings')).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('⚙️ Settings')).not.toBeInTheDocument();
    });
  });

  it('should change theme when theme option is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Dark'));

    // Should save to localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should show confirmation dialog when reset is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset All Progress'));

    await waitFor(() => {
      expect(screen.getByText('Yes, Reset All')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('should call onResetProgress when confirmed', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Reset All Progress'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Yes, Reset All'));
    });

    expect(mockProps.onResetProgress).toHaveBeenCalledTimes(1);
  });

  it('should cancel reset when Cancel is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Reset All Progress'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    await waitFor(() => {
      // Should go back to normal reset button
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
      expect(screen.queryByText('⚠️ Are you sure?')).not.toBeInTheDocument();
    });

    expect(mockProps.onResetProgress).not.toHaveBeenCalled();
  });

  it('should close dropdown after confirming reset', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Reset All Progress'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Yes, Reset All'));
    });

    await waitFor(() => {
      expect(screen.queryByText('⚙️ Settings')).not.toBeInTheDocument();
    });
  });

  it('should handle theme changes correctly', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    // Test switching to light theme
    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Light'));
    });

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should reset confirmation state when dropdown closes', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Reset All Progress'));
    });

    await waitFor(() => {
      expect(screen.getByText('⚠️ Are you sure?')).toBeInTheDocument();
    });

    // Close dropdown by clicking outside
    fireEvent.mouseDown(document.body);

    // Reopen dropdown
    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      // Should be back to normal state
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
      expect(screen.queryByText('⚠️ Are you sure?')).not.toBeInTheDocument();
    });
  });
});
