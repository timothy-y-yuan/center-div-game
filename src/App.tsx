/**
 * @fileoverview Main application component
 * Orchestrates the Center Div Game with clean architecture and custom hooks
 */

import { useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import ConfettiEffect from './components/ConfettiEffect';
import ImportantModal from './components/ImportantModal';
import { levels } from './data/levels';
import { useGameState, useLevelContent } from './hooks';
import { containsImportant } from './utils/cssValidator';
import CodeDisplay from './components/CodeDisplay';

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

/**
 * Main application component providing the Center Div Game interface
 * Uses custom hooks for clean separation of concerns
 */
function App() {
  // ============================================================================
  // HOOK INTEGRATION
  // ============================================================================

  // Game state management
  const gameState = useGameState();

  // Modal state for !important detection
  const [showImportantModal, setShowImportantModal] = useState(false);

  // Current level reference
  const currentLevel = useMemo(
    () => levels[gameState.currentLevel],
    [gameState.currentLevel]
  );

  // Level content management
  const levelContent = useLevelContent(currentLevel);

  // Completion checking (removed unused variable)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles level completion checking with enhanced feedback
   */
  const handleCheckCompletion = () => {
    gameState.checkCompletion(currentLevel, 'preview');
  };

  /**
   * Handles revealing the answer for the current level
   */
  const handleRevealAnswer = () => {
    gameState.revealAnswer();
    levelContent.setSolutionCSS(currentLevel);
  };

  /**
   * Handles level selection with content reset
   */
  const handleLevelChange = (newLevelIndex: number) => {
    if (newLevelIndex >= 0 && newLevelIndex < levels.length) {
      gameState.changeLevel(newLevelIndex);
      levelContent.resetForLevel(levels[newLevelIndex]);
    }
  };

  /**
   * Handles moving to the next level
   */
  const handleNextLevel = () => {
    gameState.nextLevel(levels.length);
    if (gameState.currentLevel < levels.length - 1) {
      levelContent.resetForLevel(levels[gameState.currentLevel + 1]);
    }
  };

  /**
   * Handles resetting all progress
   */
  const handleResetProgress = () => {
    gameState.resetProgress();
    levelContent.resetForLevel(levels[0]);
  };

  /**
   * Handles CSS changes with validation and !important detection
   */
  const handleCSSChange = (newEditableCSS: string) => {
    // Check for !important usage first
    if (containsImportant(newEditableCSS)) {
      // Instantly fail the level
      gameState.revealAnswer();

      // Show the modal
      setShowImportantModal(true);

      // Don't update the CSS - reject the change
      return;
    }

    // If no !important, proceed with normal validation
    levelContent.updateCSS(newEditableCSS);
  };

  /**
   * Handles closing the !important modal
   */
  const handleCloseImportantModal = () => {
    setShowImportantModal(false);
  };

  return (
    <div className='h-screen bg-main text-gray-900 dark:text-white flex flex-col relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-orb-blue rounded-full'></div>
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-orb-pink rounded-full'></div>

      <Header
        levels={levels}
        currentLevelIndex={gameState.currentLevel}
        completedLevels={
          new Set(Array.from(gameState.completedLevels).map(id => id as number))
        }
        failedLevels={
          new Set(Array.from(gameState.failedLevels).map(id => id as number))
        }
        showHint={gameState.showHint}
        onToggleHint={gameState.toggleHint}
        onCheck={handleCheckCompletion}
        onLevelSelect={handleLevelChange}
        onRevealAnswer={handleRevealAnswer}
        onResetProgress={handleResetProgress}
        onNextLevel={handleNextLevel}
      />

      <div className='flex-1 relative z-10 p-4'>
        <PanelGroup direction='horizontal' className='h-full'>
          <Panel defaultSize={50} minSize={30}>
            <div className='h-full flex flex-col glass rounded-2xl overflow-hidden mr-2'>
              <PanelGroup direction='vertical'>
                <Panel defaultSize={50} minSize={30}>
                  <div className='h-full flex flex-col'>
                    <CodeDisplay
                      level={currentLevel}
                      title='Given Code'
                      emoji='📋'
                      headerClass='header-html'
                    />
                  </div>
                </Panel>

                <PanelResizeHandle className='h-2 bg-gray-300 dark:bg-slate-800 bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-row-resize flex items-center justify-center group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
                  <div className='w-8 h-0.5 bg-gray-400 dark:bg-slate-500 bg-opacity-60 group-hover:bg-blue-400 group-hover:bg-opacity-80 rounded-full transition-all duration-300 relative z-10'></div>
                </PanelResizeHandle>

                <Panel defaultSize={50} minSize={25}>
                  <div className='h-full flex flex-col'>
                    <CodeEditor
                      value={levelContent.editableCSS}
                      language='css'
                      onChange={handleCSSChange}
                      title='Your Code'
                      emoji='✏️'
                      headerClass='header-css'
                      level={currentLevel}
                      validation={levelContent.cssValidation}
                    />
                  </div>
                </Panel>
              </PanelGroup>
            </div>
          </Panel>

          <PanelResizeHandle className='w-3 bg-gray-300 dark:bg-slate-800 bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-col-resize flex items-center justify-center group relative'>
            <div className='absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
            <div className='h-8 w-0.5 bg-gray-400 dark:bg-slate-500 bg-opacity-60 group-hover:bg-blue-400 group-hover:bg-opacity-80 rounded-full transition-all duration-300 relative z-10'></div>
          </PanelResizeHandle>

          <Panel defaultSize={50} minSize={30}>
            <Preview
              content={levelContent.previewContent}
              isCompleted={gameState.isCompleted}
              currentLevel={gameState.currentLevel}
              totalLevels={levels.length}
              onNextLevel={handleNextLevel}
            />
          </Panel>
        </PanelGroup>
      </div>

      <ConfettiEffect
        isVisible={gameState.showConfetti}
        onComplete={gameState.clearConfetti}
      />

      <ImportantModal
        isOpen={showImportantModal}
        onClose={handleCloseImportantModal}
      />
    </div>
  );
}

export default App;
