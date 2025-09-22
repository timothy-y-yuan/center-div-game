/**
 * @fileoverview Simple code display component for showing non-editable code
 * Shows HTML and CSS with syntax highlighting using react-syntax-highlighter
 */

import { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useTheme } from '../hooks/useTheme';
import type { Level } from '../types';

interface CodeDisplayProps {
  level: Level;
}

/**
 * Simple code display component for non-editable HTML and CSS
 * Uses react-syntax-highlighter with Prism for syntax highlighting
 */
const CodeDisplay = memo(function CodeDisplay({ level }: CodeDisplayProps) {
  const { actualTheme } = useTheme();

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <div className='flex-1 overflow-auto'>
        {/* HTML Section */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <SyntaxHighlighter
            language='html'
            useInlineStyles={false}
            className={`syntax-highlighter ${actualTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}
            wrapLongLines={true}
          >
            {level.initialHTML}
          </SyntaxHighlighter>
        </div>

        {/* CSS Section */}
        <div>
          <SyntaxHighlighter
            language='css'
            useInlineStyles={false}
            className={`syntax-highlighter ${actualTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}
            wrapLongLines={true}
          >
            {level.lockedCSS}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
});

export default CodeDisplay;
