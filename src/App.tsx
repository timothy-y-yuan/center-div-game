import { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import ConfettiEffect from './components/ConfettiEffect'
import { levels } from './data/levels'
import { generateCompleteCSS, getInitialEditableCSS, validateUserCSS } from './utils/cssValidator'

// Persistence helpers
const getCompletedLevels = (): Set<number> => {
  try {
    const stored = localStorage.getItem('completedLevels')
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

const saveCompletedLevels = (completed: Set<number>) => {
  localStorage.setItem('completedLevels', JSON.stringify([...completed]))
}

const getFailedLevels = (): Set<number> => {
  try {
    const stored = localStorage.getItem('failedLevels')
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

const saveFailedLevels = (failed: Set<number>) => {
  localStorage.setItem('failedLevels', JSON.stringify([...failed]))
}

const getCurrentLevel = (): number => {
  try {
    const stored = localStorage.getItem('currentLevel')
    return stored ? parseInt(stored, 10) : 0
  } catch {
    return 0
  }
}

const saveCurrentLevel = (level: number) => {
  localStorage.setItem('currentLevel', level.toString())
}

function App() {
  const [currentLevel, setCurrentLevel] = useState(getCurrentLevel)
  const [html, setHtml] = useState(levels[currentLevel].initialHTML)
  const [editableCSS, setEditableCSS] = useState(getInitialEditableCSS(levels[currentLevel]))
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedLevels, setCompletedLevels] = useState(getCompletedLevels)
  const [failedLevels, setFailedLevels] = useState(getFailedLevels)
  const [showConfetti, setShowConfetti] = useState(false)
  const [cssValidation, setCssValidation] = useState(validateUserCSS('', levels[currentLevel]))

  const checkCompletion = () => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement
    if (!iframe?.contentWindow) return

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document
      const container = doc.querySelector('.container') as HTMLElement
      const target = doc.querySelector('.target') as HTMLElement

      if (!container || !target) return

      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      const containerCenterX = containerRect.left + containerRect.width / 2
      const containerCenterY = containerRect.top + containerRect.height / 2
      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2

      const isHorizontallyCentered = Math.abs(containerCenterX - targetCenterX) < 5
      const isVerticallyCentered = Math.abs(containerCenterY - targetCenterY) < 5

      // Level 1 only requires horizontal centering, others require both
      const completed = currentLevel === 0
        ? isHorizontallyCentered
        : isHorizontallyCentered && isVerticallyCentered

      if (completed && !isCompleted && !failedLevels.has(currentLevel)) {
        // Only allow completion if level wasn't failed
        // Trigger confetti on first completion
        setShowConfetti(true)
        // Mark level as completed
        const newCompleted = new Set(completedLevels)
        newCompleted.add(currentLevel)
        setCompletedLevels(newCompleted)
        saveCompletedLevels(newCompleted)
      }
      setIsCompleted(completed && !failedLevels.has(currentLevel))
    } catch (error) {
      console.error('Error checking completion:', error)
    }
  }

  const revealAnswer = () => {
    // Mark level as failed
    const newFailed = new Set(failedLevels)
    newFailed.add(currentLevel)
    setFailedLevels(newFailed)
    saveFailedLevels(newFailed)

    // Show the solution by setting the full solution CSS as editable
    // This is a special case where we override constraints
    setEditableCSS(levels[currentLevel].solutionCSS)
    setShowHint(false)
  }

  const changeLevel = (newLevel: number) => {
    if (newLevel >= 0 && newLevel < levels.length) {
      setCurrentLevel(newLevel)
      setHtml(levels[newLevel].initialHTML)
      setEditableCSS(getInitialEditableCSS(levels[newLevel]))
      setIsCompleted(completedLevels.has(newLevel) && !failedLevels.has(newLevel))
      setShowHint(false)
      setCssValidation(validateUserCSS('', levels[newLevel]))
      saveCurrentLevel(newLevel)
    }
  }

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      changeLevel(currentLevel + 1)
    }
  }

  const resetProgress = () => {
    // Clear all localStorage data
    localStorage.removeItem('completedLevels')
    localStorage.removeItem('failedLevels')
    localStorage.removeItem('currentLevel')

    // Reset state
    setCompletedLevels(new Set())
    setFailedLevels(new Set())
    changeLevel(0) // Go back to first level
  }

  const handleCSSChange = (newEditableCSS: string) => {
    setEditableCSS(newEditableCSS)
    // Validate the CSS against level constraints
    const validation = validateUserCSS(newEditableCSS, levels[currentLevel])
    setCssValidation(validation)
  }

  // Generate complete CSS for preview (locked + editable)
  const completeCSS = generateCompleteCSS(editableCSS, levels[currentLevel])

  const previewContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${completeCSS}</style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `

  return (
    <div className="h-screen bg-main text-gray-900 dark:text-white flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orb-blue rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orb-pink rounded-full"></div>

      <Header
        levels={levels}
        currentLevelIndex={currentLevel}
        completedLevels={completedLevels}
        failedLevels={failedLevels}
        showHint={showHint}
        onToggleHint={() => setShowHint(!showHint)}
        onCheck={checkCompletion}
        onLevelSelect={changeLevel}
        onRevealAnswer={revealAnswer}
        onResetProgress={resetProgress}
        onNextLevel={nextLevel}
      />

      <div className="flex-1 relative z-10 p-4">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col glass rounded-2xl overflow-hidden mr-2">
              <PanelGroup direction="vertical">
                <Panel defaultSize={25} minSize={15}>
                  <div className="h-full flex flex-col">
                    <CodeEditor
                      value={html}
                      language="html"
                      onChange={() => {}} // No-op - HTML is read-only
                      title="HTML"
                      emoji="📝"
                      headerClass="header-html"
                      readOnly={true}
                    />
                  </div>
                </Panel>

                <PanelResizeHandle className="h-2 bg-gray-300 dark:bg-slate-800 bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-row-resize flex items-center justify-center group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="w-8 h-0.5 bg-gray-400 dark:bg-slate-500 bg-opacity-60 group-hover:bg-blue-400 group-hover:bg-opacity-80 rounded-full transition-all duration-300 relative z-10"></div>
                </PanelResizeHandle>

                <Panel defaultSize={75} minSize={30}>
                  <div className="h-full flex flex-col">
                    <CodeEditor
                      value={editableCSS}
                      language="css"
                      onChange={handleCSSChange}
                      title="CSS"
                      emoji="🎨"
                      headerClass="header-css"
                      level={levels[currentLevel]}
                      validation={cssValidation}
                    />
                  </div>
                </Panel>
              </PanelGroup>
            </div>
          </Panel>

          <PanelResizeHandle className="w-3 bg-gray-300 dark:bg-slate-800 bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-col-resize flex items-center justify-center group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="h-8 w-0.5 bg-gray-400 dark:bg-slate-500 bg-opacity-60 group-hover:bg-blue-400 group-hover:bg-opacity-80 rounded-full transition-all duration-300 relative z-10"></div>
          </PanelResizeHandle>

          <Panel defaultSize={50} minSize={30}>
            <Preview
              content={previewContent}
              isCompleted={isCompleted}
              currentLevel={currentLevel}
              totalLevels={levels.length}
              onNextLevel={nextLevel}
            />
          </Panel>
        </PanelGroup>
      </div>

      <ConfettiEffect
        isVisible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  )
}

export default App