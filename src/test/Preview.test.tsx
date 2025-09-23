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

  it('should render iframe with content', () => {
    const content =
      '<!DOCTYPE html><html><head><style>.test { color: red; }</style></head><body><div class="test">Hello World</div></body></html>';

    render(<Preview {...defaultProps} content={content} />);

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('srcdoc', content);
  });

  it('should handle content updates', () => {
    const initialContent = '<html><body><div>Initial</div></body></html>';
    const updatedContent = '<html><body><div>Updated</div></body></html>';

    const { rerender } = render(
      <Preview {...defaultProps} content={initialContent} />
    );

    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('srcdoc', initialContent);

    rerender(<Preview {...defaultProps} content={updatedContent} />);
    expect(iframe).toHaveAttribute('srcdoc', updatedContent);
  });

  it('should handle next level button visibility', () => {
    // Test showing next level button when completed
    const { rerender } = render(
      <Preview {...defaultProps} isCompleted={true} currentLevel={0} />
    );
    expect(screen.getByTestId('preview-next-level-button')).toBeInTheDocument();

    // Test hiding next level button on last level
    rerender(
      <Preview
        {...defaultProps}
        isCompleted={true}
        currentLevel={9}
        totalLevels={10}
      />
    );
    expect(
      screen.queryByTestId('preview-next-level-button')
    ).not.toBeInTheDocument();

    // Test not showing when not completed
    rerender(
      <Preview {...defaultProps} isCompleted={false} currentLevel={0} />
    );
    expect(
      screen.queryByTestId('preview-next-level-button')
    ).not.toBeInTheDocument();
  });
});
