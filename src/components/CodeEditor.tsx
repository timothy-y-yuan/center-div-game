/**
 * @fileoverview Monaco Editor component with validation and theming
 */

import Editor, { type Monaco } from '@monaco-editor/react';
import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { CSSValidationResult } from '../types';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  language: 'html' | 'css';
  onChange: (value: string) => void;
  title: string;
  emoji: string;
  headerClass: string;
  readOnly?: boolean;
  validation?: CSSValidationResult;
}

const handleEditorWillMount = (monaco: Monaco) => {
  monaco.editor.defineTheme('customDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  });
};

const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
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
  validation,
}: CodeEditorProps) {
  const { actualTheme } = useTheme();

  return (
    <div className='h-full flex flex-col'>
      <div className={`${headerClass} p-4`}>
        <h3 className='font-bold text-lg flex items-center gap-3'>
          <span className='text-2xl'>{emoji}</span>
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
      </div>
      <div className='flex-1'>
        <Editor
          height='100%'
          language={language}
          theme={actualTheme === 'dark' ? 'vs-dark' : 'vs-light'}
          value={value}
          onChange={value => onChange(value || '')}
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
      {/* Show validation errors at bottom */}
      {validation && !validation.isValid && (
        <div className='px-4 py-2 border-t border-red-300/40 dark:border-red-400/30 bg-red-50/50 dark:bg-red-500/10'>
          {validation.errors.map((error, index) => (
            <div
              key={index}
              className='text-xs text-red-700 dark:text-red-300 flex items-center gap-1'
            >
              <span className='w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full flex-shrink-0'></span>
              {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default CodeEditor;
