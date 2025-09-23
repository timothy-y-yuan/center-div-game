import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
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

describe('ImportantModal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

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

  it('should render App component with ImportantModal available', () => {
    renderWithTheme(<App />);

    // The app should render without crashing
    expect(screen.getByText('Can You Center The <div>?')).toBeInTheDocument();

    // Modal should not be visible initially
    expect(screen.queryByTestId('important-modal')).not.toBeInTheDocument();
  });

  it('should show ImportantModal when !important is entered in CSS input', async () => {
    renderWithTheme(<App />);

    // Wait for the app to fully load
    await waitFor(() => {
      expect(screen.getByText('Can You Center The <div>?')).toBeInTheDocument();
    });

    // Get the CSS editor by test ID
    const cssEditor = screen.getByTestId('monaco-editor-css');
    expect(cssEditor).toBeInTheDocument();

    // Modal should not be visible initially
    expect(screen.queryByTestId('important-modal')).not.toBeInTheDocument();

    // Enter CSS with !important
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto !important; }' },
    });

    // Modal should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('important-modal')).toBeInTheDocument();
    });

    // Verify modal is visible (not hidden)
    const modal = screen.getByTestId('important-modal');
    expect(modal).toBeVisible();
  });

  it('should hide ImportantModal when close button is clicked', async () => {
    renderWithTheme(<App />);

    // Wait for the app to fully load
    await waitFor(() => {
      expect(screen.getByText('Can You Center The <div>?')).toBeInTheDocument();
    });

    // Get the CSS editor and enter !important
    const cssEditor = screen.getByTestId('monaco-editor-css');
    fireEvent.change(cssEditor, {
      target: { value: '.target { margin: 0 auto !important; }' },
    });

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('important-modal')).toBeInTheDocument();
    });

    // Click the close button
    const closeButton = screen.getByTestId('important-modal-close');
    fireEvent.click(closeButton);

    // Modal should be hidden
    await waitFor(() => {
      expect(screen.queryByTestId('important-modal')).not.toBeInTheDocument();
    });
  });
});
