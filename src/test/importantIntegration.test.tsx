import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { containsImportant } from '../utils/cssValidator';

// Helper function to render with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock monaco editor
vi.mock('@monaco-editor/react', () => ({
  default: ({
    onChange,
    value,
  }: {
    onChange?: (value: string) => void;
    value?: string;
  }) => (
    <textarea
      data-testid='monaco-editor'
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  ),
}));

// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='panel'>{children}</div>
  ),
  PanelGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='panel-group'>{children}</div>
  ),
  PanelResizeHandle: () => <div data-testid='panel-resize-handle' />,
}));

describe('!important Detection Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      toJSON: vi.fn(),
    }));
  });

  it('should detect !important in CSS text', () => {
    const mockCSS = '.target { margin: 0 auto !important; }';
    expect(containsImportant(mockCSS)).toBe(true);
  });

  it('should not detect !important in regular CSS', () => {
    const regularCSS = '.target { margin: 0 auto; }';
    expect(containsImportant(regularCSS)).toBe(false);
  });

  it('should render App component with ImportantModal available', () => {
    renderWithTheme(<App />);
    
    // The app should render without crashing
    expect(screen.getByText('Can You Center The <div>?')).toBeInTheDocument();
    
    // Modal should not be visible initially
    expect(screen.queryByText('!important Detected')).not.toBeInTheDocument();
  });
});