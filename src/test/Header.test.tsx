import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'
import { levels } from '../data/levels'

// Mock the ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    actualTheme: 'light'
  })
}))

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
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the game title', () => {
    render(<Header {...mockProps} />)
    expect(screen.getByText(/Can You Center The/)).toBeInTheDocument()
  })

  it('should display initial player title for no completed levels', () => {
    render(<Header {...mockProps} />)
    expect(screen.getByText('0.001x Engineer')).toBeInTheDocument()
  })

  it('should display correct player title for completed levels', () => {
    const propsWithCompleted = {
      ...mockProps,
      completedLevels: new Set([0, 1]) // 2 completed levels
    }
    render(<Header {...propsWithCompleted} />)
    expect(screen.getByText('Stack Overflow Searcher')).toBeInTheDocument()
  })

  it('should show correct progress stats', () => {
    const propsWithProgress = {
      ...mockProps,
      completedLevels: new Set([0, 1, 2]), // 3 completed
      failedLevels: new Set([3, 4]) // 2 failed
    }
    render(<Header {...propsWithProgress} />)

    // Should show: 🎉 3 • 😭 2 • 5 left (10 total - 3 completed - 2 failed = 5 remaining)
    expect(screen.getByText(/🎉 3 • 😭 2 • 5 left/)).toBeInTheDocument()
  })

  it('should render current level description', () => {
    render(<Header {...mockProps} />)
    expect(screen.getByText(levels[0].description)).toBeInTheDocument()
  })

  it('should call onCheck when check button is clicked', () => {
    render(<Header {...mockProps} />)
    const checkButton = screen.getByText('Check')
    fireEvent.click(checkButton)
    expect(mockProps.onCheck).toHaveBeenCalledTimes(1)
  })

  it('should call onToggleHint when hint button is clicked', () => {
    render(<Header {...mockProps} />)
    const hintButton = screen.getByText('Hint')
    fireEvent.click(hintButton)
    expect(mockProps.onToggleHint).toHaveBeenCalledTimes(1)
  })

  it('should show hint button as active when hint is open', () => {
    const propsWithHint = { ...mockProps, showHint: true }
    render(<Header {...propsWithHint} />)
    const hintButton = screen.getByText('Hint').closest('button')
    expect(hintButton).toHaveClass('bg-amber-500')
  })

  it('should show hint button as inactive when hint is closed', () => {
    render(<Header {...mockProps} />)
    const hintButton = screen.getByText('Hint').closest('button')
    expect(hintButton).toHaveClass('bg-amber-600')
  })

  it('should display progress bar with correct proportions', () => {
    const propsWithProgress = {
      ...mockProps,
      completedLevels: new Set([0, 1]), // 2 completed = 20%
      failedLevels: new Set([2]) // 1 failed = 10%
    }
    render(<Header {...propsWithProgress} />)

    // Check for progress bar elements (looking for style attributes)
    const progressElements = document.querySelectorAll('[style*="width"]')
    const completedBar = Array.from(progressElements).find(el =>
      el.getAttribute('style')?.includes('20%')
    )
    const failedBar = Array.from(progressElements).find(el =>
      el.getAttribute('style')?.includes('10%')
    )

    expect(completedBar).toBeTruthy()
    expect(failedBar).toBeTruthy()
  })

  it('should render settings dropdown', () => {
    render(<Header {...mockProps} />)
    expect(screen.getByText('⚙️')).toBeInTheDocument()
  })

  it('should render level dropdown with current level', () => {
    render(<Header {...mockProps} />)
    expect(screen.getByText(levels[0].title)).toBeInTheDocument()
  })
})