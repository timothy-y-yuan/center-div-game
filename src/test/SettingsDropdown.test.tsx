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

  it('should render settings button with gear icon', () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('should open dropdown when settings button is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('⚙️ Settings')).toBeInTheDocument();
      expect(screen.getByText('🎨 Theme')).toBeInTheDocument();
      expect(screen.getByText('🔄 Actions')).toBeInTheDocument();
      expect(screen.getByText('👨‍💻 Credits')).toBeInTheDocument();
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

  it('should show all theme options', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText(/Auto \(/)).toBeInTheDocument();
    });
  });

  it('should show correct theme icons', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('☀️')).toBeInTheDocument(); // Light
      expect(screen.getByText('🌙')).toBeInTheDocument(); // Dark
      expect(screen.getByText('🌓')).toBeInTheDocument(); // Auto
    });
  });

  it('should show system preference in Auto theme label', async () => {
    // Mock dark system preference
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

    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Auto (dark)')).toBeInTheDocument();
    });
  });

  it('should show light system preference in Auto label', async () => {
    // Mock light system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Auto (light)')).toBeInTheDocument();
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

  it('should show checkmark for selected theme', async () => {
    // Set theme to dark first
    localStorage.setItem('theme', 'dark');

    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      // Should show checkmark next to Dark theme (with dark theme classes when theme is dark)
      const darkButton = screen.getByText('Dark').closest('button');
      expect(darkButton).toHaveClass('bg-blue-900/50', 'text-blue-300');
    });
  });

  it('should show reset progress button', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
      expect(screen.getByText('🗑️')).toBeInTheDocument();
    });
  });

  it('should show confirmation dialog when reset is clicked', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('Reset All Progress')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset All Progress'));

    await waitFor(() => {
      expect(screen.getByText('⚠️ Are you sure?')).toBeInTheDocument();
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

  it('should show credits section', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      expect(screen.getByText('👨‍💻 Credits')).toBeInTheDocument();
      expect(
        screen.getByText(/Game Design & Development:/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Timothy/)).toBeInTheDocument();
      expect(
        screen.getByText(/React, TypeScript, Tailwind CSS/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Monaco Editor/)).toBeInTheDocument();
      expect(screen.getByText(/Claude \(Anthropic\)/)).toBeInTheDocument();
      expect(
        screen.getByText(/Vibe coded with Claude Code/)
      ).toBeInTheDocument();
    });
  });

  it('should rotate dropdown arrow when open', () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    const button = screen.getByRole('button');
    const arrow = button.querySelector('svg');

    expect(arrow).not.toHaveClass('rotate-180');

    fireEvent.click(button);

    expect(arrow).toHaveClass('rotate-180');
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

  it('should show different styling for dark and light themes', async () => {
    // Test with dark theme
    localStorage.setItem('theme', 'dark');

    renderWithTheme(<SettingsDropdown {...mockProps} />);

    fireEvent.click(screen.getByText('⚙️'));

    await waitFor(() => {
      // Find the dropdown container (not the header div)
      const dropdown = screen.getByText('⚙️ Settings').closest('.fixed');
      expect(dropdown).toHaveClass('bg-gray-800', 'border-gray-600');
    });
  });

  it('should handle rapid opening and closing', async () => {
    renderWithTheme(<SettingsDropdown {...mockProps} />);

    // Rapidly open and close
    fireEvent.click(screen.getByText('⚙️'));
    fireEvent.click(screen.getByText('⚙️'));
    fireEvent.click(screen.getByText('⚙️'));

    // Should handle it gracefully without errors
    expect(screen.getByText('⚙️')).toBeInTheDocument();
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
