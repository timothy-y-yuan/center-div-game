import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';
import { levels } from '../data/levels';

// Mock the useTheme hook
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    actualTheme: 'light',
  }),
}));

const mockProps = {
  levels,
  currentLevelIndex: 0,
  completedLevels: new Set<number>(),
  failedLevels: new Set<number>(),
  showHint: false,
  onToggleHint: vi.fn(),
  onCheck: vi.fn(),
  onLevelSelect: vi.fn(),
  onRevealAnswer: vi.fn(),
  onResetProgress: vi.fn(),
  onNextLevel: vi.fn(),
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onCheck when check button is clicked', () => {
    render(<Header {...mockProps} />);
    const checkButton = screen.getByTestId('check-button');
    fireEvent.click(checkButton);
    expect(mockProps.onCheck).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleHint when hint button is clicked', () => {
    render(<Header {...mockProps} />);
    const hintButton = screen.getByTestId('hint-button');
    fireEvent.click(hintButton);
    expect(mockProps.onToggleHint).toHaveBeenCalledTimes(1);
  });
});
