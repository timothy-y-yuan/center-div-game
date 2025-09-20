import Editor from '@monaco-editor/react'
import { useTheme } from '../contexts/ThemeContext'

interface CodeEditorProps {
  value: string
  language: 'html' | 'css'
  onChange: (value: string) => void
  title: string
  emoji: string
  headerClass: string
  readOnly?: boolean
}

const handleEditorWillMount = (monaco: any) => {
  monaco.editor.defineTheme('customDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  });
}

const handleEditorDidMount = (editor: any, _monaco: any) => {
  editor.updateOptions({
    fontFamily: '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
    fontSize: 14,
    fontWeight: 'normal',
    fontLigatures: true
  });
}

export default function CodeEditor({ value, language, onChange, title, emoji, headerClass, readOnly = false }: CodeEditorProps) {
  const { actualTheme } = useTheme()

  return (
    <>
      <div className={`${headerClass} p-4`}>
        <h3 className="font-bold text-lg flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <span className={
            language === 'html'
              ? 'text-blue-700 dark:text-blue-200'
              : 'text-purple-700 dark:text-purple-200'
          }>{title}</span>
        </h3>
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
            fontFamily: '"Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace',
            padding: { top: 16, bottom: 16 },
            lineHeight: 1.5,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontLigatures: false,
            readOnly: readOnly
          }}
        />
      </div>
    </>
  )
}