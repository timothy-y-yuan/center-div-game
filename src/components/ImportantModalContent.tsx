interface ImportantModalContentProps {
  actualTheme: string;
  onClose: () => void;
}

export default function ImportantModalContent({
  actualTheme,
  onClose,
}: ImportantModalContentProps) {
  return (
    <div className='p-6 relative'>
      {/* Animated background effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/50 to-yellow-50/50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 animate-pulse'></div>

      <div className='relative z-10'>
        <p
          className={`text-xl font-bold leading-relaxed mb-4 animate-pulse ${
            actualTheme === 'dark' ? 'text-red-200' : 'text-red-800'
          }`}
          style={{
            textShadow:
              '0 0 10px currentColor, 0 0 20px red, 0 0 30px orange',
          }}
        >
          <span className='text-3xl mr-2 animate-spin inline-block'>🛑</span>
          Using{' '}
          <code
            className={`px-3 py-2 rounded-md font-bold text-lg animate-bounce ${
              actualTheme === 'dark'
                ? 'bg-red-900 text-red-100 border-2 border-red-400'
                : 'bg-red-100 text-red-900 border-2 border-red-500'
            }`}
          >
            !important
          </code>{' '}
          is like using a NUCLEAR WEAPON to swat a fly!
          <span className='text-3xl ml-2 animate-ping inline-block'>💥</span>
        </p>

        <div
          className={`p-4 rounded-lg mb-4 border-l-4 border-orange-500 ${
            actualTheme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'
          }`}
        >
          <p
            className={`text-base leading-relaxed ${
              actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-800'
            }`}
          >
            <strong>🎓 EDUCATIONAL MELTDOWN:</strong> Think this popup is
            annoying?? <code>!important</code> is{' '}
            <strong>EVEN MORE ANNOYING</strong> for your codebase and fellow
            devs! It breaks the natural flow of CSS, making your stylesheets a
            nightmare to maintain.
          </p>
        </div>

        <div
          className={`p-3 rounded-lg mb-6 ${
            actualTheme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
          }`}
        >
          <p
            className={`text-sm leading-relaxed italic ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <span className='text-base mr-1'>💡</span>
            <strong>In all seriousness:</strong>{' '}
            <code className='mx-1 px-1 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700'>
              !important
            </code>
            should be reserved for rare edge cases, not everyday styling. It
            breaks CSS's natural cascade and specificity rules, making your code
            harder to maintain and debug. It creates a hierarchy where only more{' '}
            <code className='mx-1 px-1 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700'>
              !important
            </code>{' '}
            rules can override it, leading to "!important wars" in your
            codebase. Instead, master specificity, understand the cascade, and
            use proper CSS architecture - your future self (and your team) will
            thank you!
          </p>
        </div>

        {/* Dramatic action buttons */}
        <div className='flex justify-center gap-3'>
          <button
            onClick={onClose}
            data-testid='important-modal-close'
            className={`px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-110 animate-pulse ${
              actualTheme === 'dark'
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/50'
                : 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-500/50'
            }`}
          >
            <span className='mr-3 text-2xl animate-bounce inline-block'>
              😤
            </span>
            I'm a real developer who can do it the RIGHT way!
            <span
              className='ml-3 text-2xl animate-bounce inline-block'
              style={{ animationDelay: '0.2s' }}
            >
              💪
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}