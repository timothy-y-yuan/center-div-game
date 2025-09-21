/**
 * @fileoverview Live preview component with iframe rendering
 */

import { memo } from 'react';

interface PreviewProps {
  content: string;
  isCompleted: boolean;
  currentLevel: number;
  totalLevels: number;
  onNextLevel: () => void;
}

/**
 * Live preview component showing the rendered HTML/CSS
 * Memoized to prevent unnecessary iframe re-renders
 */
const Preview = memo(function Preview({
  content,
  isCompleted,
  currentLevel,
  totalLevels,
  onNextLevel,
}: PreviewProps) {
  return (
    <div className="h-full flex flex-col glass rounded-2xl overflow-hidden ml-2">
      <div className="header-preview p-4">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <span className="text-2xl">👀</span>
          <span className="text-emerald-700 dark:text-emerald-200">
            Live Preview
          </span>
        </h3>
      </div>
      <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <iframe
          id="preview"
          srcDoc={content}
          className="w-full h-full border-0 rounded-xl shadow-lg bg-white"
        />
      </div>
      {isCompleted && currentLevel < totalLevels - 1 && (
        <div className="p-6 bg-emerald-600 bg-opacity-10 border-t border-emerald-500 border-opacity-20">
          <button
            onClick={onNextLevel}
            className="btn-success w-full flex items-center justify-center gap-3"
          >
            <span className="text-xl">🚀</span>
            <span>Next Level</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      )}
      {isCompleted && currentLevel === totalLevels - 1 && (
        <div className="p-6 bg-yellow-600 bg-opacity-10 border-t border-yellow-500 border-opacity-20">
          <div className="text-center">
            <div className="text-5xl mb-3 animate-bounce">🎉</div>
            <p className="font-black text-2xl bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-2">
              CSS Legend Unlocked!
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              All levels conquered 🏆
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default Preview;
