import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface ChatbotHintProps {
  hint: string
  onRevealAnswer: () => void
  isCompleted: boolean
  isFailed: boolean
  solutionCSS: string
  explanation: string
}

export default function ChatbotHint({ hint, onRevealAnswer, isCompleted, isFailed, solutionCSS, explanation }: ChatbotHintProps) {
  const { actualTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string, isCode?: boolean}>>([])
  const [hasAskedForHelp, setHasAskedForHelp] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && !hasAskedForHelp) {
      // Show initial hint when opening for the first time
      setMessages([
        { type: 'bot', content: `💡 ${hint}` }
      ])
    }
  }

  const handleAskForAnswer = () => {
    if (!hasAskedForHelp) {
      setHasAskedForHelp(true)
      setMessages(prev => [
        ...prev,
        { type: 'user', content: "I'm a dumbass, what's the answer?" },
        {
          type: 'bot',
          content: isFailed ? "You already tried and failed, but here's the solution again:" : "Okay dumbass, here's how it's done:"
        },
        { type: 'bot', content: solutionCSS, isCode: true },
        { type: 'bot', content: `💡 Why it works: ${explanation}` }
      ])
      onRevealAnswer()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[10000]">
        <button
          onClick={handleToggle}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isOpen
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          } ${actualTheme === 'dark' ? 'shadow-black/50' : 'shadow-gray-900/25'}`}
        >
          <div className="flex items-center justify-center text-white text-xl">
            {isOpen ? '✕' : '🤖'}
          </div>
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 rounded-2xl shadow-2xl z-[10000] overflow-hidden ${
          actualTheme === 'dark'
            ? 'bg-gray-800 border border-gray-600'
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b ${
            actualTheme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  CSS Helper Bot
                </h3>
                <p className={`text-xs ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Here to help (or judge)
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80">
            {messages.length === 0 ? (
              <div className={`text-center py-8 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="text-4xl mb-2">🤖</div>
                <p className="text-sm">Ask me for a hint!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isCode
                        ? `${actualTheme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'} font-mono text-xs`
                        : `${actualTheme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`
                  }`}>
                    {message.isCode ? (
                      <pre className="whitespace-pre-wrap">{message.content}</pre>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${
            actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {isCompleted ? (
              <div className={`text-center py-2 px-4 rounded-lg ${
                actualTheme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <span>🎉</span>
                  <span className="text-sm font-medium">Level completed!</span>
                </div>
              </div>
            ) : isFailed ? (
              <div className={`text-center py-2 px-4 rounded-lg ${
                actualTheme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <span>😭</span>
                  <span className="text-sm font-medium">Solution revealed</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className={`flex-1 rounded-lg border px-3 py-2 ${
                  actualTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                }`}>
                  <span className="text-sm">I'm a dumbass, what's the answer?</span>
                </div>
                <button
                  onClick={handleAskForAnswer}
                  disabled={hasAskedForHelp}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    hasAskedForHelp
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span className="text-sm">💬</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}