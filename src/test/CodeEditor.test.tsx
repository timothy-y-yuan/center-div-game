import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeEditor from '../components/CodeEditor'
import { ThemeProvider } from '../contexts/ThemeContext'

// Mock Monaco Editor
const mockOnChange = vi.fn()

const MockedEditor = vi.fn(({ onChange, value, options }: any) => (
  <textarea
    data-testid="monaco-editor"
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    readOnly={options?.readOnly}
    placeholder={options?.language}
  />
))

vi.mock('@monaco-editor/react', () => ({
  default: MockedEditor
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
      />
    )

    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: '.new { color: blue; }' } })

    expect(mockOnChange).toHaveBeenCalledWith('.new { color: blue; }')
  })

  it('should pass correct options to Monaco editor', () => {
    renderWithTheme(
      <CodeEditor
        language="html"
        value="<div>test</div>"
        onChange={mockOnChange}
        title="HTML"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'html',
        value: '<div>test</div>',
        onChange: expect.any(Function),
        theme: 'vs-dark',
        options: expect.objectContaining({
          fontSize: 14,
          fontFamily: 'Victor Mono, Consolas, Monaco, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        })
      }),
      expect.any(Object)
    )
  })

  it('should use light theme when system theme is light', () => {
    // Set theme to light
    localStorage.setItem('theme', 'light')

    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'light'
      }),
      expect.any(Object)
    )
  })

  it('should use dark theme when system theme is dark', () => {
    // Set theme to dark
    localStorage.setItem('theme', 'dark')

    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'vs-dark'
      }),
      expect.any(Object)
    )
  })

  it('should make editor read-only when readOnly prop is true', () => {
    renderWithTheme(
      <CodeEditor
        language="html"
        value="<div>test</div>"
        onChange={mockOnChange}
        title="HTML"
        readOnly={true}
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          readOnly: true
        })
      }),
      expect.any(Object)
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
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          readOnly: false
        })
      }),
      expect.any(Object)
    )
  })

  it('should have proper editor container styling', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    const container = screen.getByText('CSS').closest('div')
    expect(container).toHaveClass('flex', 'flex-col', 'h-full')
  })

  it('should have proper title styling', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS Editor"
      />
    )

    const title = screen.getByText('CSS Editor')
    expect(title).toHaveClass('text-sm', 'font-semibold', 'px-4', 'py-2')
  })

  it('should handle empty value', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        value: ''
      }),
      expect.any(Object)
    )
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
      />
    )

    expect(screen.getByDisplayValue(multilineCSS)).toBeInTheDocument()
  })

  it('should use correct font family', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          fontFamily: 'Victor Mono, Consolas, Monaco, monospace'
        })
      }),
      expect.any(Object)
    )
  })

  it('should disable minimap', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          minimap: { enabled: false }
        })
      }),
      expect.any(Object)
    )
  })

  it('should enable word wrap', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          wordWrap: 'on'
        })
      }),
      expect.any(Object)
    )
  })

  it('should enable automatic layout', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          automaticLayout: true
        })
      }),
      expect.any(Object)
    )
  })

  it('should use correct padding', () => {
    renderWithTheme(
      <CodeEditor
        language="css"
        value=""
        onChange={mockOnChange}
        title="CSS"
      />
    )

    expect(MockedEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          padding: { top: 16, bottom: 16 }
        })
      }),
      expect.any(Object)
    )
  })

  it('should handle rapid value changes', () => {
    const { rerender } = renderWithTheme(
      <CodeEditor
        language="css"
        value="initial"
        onChange={mockOnChange}
        title="CSS"
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
      />
    )

    rerender(
      <ThemeProvider>
        <CodeEditor
          language="html"
          value="<div></div>"
          onChange={mockOnChange}
          title="HTML"
        />
      </ThemeProvider>
    )

    expect(mockMonacoEditor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        language: 'html',
        value: '<div></div>'
      }),
      expect.any(Object)
    )
  })
})