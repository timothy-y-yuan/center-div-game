/**
 * @fileoverview Monaco Editor component with validation and theming
 */

import Editor from '@monaco-editor/react';
import { memo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { CSSValidationResult, Level } from '../types';

interface CodeEditorProps {
  value: string;
  language: 'html' | 'css';
  onChange: (value: string) => void;
  title: string;
  emoji: string;
  headerClass: string;
  readOnly?: boolean;
  level?: Level;
  validation?: CSSValidationResult;
}

const handleEditorWillMount = (monaco: any) => {
  monaco.editor.defineTheme('customDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  });
};

const handleEditorDidMount = (editor: any, _monaco: any) => {
  editor.updateOptions({
    fontFamily:
      '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
    fontSize: 14,
    fontWeight: 'normal',
    fontLigatures: true,
  });
};

/**
 * Monaco Editor component with validation feedback
 * Memoized to prevent unnecessary re-renders of the heavy Monaco instance
 */
const CodeEditor = memo(function CodeEditor({
  value,
  language,
  onChange,
  title,
  emoji,
  headerClass,
  readOnly = false,
  level,
  validation,
}: CodeEditorProps) {
  const { actualTheme } = useTheme();

  return (
    <>
      <div className={`${headerClass} p-4`}>
        <h3 className="font-bold text-lg flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <span
            className={
              language === 'html'
                ? 'text-blue-700 dark:text-blue-200'
                : 'text-purple-700 dark:text-purple-200'
            }
          >
            {title}
          </span>
        </h3>

        {/* Show constraints for CSS editor */}
        {level && language === 'css' && (
          <div className="mt-2 text-sm">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Constraints:
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                {level.constraints}
              </div>
            </div>
          </div>
        )}

        {/* Show validation errors */}
        {validation && !validation.isValid && (
          <div className="mt-2 text-sm">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <div className="font-medium text-red-800 dark:text-red-200 mb-1">
                Validation Errors:
              </div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-red-700 dark:text-red-300">
                  • {error.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={actualTheme === 'dark' ? 'vs-dark' : 'vs-light'}
          value={value}
          onChange={(value) => onChange(value || '')}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            fontFamily:
              '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
            padding: { top: 16, bottom: 16 },
            lineHeight: 1.5,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontLigatures: false,
            readOnly: readOnly,
          }}
        />
      </div>
    </>
  );
});

export default CodeEditor;
