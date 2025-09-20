import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LevelDropdown from '../components/LevelDropdown'
import { ThemeProvider } from '../contexts/ThemeContext'
import { levels } from '../data/levels'

const mockProps = {
  levels,
  currentLevelIndex: 0,
  completedLevels: new Set<number>(),
  failedLevels: new Set<number>(),
  onLevelSelect: vi.fn(),
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('LevelDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock createPortal to render in place for testing
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom')
      return {
        ...actual,
        createPortal: (children: any) => children
      }
    })
  })

  it('should render the current level title', () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    expect(screen.getByText('1: Baby\'s First Center')).toBeInTheDocument()
  })

  it('should show level title in normal color when not completed or failed', () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const titleElement = screen.getByText('1: Baby\'s First Center')
    expect(titleElement).toHaveClass('text-gray-800', 'dark:text-white')
  })

  it('should show level title in green when completed', () => {
    const propsWithCompleted = {
      ...mockProps,
      completedLevels: new Set([0])
    }

    renderWithTheme(<LevelDropdown {...propsWithCompleted} />)

    const titleElement = screen.getByText('1: Baby\'s First Center')
    expect(titleElement).toHaveClass('text-emerald-600', 'dark:text-emerald-400')
  })

  it('should show level title in red when failed', () => {
    const propsWithFailed = {
      ...mockProps,
      failedLevels: new Set([0])
    }

    renderWithTheme(<LevelDropdown {...propsWithFailed} />)

    const titleElement = screen.getByText('1: Baby\'s First Center')
    expect(titleElement).toHaveClass('text-red-600', 'dark:text-red-400')
  })

  it('should show celebration emoji when completed', () => {
    const propsWithCompleted = {
      ...mockProps,
      completedLevels: new Set([0])
    }

    renderWithTheme(<LevelDropdown {...propsWithCompleted} />)

    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('should show sad emoji when failed', () => {
    const propsWithFailed = {
      ...mockProps,
      failedLevels: new Set([0])
    }

    renderWithTheme(<LevelDropdown {...propsWithFailed} />)

    expect(screen.getByText('😭')).toBeInTheDocument()
  })

  it('should open dropdown when clicked', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Should show all levels
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument()
      expect(screen.getByText('3: Grid Power')).toBeInTheDocument()
    })
  })

  it('should close dropdown when clicking outside', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument()
    })

    // Click outside
    fireEvent.mouseDown(document.body)

    await waitFor(() => {
      expect(screen.queryByText('2: Add Vertical Too')).not.toBeInTheDocument()
    })
  })

  it('should call onLevelSelect when level is selected', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('2: Add Vertical Too'))

    expect(mockProps.onLevelSelect).toHaveBeenCalledWith(1)
  })

  it('should close dropdown after selecting a level', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('2: Add Vertical Too'))

    await waitFor(() => {
      expect(screen.queryByText('2: Add Vertical Too')).not.toBeInTheDocument()
    })
  })

  it('should show current level indicator in dropdown', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Current level should have checkmark
      const checkmarks = screen.getAllByText('✓') // svg renders as ✓ in testing
      expect(checkmarks.length).toBeGreaterThan(0)
    })
  })

  it('should show correct status icons in dropdown for each level', async () => {
    const propsWithMixedStatus = {
      ...mockProps,
      currentLevelIndex: 2,
      completedLevels: new Set([0, 1]),
      failedLevels: new Set([3])
    }

    renderWithTheme(<LevelDropdown {...propsWithMixedStatus} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Should show celebration emojis for completed levels
      const celebrationEmojis = screen.getAllByText('🎉')
      expect(celebrationEmojis).toHaveLength(2) // Two completed levels

      // Should show sad emoji for failed level
      expect(screen.getByText('😭')).toBeInTheDocument()
    })
  })

  it('should show colored level titles in dropdown', async () => {
    const propsWithMixedStatus = {
      ...mockProps,
      completedLevels: new Set([0]),
      failedLevels: new Set([1])
    }

    renderWithTheme(<LevelDropdown {...propsWithMixedStatus} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Find the level titles and check their colors
      const level1Title = screen.getByText('1: Baby\'s First Center')
      const level2Title = screen.getByText('2: Add Vertical Too')

      expect(level1Title).toHaveClass('text-emerald-600', 'dark:text-emerald-400')
      expect(level2Title).toHaveClass('text-red-600', 'dark:text-red-400')
    })
  })

  it('should show scroll indicator when there are many levels', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Should show scroll indicator since we have 10 levels (> 6)
      const scrollIcon = screen.getByText('⌄') // Simplified representation
      expect(scrollIcon).toBeInTheDocument()
    })
  })

  it('should rotate dropdown arrow when open', () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    const arrow = button.querySelector('svg')

    expect(arrow).not.toHaveClass('rotate-180')

    fireEvent.click(button)

    expect(arrow).toHaveClass('rotate-180')
  })

  it('should handle keyboard navigation', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('2: Add Vertical Too')).toBeInTheDocument()
    })

    // Test escape key closes dropdown
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('2: Add Vertical Too')).not.toBeInTheDocument()
    })
  })

  it('should show level descriptions in dropdown', async () => {
    renderWithTheme(<LevelDropdown {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      // Should show level descriptions
      expect(screen.getByText(/Center the green/)).toBeInTheDocument()
    })
  })

  it('should handle empty completed and failed sets', () => {
    const propsWithEmptySets = {
      ...mockProps,
      completedLevels: new Set<number>(),
      failedLevels: new Set<number>()
    }

    renderWithTheme(<LevelDropdown {...propsWithEmptySets} />)

    // Should not show any status emojis
    expect(screen.queryByText('🎉')).not.toBeInTheDocument()
    expect(screen.queryByText('😭')).not.toBeInTheDocument()
  })

  it('should handle different current level indices', () => {
    const propsWithDifferentLevel = {
      ...mockProps,
      currentLevelIndex: 5
    }

    renderWithTheme(<LevelDropdown {...propsWithDifferentLevel} />)

    expect(screen.getByText('6: Table Cell Vibes')).toBeInTheDocument()
  })
})