import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Preview from '../components/Preview';

describe('Preview Component', () => {
  const defaultProps = {
    content:
      '<!DOCTYPE html><html><head></head><body><div>Test</div></body></html>',
    isCompleted: false,
    currentLevel: 0,
    totalLevels: 10,
    onNextLevel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render iframe with content and correct styling', () => {
    const content =
      '<!DOCTYPE html><html><head><style>.test { color: red; }</style></head><body><div class="test">Hello World</div></body></html>';

    render(<Preview {...defaultProps} content={content} />);

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('id', 'preview');
    expect(iframe).toHaveAttribute('srcdoc', content);
    expect(iframe).toHaveClass(
      'w-full',
      'h-full',
      'border-0',
      'rounded-xl',
      'shadow-lg',
      'bg-white'
    );
  });

  it('should handle content updates and edge cases', () => {
    const initialContent = '<html><body><div>Initial</div></body></html>';
    const updatedContent = '<html><body><div>Updated</div></body></html>';

    const { rerender } = render(
      <Preview {...defaultProps} content={initialContent} />
    );

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('srcdoc', initialContent);

    // Test content updates
    rerender(<Preview {...defaultProps} content={updatedContent} />);
    expect(iframe).toHaveAttribute('srcdoc', updatedContent);

    // Test empty content
    rerender(<Preview {...defaultProps} content='' />);
    expect(iframe).toBeInTheDocument();

    // Test malformed HTML
    const malformedContent =
      '<html><body><div>Unclosed div<span>Unclosed span</body></html>';
    rerender(<Preview {...defaultProps} content={malformedContent} />);
    expect(iframe).toBeInTheDocument();

    // Test special characters
    const specialCharsContent =
      '<html><body><div>Special chars: &lt;&gt;&amp;"\'</div></body></html>';
    rerender(<Preview {...defaultProps} content={specialCharsContent} />);
    expect(iframe).toBeInTheDocument();
  });

  it('should display title and styling correctly', () => {
    const { container } = render(<Preview {...defaultProps} />);

    // Check title display
    expect(screen.getByText('👀')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();

    const title = screen.getByText('Live Preview');
    expect(title).toHaveClass('text-emerald-700', 'dark:text-emerald-200');

    // Check container styling
    const previewContainer = container.querySelector(
      '.h-full.flex.flex-col.glass'
    );
    expect(previewContainer).toBeInTheDocument();
    expect(previewContainer).toHaveClass(
      'h-full',
      'flex',
      'flex-col',
      'glass',
      'rounded-2xl',
      'overflow-hidden',
      'ml-2'
    );
  });

  it('should handle next level button visibility', () => {
    // Test showing next level button when completed
    const { rerender } = render(
      <Preview {...defaultProps} isCompleted={true} currentLevel={0} />
    );
    expect(screen.getByText(/Next Level/)).toBeInTheDocument();

    // Test hiding next level button on last level
    rerender(
      <Preview
        {...defaultProps}
        isCompleted={true}
        currentLevel={9}
        totalLevels={10}
      />
    );
    expect(screen.queryByText(/Next Level/)).not.toBeInTheDocument();

    // Test not showing when not completed
    rerender(
      <Preview {...defaultProps} isCompleted={false} currentLevel={0} />
    );
    expect(screen.queryByText(/Next Level/)).not.toBeInTheDocument();
  });

  it('should handle complex content with CSS and JavaScript', () => {
    const contentWithScripts = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              display: flex;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <div class="container">Content</div>
          <script>console.log('test');</script>
        </body>
      </html>`;

    render(<Preview {...defaultProps} content={contentWithScripts} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });
});
