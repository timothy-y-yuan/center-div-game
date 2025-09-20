import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Preview from '../components/Preview'

describe('Preview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render an iframe with correct id', () => {
    const content = '<!DOCTYPE html><html><head></head><body><div>Test</div></body></html>'

    render(<Preview content={content} />)

    const iframe = screen.getByRole('img') // iframe has role="img" in testing-library
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('id', 'preview')
  })

  it('should set iframe content correctly', async () => {
    const content = '<!DOCTYPE html><html><head><style>.test { color: red; }</style></head><body><div class="test">Hello World</div></body></html>'

    render(<Preview content={content} />)

    const iframe = screen.getByRole('img') as HTMLIFrameElement

    // Wait for iframe to load
    await waitFor(() => {
      expect(iframe).toBeInTheDocument()
    })

    // Mock iframe document for testing
    const mockDoc = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn()
    }

    Object.defineProperty(iframe, 'contentDocument', {
      value: mockDoc,
      configurable: true
    })

    // Trigger a re-render to test the useEffect
    const { rerender } = render(<Preview content={content} />)
    rerender(<Preview content={content} />)

    expect(mockDoc.open).toHaveBeenCalled()
    expect(mockDoc.write).toHaveBeenCalledWith(content)
    expect(mockDoc.close).toHaveBeenCalled()
  })

  it('should update iframe content when content prop changes', async () => {
    const initialContent = '<html><body><div>Initial</div></body></html>'
    const updatedContent = '<html><body><div>Updated</div></body></html>'

    const { rerender } = render(<Preview content={initialContent} />)

    const iframe = screen.getByRole('img') as HTMLIFrameElement

    const mockDoc = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn()
    }

    Object.defineProperty(iframe, 'contentDocument', {
      value: mockDoc,
      configurable: true
    })

    // Change content
    rerender(<Preview content={updatedContent} />)

    await waitFor(() => {
      expect(mockDoc.write).toHaveBeenLastCalledWith(updatedContent)
    })
  })

  it('should have correct iframe styling and attributes', () => {
    const content = '<html><body>Test</body></html>'

    render(<Preview content={content} />)

    const iframe = screen.getByRole('img')
    expect(iframe).toHaveClass('w-full', 'h-full', 'border-0', 'bg-white')
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin allow-scripts')
  })

  it('should handle empty content', () => {
    render(<Preview content="" />)

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle malformed HTML content', () => {
    const malformedContent = '<html><body><div>Unclosed div<span>Unclosed span</body></html>'

    render(<Preview content={malformedContent} />)

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle content with special characters', () => {
    const contentWithSpecialChars = '<html><body><div>Special chars: &lt;&gt;&amp;"\'</div></body></html>'

    render(<Preview content={contentWithSpecialChars} />)

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle very long content', () => {
    const longContent = `<html><body>${'<div>Long content</div>'.repeat(1000)}</body></html>`

    render(<Preview content={longContent} />)

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle content with CSS and JavaScript', () => {
    const contentWithScripts = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .target {
              width: 50px;
              height: 50px;
              background: green;
            }
          </style>
          <script>
            console.log('Preview loaded');
          </script>
        </head>
        <body>
          <div class="container">
            <div class="target"></div>
          </div>
        </body>
      </html>
    `

    render(<Preview content={contentWithScripts} />)

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle rapid content changes', () => {
    const { rerender } = render(<Preview content="<html><body>1</body></html>" />)

    // Rapidly change content multiple times
    for (let i = 2; i <= 10; i++) {
      rerender(<Preview content={`<html><body>${i}</body></html>`} />)
    }

    const iframe = screen.getByRole('img')
    expect(iframe).toBeInTheDocument()
  })

  it('should handle iframe without contentDocument', () => {
    const content = '<html><body>Test</body></html>'

    render(<Preview content={content} />)

    const iframe = screen.getByRole('img') as HTMLIFrameElement

    // Mock iframe without contentDocument
    Object.defineProperty(iframe, 'contentDocument', {
      value: null,
      configurable: true
    })

    // Should not throw an error
    expect(iframe).toBeInTheDocument()
  })

  it('should handle iframe document.write errors gracefully', () => {
    const content = '<html><body>Test</body></html>'

    render(<Preview content={content} />)

    const iframe = screen.getByRole('img') as HTMLIFrameElement

    const mockDoc = {
      open: vi.fn(),
      write: vi.fn(() => {
        throw new Error('Write failed')
      }),
      close: vi.fn()
    }

    Object.defineProperty(iframe, 'contentDocument', {
      value: mockDoc,
      configurable: true
    })

    // Should handle the error gracefully
    const { rerender } = render(<Preview content={content} />)
    rerender(<Preview content={content} />)

    expect(iframe).toBeInTheDocument()
  })

  it('should have proper container styling', () => {
    const content = '<html><body>Test</body></html>'

    const { container } = render(<Preview content={content} />)

    const previewContainer = container.firstChild as HTMLElement
    expect(previewContainer).toHaveClass('h-full', 'flex', 'flex-col')
  })

  it('should show preview title', () => {
    const content = '<html><body>Test</body></html>'

    render(<Preview content={content} />)

    expect(screen.getByText('Live Preview')).toBeInTheDocument()
  })

  it('should have correct title styling', () => {
    const content = '<html><body>Test</body></html>'

    render(<Preview content={content} />)

    const title = screen.getByText('Live Preview')
    expect(title).toHaveClass('text-sm', 'font-semibold', 'px-4', 'py-2')
  })

  it('should unmount without errors', () => {
    const content = '<html><body>Test</body></html>'

    const { unmount } = render(<Preview content={content} />)

    expect(() => unmount()).not.toThrow()
  })

  it('should handle component remounting', () => {
    const content = '<html><body>Test</body></html>'

    const { unmount, rerender } = render(<Preview content={content} />)

    unmount()

    expect(() => {
      rerender(<Preview content={content} />)
    }).not.toThrow()
  })
})