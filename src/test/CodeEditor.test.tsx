import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CodeEditor from '../components/CodeEditor';
import { ThemeProvider } from '../contexts/ThemeProvider';

const mockOnChange = vi.fn();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('CodeEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle onChange functionality correctly', () => {
    renderWithTheme(
      <CodeEditor
        language='css'
        value='.test { color: red; }'
        onChange={mockOnChange}
        title='CSS Editor'
        emoji='🎨'
        headerClass='header-css'
      />
    );

    const editor = screen.getByTestId('monaco-editor-css');
    fireEvent.change(editor, { target: { value: '.new { color: blue; }' } });
    expect(mockOnChange).toHaveBeenCalledWith('.new { color: blue; }');
  });

  it('should handle read-only mode', () => {
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

    const editor = screen.getByTestId('monaco-editor-html');
    expect(editor).toHaveAttribute('readonly');
  });

  it('should handle value changes', () => {
    const { rerender } = renderWithTheme(
      <CodeEditor
        language='css'
        value='initial'
        onChange={mockOnChange}
        title='CSS'
        emoji='🎨'
        headerClass='header-css'
      />
    );

    const editor = screen.getByTestId('monaco-editor-css');
    expect(editor).toHaveValue('initial');

    rerender(
      <ThemeProvider>
        <CodeEditor
          language='css'
          value='changed'
          onChange={mockOnChange}
          title='CSS'
          emoji='🎨'
          headerClass='header-css'
        />
      </ThemeProvider>
    );

    expect(screen.getByDisplayValue('changed')).toBeInTheDocument();
  });
});
