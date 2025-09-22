import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CodeEditor from '../components/CodeEditor';
import { ThemeProvider } from '../contexts/ThemeProvider';

// Mock Monaco Editor
const mockOnChange = vi.fn();

vi.mock('@monaco-editor/react', () => ({
  default: ({
    onChange,
    value,
    options,
  }: {
    onChange?: (value: string) => void;
    value?: string;
    options?: { readOnly?: boolean; language?: string };
  }) => (
    <textarea
      data-testid='monaco-editor'
      value={value}
      onChange={e => onChange?.(e.target.value)}
      readOnly={options?.readOnly}
      placeholder={options?.language}
    />
  ),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('CodeEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render and function correctly with different languages', () => {
    // Test CSS language
    const { rerender } = renderWithTheme(
      <CodeEditor
        language='css'
        value='.test { color: red; }'
        onChange={mockOnChange}
        title='CSS Editor'
        emoji='🎨'
        headerClass='header-css'
      />
    );

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('.test { color: red; }')
    ).toBeInTheDocument();
    expect(screen.getByText('CSS Editor')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();

    // Test onChange functionality
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, { target: { value: '.new { color: blue; }' } });
    expect(mockOnChange).toHaveBeenCalledWith('.new { color: blue; }');

    // Test HTML language switch
    rerender(
      <ThemeProvider>
        <CodeEditor
          language='html'
          value='<div>test</div>'
          onChange={mockOnChange}
          title='HTML'
          emoji='📝'
          headerClass='header-html'
        />
      </ThemeProvider>
    );

    expect(screen.getByDisplayValue('<div>test</div>')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('should handle read-only mode and styling', () => {
    renderWithTheme(
      <CodeEditor
        language='html'
        value='<div>test</div>'
        onChange={mockOnChange}
        title='HTML'
        emoji='📝'
        headerClass='header-html'
        readOnly={true}
      />
    );

    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('readonly');

    // Check title styling
    const title = screen.getByText('HTML');
    expect(title).toHaveClass('text-blue-700', 'dark:text-blue-200');

    // Check header container styling
    const container = title.closest('div');
    expect(container).toHaveClass('header-html', 'p-4');
  });

  it('should handle multiline content and value changes', () => {
    const multilineCSS = `.container {
  display: flex;
  justify-content: center;
}`;

    const { rerender } = renderWithTheme(
      <CodeEditor
        language='css'
        value={multilineCSS}
        onChange={mockOnChange}
        title='CSS'
        emoji='🎨'
        headerClass='header-css'
      />
    );

    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveValue(multilineCSS);

    // Test rapid value changes
    rerender(
      <ThemeProvider>
        <CodeEditor
          language='css'
          value='changed1'
          onChange={mockOnChange}
          title='CSS'
          emoji='🎨'
          headerClass='header-css'
        />
      </ThemeProvider>
    );

    rerender(
      <ThemeProvider>
        <CodeEditor
          language='css'
          value='changed2'
          onChange={mockOnChange}
          title='CSS'
          emoji='🎨'
          headerClass='header-css'
        />
      </ThemeProvider>
    );

    expect(screen.getByDisplayValue('changed2')).toBeInTheDocument();
  });
});
