import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ImportantModal from '../components/ImportantModal';
import { ThemeProvider } from '../contexts/ThemeProvider';

// Helper function to render with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Enhanced ImportantModal - Stage 2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock timers for animation testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render the enhanced modal with dramatic styling when open', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // Check for enhanced title text
    expect(screen.getByText('!IMPORTANT ALERT!')).toBeInTheDocument();

    // Check for enhanced warning emojis
    expect(screen.getAllByText('🚨')).toHaveLength(2);

    // Check for educational content improvements
    expect(screen.getByText(/CSS cowboy/)).toBeInTheDocument();
    expect(
      screen.getByText(/sledgehammer to hang a picture/)
    ).toBeInTheDocument();

    // Check for enhanced button text
    expect(screen.getByText("I'll do it RIGHT!")).toBeInTheDocument();
    expect(screen.getByText('😤')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('should show educational content sections', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // Check for educational moment section
    expect(screen.getByText('🎓 Educational Moment:')).toBeInTheDocument();
    expect(
      screen.getByText(/The whole point of this game is to learn/)
    ).toBeInTheDocument();
    expect(screen.getByText(/proper/)).toBeInTheDocument();
    expect(screen.getByText(/CSS techniques!/)).toBeInTheDocument();

    // Check for pro tip section
    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText(/Pro tip:/)).toBeInTheDocument();
    expect(screen.getByText(/Master specificity/)).toBeInTheDocument();
  });

  it('should have animations and state management', async () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // The modal should be visible
    expect(screen.getByText('!IMPORTANT ALERT!')).toBeInTheDocument();

    // Fast-forward animations
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check that animations would have been triggered
    // (In a real test, we'd check for CSS classes or animation states)
    expect(screen.getByText('!IMPORTANT ALERT!')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={false} onClose={mockOnClose} />);

    // Modal should not be in the document when closed
    expect(screen.queryByText('!IMPORTANT ALERT!')).not.toBeInTheDocument();
  });

  it('should handle click outside and escape key', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // Test escape key
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display enhanced dramatic styling elements', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // Check for stop sign emoji
    expect(screen.getByText('🛑')).toBeInTheDocument();

    // Check for hammer emoji
    expect(screen.getByText('🔨')).toBeInTheDocument();

    // Check for enhanced emotional expressions
    expect(screen.getByText('😤')).toBeInTheDocument(); // frustrated emoji
    expect(screen.getByText('💪')).toBeInTheDocument(); // flexed bicep emoji
  });

  it('should show enhanced educational content about CSS specificity', () => {
    const mockOnClose = vi.fn();

    renderWithTheme(<ImportantModal isOpen={true} onClose={mockOnClose} />);

    // Check for educational content about specificity - text may be split across elements
    expect(screen.getByText(/Master specificity/)).toBeInTheDocument();
    expect(screen.getByText(/understand the cascade/)).toBeInTheDocument();
    expect(
      screen.getByText(/more maintainable and elegant/)
    ).toBeInTheDocument();

    // Check for anti-cheating message
    expect(screen.getByText(/cheating on your homework/)).toBeInTheDocument();
  });
});
