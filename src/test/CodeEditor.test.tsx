import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeEditor from '../components/CodeEditor'
import { ThemeProvider } from '../contexts/ThemeContext.tsx'

// Mock Monaco Editor
const mockOnChange = vi.fn()

vi.mock('@monaco-editor/react', () => ({
  default: ({ onChange, value, options }: { 
    onChange?: (value: string) => void; 
    value?: string; 
    options?: { readOnly?: boolean; language?: string } 
  }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={options?.readOnly}
      placeholder={options?.language}
    />
  )
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('CodeEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Monaco editor with HTML language', () => {
    renderWithTheme(
      <CodeEditor
        language="html"
        value="<div>test</div>"
        onChange={mockOnChange}
        title="HTML"
        emoji="📝"
        headerClass="header-html"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('<div>test</div>')).toBeInTheDocument()
  })

  it('should render Monaco editor with CSS language', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=".test { color: red; }"
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('.test { color: red; }')).toBeInTheDocument()
  })

  it('should display the correct title', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS Editor"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByText('CSS Editor')).toBeInTheDocument()
  })

  it('should call onChange when editor content changes', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: '.new { color: blue; }' } })

    expect(mockOnChange).toHaveBeenCalledWith('.new { color: blue; }')
  })

  it('should render with HTML language and correct value', () => {
    renderWithTheme(
      <CodeEditor
        language="html"
        value="<div>test</div>"
        onChange={mockOnChange}
        title="HTML"
        emoji="📝"
        headerClass="header-html"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('<div>test</div>')).toBeInTheDocument()
  })

  it('should render correctly with light theme', () => {
    // Set theme to light
    localStorage.setItem('theme', 'light')

    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('should render correctly with dark theme', () => {
    // Set theme to dark
    localStorage.setItem('theme', 'dark')

    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('should make editor read-only when readOnly prop is true', () => {
    renderWithTheme(
      <CodeEditor
        language="html"
        value="<div>test</div>"
        onChange={mockOnChange}
        title="HTML"
        emoji="📝"
        headerClass="header-html"
        readOnly={true}
      />
    )

    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('readonly')
  })

  it('should not be read-only by default', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    const editor = screen.getByTestId('monaco-editor')
    expect(editor).not.toHaveAttribute('readonly')
  })

  it('should have proper editor container styling', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    // The header container should have the headerClass
    const container = screen.getByText('CSS').closest('div')
    expect(container).toHaveClass('header-css', 'p-4')
  })

  it('should have proper title styling', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS Editor"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    const title = screen.getByText('CSS Editor')
    expect(title).toHaveClass('text-purple-700', 'dark:text-purple-200')
  })

  it('should handle empty value', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('should handle multiline values', () => {
    const multilineCSS = `.container {
  display: flex;
  justify-content: center;
}`

    renderWithTheme(
      <CodeEditor
        language="css"
        value={multilineCSS}
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    // Test that the textarea exists and contains the content
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toBeInTheDocument()
    expect(editor).toHaveValue(multilineCSS)
  })

  it('should render with correct emoji and title', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    expect(screen.getByText('🎨')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('should handle rapid value changes', () => {
    const { rerender } = renderWithTheme(
      <CodeEditor
        language="css"
        value="initial"
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    // Rapidly change values
    rerender(
      <ThemeProvider>
        <CodeEditor
          language="css"
          value="changed1"
          onChange={mockOnChange}
          title="CSS"
          emoji="🎨"
          headerClass="header-css"
        />
      </ThemeProvider>
    )

    rerender(
      <ThemeProvider>
        <CodeEditor
          language="css"
          value="changed2"
          onChange={mockOnChange}
          title="CSS"
          emoji="🎨"
          headerClass="header-css"
        />
      </ThemeProvider>
    )

    expect(screen.getByDisplayValue('changed2')).toBeInTheDocument()
  })

  it('should handle language changes', () => {
    const { rerender } = renderWithTheme(
      <CodeEditor
        language="css"
        value=".test {}"
        onChange={mockOnChange}
        title="CSS"
        emoji="🎨"
        headerClass="header-css"
      />
    )

    rerender(
      <ThemeProvider>
        <CodeEditor
          language="html"
          value="<div></div>"
          onChange={mockOnChange}
          title="HTML"
          emoji="📝"
          headerClass="header-html"
        />
      </ThemeProvider>
    )

    expect(screen.getByDisplayValue('<div></div>')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
  })
})