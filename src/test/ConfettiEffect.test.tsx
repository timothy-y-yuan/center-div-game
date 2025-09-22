import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import ConfettiEffect from '../components/ConfettiEffect';

// Mock createPortal to render in place for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('ConfettiEffect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true,
    });

    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render confetti pieces when isVisible is true', () => {
    const { container } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    // Should create confetti container
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('should not render when isVisible is false', () => {
    const { container } = render(
      <ConfettiEffect isVisible={false} onComplete={vi.fn()} />
    );

    expect(container.querySelector('.fixed')).not.toBeInTheDocument();
  });

  it('should call onComplete after timeout', async () => {
    const mockOnComplete = vi.fn();
    render(<ConfettiEffect isVisible={true} onComplete={mockOnComplete} />);

    // Fast-forward time by 3 seconds wrapped in act
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should not call onComplete when isVisible is false', () => {
    const mockOnComplete = vi.fn();
    render(<ConfettiEffect isVisible={false} onComplete={mockOnComplete} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('should create multiple confetti pieces', () => {
    const { container } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    // Should have multiple confetti pieces
    const confettiPieces = container.querySelectorAll('.absolute');
    expect(confettiPieces.length).toBeGreaterThan(0);
  });

  it('should handle isVisible state changes', () => {
    const { container, rerender } = render(
      <ConfettiEffect isVisible={false} onComplete={vi.fn()} />
    );

    expect(container.querySelector('.fixed')).not.toBeInTheDocument();

    rerender(<ConfettiEffect isVisible={true} onComplete={vi.fn()} />);

    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('should clean up when isVisible becomes false', () => {
    const { container, rerender } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    expect(container.querySelector('.fixed')).toBeInTheDocument();

    rerender(<ConfettiEffect isVisible={false} onComplete={vi.fn()} />);

    expect(container.querySelector('.fixed')).not.toBeInTheDocument();
  });

  it('should handle missing onComplete callback', () => {
    expect(() => {
      render(<ConfettiEffect isVisible={true} />);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
    }).not.toThrow();
  });

  it('should clear timers on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should have proper styling classes', () => {
    const { container } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    const confettiContainer = container.querySelector('.fixed');
    expect(confettiContainer).toHaveClass(
      'fixed',
      'inset-0',
      'pointer-events-none',
      'z-[10000]',
      'overflow-hidden'
    );
  });

  it('should render both emoji and colored pieces', () => {
    const { container } = render(
      <ConfettiEffect isVisible={true} onComplete={vi.fn()} />
    );

    // Pieces should be created immediately when isVisible becomes true
    const pieces = container.querySelectorAll('.absolute');
    expect(pieces.length).toBe(50); // Component creates 50 pieces
  });
});
