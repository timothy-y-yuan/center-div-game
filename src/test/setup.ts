import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock Monaco Editor globally for all tests
vi.mock('@monaco-editor/react', () => ({
  default: (props: {
    language?: string;
    onChange?: (value: string) => void;
    value?: string;
    options?: { readOnly?: boolean };
  }) => {
    const { language, onChange, value, options } = props;
    const testId = `monaco-editor-${language || 'unknown'}`;

    return React.createElement('textarea', {
      'data-testid': testId,
      value: value || '',
      readOnly: options?.readOnly || false,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange?.(e.target.value),
    });
  },
  loader: {
    init: vi.fn(),
    config: vi.fn(),
  },
}));

// Mock localStorage with actual storage functionality
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
