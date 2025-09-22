import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('should render an iframe with correct id', () => {
    render(<Preview {...defaultProps} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('id', 'preview');
  });

  it('should set iframe content correctly', () => {
    const content =
      '<!DOCTYPE html><html><head><style>.test { color: red; }</style></head><body><div class="test">Hello World</div></body></html>';

    render(<Preview {...defaultProps} content={content} />);

    const iframe = document.getElementById('preview') as HTMLIFrameElement;

    // Verify iframe exists and has correct content
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('srcdoc', content);
  });

  it('should update iframe content when content prop changes', () => {
    const initialContent = '<html><body><div>Initial</div></body></html>';
    const updatedContent = '<html><body><div>Updated</div></body></html>';

    const { rerender } = render(
      <Preview {...defaultProps} content={initialContent} />
    );

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('srcdoc', initialContent);

    // Change content
    rerender(<Preview {...defaultProps} content={updatedContent} />);
    expect(iframe).toHaveAttribute('srcdoc', updatedContent);
  });

  it('should have correct iframe styling and attributes', () => {
    render(<Preview {...defaultProps} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toHaveClass(
      'w-full',
      'h-full',
      'border-0',
      'rounded-xl',
      'shadow-lg',
      'bg-white'
    );
  });

  it('should handle empty content', () => {
    render(<Preview {...defaultProps} content='' />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should handle malformed HTML content', () => {
    const malformedContent =
      '<html><body><div>Unclosed div<span>Unclosed span</body></html>';

    render(<Preview {...defaultProps} content={malformedContent} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should handle content with special characters', () => {
    const contentWithSpecialChars =
      '<html><body><div>Special chars: &lt;&gt;&amp;"\'</div></body></html>';

    render(<Preview {...defaultProps} content={contentWithSpecialChars} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should handle very long content', () => {
    const longContent = `<html><body>${'<div>Long content</div>'.repeat(100)}</body></html>`;

    render(<Preview {...defaultProps} content={longContent} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should handle content with CSS and JavaScript', () => {
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

  it('should handle numbers in content', () => {
    render(
      <Preview {...defaultProps} content='<html><body>10</body></html>' />
    );

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should handle iframe loading', () => {
    render(<Preview {...defaultProps} />);

    const iframe = document.getElementById('preview');
    expect(iframe).toBeInTheDocument();
  });

  it('should have proper container styling', () => {
    const { container } = render(<Preview {...defaultProps} />);

    // Find the main container div
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

  it('should show preview title', () => {
    render(<Preview {...defaultProps} />);

    expect(screen.getByText('👀')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
  });

  it('should have correct title styling', () => {
    render(<Preview {...defaultProps} />);

    const title = screen.getByText('Live Preview');
    expect(title).toHaveClass('text-emerald-700', 'dark:text-emerald-200');
  });

  it('should unmount without errors', () => {
    const { unmount } = render(<Preview {...defaultProps} />);

    expect(() => unmount()).not.toThrow();
  });

  it('should show next level button when completed', () => {
    render(<Preview {...defaultProps} isCompleted={true} currentLevel={0} />);

    expect(screen.getByText(/Next Level/)).toBeInTheDocument();
  });

  it('should not show next level button on last level', () => {
    render(
      <Preview
        {...defaultProps}
        isCompleted={true}
        currentLevel={9}
        totalLevels={10}
      />
    );

    expect(screen.queryByText(/Next Level/)).not.toBeInTheDocument();
  });
});
