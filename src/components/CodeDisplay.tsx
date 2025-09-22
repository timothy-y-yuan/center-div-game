/**
 * @fileoverview Simple code display component for showing non-editable code
 * Shows HTML and CSS with syntax highlighting using react-syntax-highlighter
 */

import { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../hooks/useTheme';
import type { Level } from '../types';

interface CodeDisplayProps {
  level: Level;
  title: string;
  emoji: string;
  headerClass: string;
}

/**
 * Simple code display component for non-editable HTML and CSS
 * Uses react-syntax-highlighter with Prism for syntax highlighting
 */
const CodeDisplay = memo(function CodeDisplay({
  level,
  title,
  emoji,
  headerClass,
}: CodeDisplayProps) {
  const { actualTheme } = useTheme();
  const syntaxStyle = actualTheme === 'dark' ? oneDark : oneLight;

  return (
    <>
      <div className={`${headerClass} p-4`}>
        <h3 className="font-bold text-lg flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <span className="text-blue-700 dark:text-blue-200">{title}</span>
        </h3>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        {/* HTML Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span className="text-base">📝</span>
            HTML Structure
          </h4>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="html"
              style={syntaxStyle}
              customStyle={{
                margin: 0,
                fontSize: '14px',
                fontFamily: '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
              }}
            >
              {level.initialHTML}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* CSS Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span className="text-base">🎨</span>
            Existing CSS (cannot be modified)
          </h4>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="css"
              style={syntaxStyle}
              customStyle={{
                margin: 0,
                fontSize: '14px',
                fontFamily: '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
              }}
            >
              {level.lockedCSS}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </>
  );
});

export default CodeDisplay;