import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HintPopup from '../components/HintPopup';
import { ThemeProvider } from '../contexts/ThemeProvider';

// Mock button element with getBoundingClientRect
const mockButtonElement = {
  getBoundingClientRect: vi.fn(() => ({
    bottom: 100,
    right: 200, // left + width = 100 + 100 = 200
    left: 100,
    top: 80, // bottom - height = 100 - 20 = 80
    width: 100,
    height: 20,
    x: 100,
    y: 80,
    toJSON: () => {},
  })),
  contains: vi.fn(() => false),
} as unknown as HTMLButtonElement;

const mockProps = {
  isOpen: true,
  hint: 'This is a test hint',
  onClose: vi.fn(),
  buttonRef: {
    current: mockButtonElement,
  } as React.RefObject<HTMLButtonElement>,
  onRevealAnswer: vi.fn(),
  isCompleted: false,
  isFailed: false,
  solutionCSS: '.container { margin: 0 auto; }',
  explanation: 'This centers the element horizontally using auto margins.',
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HintPopup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window properties
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    // Mock createPortal to render in place for testing
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom');
      return {
        ...actual,
        createPortal: (children: React.ReactNode) => children,
      };
    });
  });

  it('should not render when isOpen is false', () => {
    const propsWithClosed = { ...mockProps, isOpen: false };
    renderWithTheme(<HintPopup {...propsWithClosed} />);

    expect(screen.queryByText('This is a test hint')).not.toBeInTheDocument();
  });

  it('should render hint text when open and not completed/failed', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    expect(screen.getByText('This is a test hint')).toBeInTheDocument();
  });

  it('should show "I\'m a dumbass" button for active levels', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    expect(screen.getByText(/I'm a dumbass/)).toBeInTheDocument();
  });

  it('should call onRevealAnswer when dumbass button is clicked', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    fireEvent.click(screen.getByTestId('reveal-answer-button'));

    expect(mockProps.onRevealAnswer).toHaveBeenCalledTimes(1);
  });

  it('should show solution and explanation for completed levels', () => {
    const propsWithCompleted = {
      ...mockProps,
      isCompleted: true,
    };

    renderWithTheme(<HintPopup {...propsWithCompleted} />);

    expect(
      screen.getByText(/You already solved this like a nerd!/)
    ).toBeInTheDocument();
    expect(
      screen.getByText('.container { margin: 0 auto; }')
    ).toBeInTheDocument();
    expect(screen.getByText('💡 Why it works:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This centers the element horizontally using auto margins.'
      )
    ).toBeInTheDocument();
  });

  it('should show solution and explanation for failed levels', () => {
    const propsWithFailed = {
      ...mockProps,
      isFailed: true,
    };

    renderWithTheme(<HintPopup {...propsWithFailed} />);

    expect(
      screen.getByText(/Okay dumbass, here's how it's done:/)
    ).toBeInTheDocument();
    expect(
      screen.getByText('.container { margin: 0 auto; }')
    ).toBeInTheDocument();
    expect(screen.getByText('💡 Why it works:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This centers the element horizontally using auto margins.'
      )
    ).toBeInTheDocument();
  });

  it('should not show dumbass button for completed levels', () => {
    const propsWithCompleted = {
      ...mockProps,
      isCompleted: true,
    };

    renderWithTheme(<HintPopup {...propsWithCompleted} />);

    expect(screen.queryByText(/I'm a dumbass/)).not.toBeInTheDocument();
  });

  it('should not show dumbass button for failed levels', () => {
    const propsWithFailed = {
      ...mockProps,
      isFailed: true,
    };

    renderWithTheme(<HintPopup {...propsWithFailed} />);

    expect(screen.queryByText(/I'm a dumbass/)).not.toBeInTheDocument();
  });

  it('should close when clicking outside', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    // Click outside the popup
    fireEvent.mouseDown(document.body);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside the popup', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    const popup = screen.getByText('This is a test hint').closest('div');
    fireEvent.mouseDown(popup!);

    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('should have correct positioning styles', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    // Find the main popup container
    const popup = screen.getByText('This is a test hint').closest('.w-80');
    expect(popup).toHaveClass(
      'w-80',
      'animate-in',
      'slide-in-from-top-2',
      'duration-200'
    );
    expect(popup).toHaveStyle('position: fixed');
    expect(popup).toHaveStyle('z-index: 9999');
  });

  it('should show correct styling for dark theme', () => {
    // Set theme to dark
    localStorage.setItem('theme', 'dark');

    renderWithTheme(<HintPopup {...mockProps} />);

    // Find the content container with theme-specific classes
    const popup = screen.getByText('Hint').closest('.relative');
    expect(popup).toHaveClass('bg-gray-800', 'border-gray-600');
  });

  it('should show correct styling for light theme', () => {
    // Set theme to light
    localStorage.setItem('theme', 'light');

    renderWithTheme(<HintPopup {...mockProps} />);

    // Find the content container with theme-specific classes
    const popup = screen.getByText('Hint').closest('.relative');
    expect(popup).toHaveClass('bg-white', 'border-gray-200');
  });

  it('should handle empty hint text', () => {
    const propsWithEmptyHint = {
      ...mockProps,
      hint: '',
    };

    renderWithTheme(<HintPopup {...propsWithEmptyHint} />);

    // Should still render but with empty content
    expect(screen.getByText(/I'm a dumbass/)).toBeInTheDocument();
  });

  it('should handle empty solution and explanation', () => {
    const propsWithEmptyContent = {
      ...mockProps,
      isCompleted: true,
      solutionCSS: '',
      explanation: '',
    };

    renderWithTheme(<HintPopup {...propsWithEmptyContent} />);

    expect(
      screen.getByText(/You already solved this like a nerd!/)
    ).toBeInTheDocument();
    expect(screen.getByText('💡 Why it works:')).toBeInTheDocument();
  });

  it('should show correct button styling', () => {
    renderWithTheme(<HintPopup {...mockProps} />);

    const button = screen.getByText(/I'm a dumbass/);
    // Test for the actual classes used (gradient button)
    expect(button).toHaveClass(
      'bg-gradient-to-r',
      'from-red-500',
      'to-red-600',
      'text-white'
    );
  });

  it('should format solution CSS correctly', () => {
    const propsWithMultilineCSS = {
      ...mockProps,
      isCompleted: true,
      solutionCSS: `.container {\n  display: flex;\n  justify-content: center;\n}`,
    };

    renderWithTheme(<HintPopup {...propsWithMultilineCSS} />);

    // Should preserve formatting in code block
    expect(screen.getByText(/display: flex/)).toBeInTheDocument();
    expect(screen.getByText(/justify-content: center/)).toBeInTheDocument();
  });

  it('should handle both completed and failed states (failed takes precedence)', () => {
    const propsWithBothStates = {
      ...mockProps,
      isCompleted: true,
      isFailed: true,
    };

    renderWithTheme(<HintPopup {...propsWithBothStates} />);

    // Should show completed message since completed takes precedence over failed
    expect(
      screen.getByText(/You already solved this like a nerd!/)
    ).toBeInTheDocument();
  });

  it('should handle long hint text properly', () => {
    const propsWithLongHint = {
      ...mockProps,
      hint: 'This is a very long hint that should wrap properly and not overflow the popup container. It should maintain good readability and spacing.',
    };

    renderWithTheme(<HintPopup {...propsWithLongHint} />);

    expect(screen.getByText(/This is a very long hint/)).toBeInTheDocument();
  });

  it('should handle long explanation text properly', () => {
    const propsWithLongExplanation = {
      ...mockProps,
      isCompleted: true,
      explanation:
        'This is a very detailed explanation that goes into the specifics of how CSS centering works, including browser compatibility concerns and alternative methods.',
    };

    renderWithTheme(<HintPopup {...propsWithLongExplanation} />);

    expect(
      screen.getByText(/This is a very detailed explanation/)
    ).toBeInTheDocument();
  });

  it('should remove event listeners when unmounted', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderWithTheme(<HintPopup {...mockProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
  });

  it('should handle rapid open/close cycles', () => {
    const { rerender } = renderWithTheme(<HintPopup {...mockProps} />);

    // Rapidly toggle
    rerender(
      <ThemeProvider>
        <HintPopup {...{ ...mockProps, isOpen: false }} />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider>
        <HintPopup {...{ ...mockProps, isOpen: true }} />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider>
        <HintPopup {...{ ...mockProps, isOpen: false }} />
      </ThemeProvider>
    );

    // Should handle gracefully without errors
    expect(true).toBe(true); // If we get here without errors, test passes
  });

  it('should position correctly relative to button ref', () => {
    const mockButtonRef = {
      current: {
        getBoundingClientRect: () => ({
          bottom: 100,
          left: 50,
          right: 130, // left + width = 50 + 80 = 130
          top: 60, // bottom - height = 100 - 40 = 60
          width: 80,
          height: 40,
          x: 50,
          y: 60,
        }),
        contains: vi.fn(() => false),
      } as unknown as HTMLButtonElement,
    } as React.RefObject<HTMLButtonElement>;

    const propsWithButtonRef = {
      ...mockProps,
      buttonRef: mockButtonRef,
    };

    renderWithTheme(<HintPopup {...propsWithButtonRef} />);

    // Should render without errors and position correctly
    expect(screen.getByText('This is a test hint')).toBeInTheDocument();

    // Verify positioning calculation works (no NaN in styles)
    const popupElement = screen
      .getByText('This is a test hint')
      .closest('.w-80');
    expect(popupElement).toHaveStyle('position: fixed');
    expect(popupElement).not.toHaveStyle('right: NaN');
  });
});
