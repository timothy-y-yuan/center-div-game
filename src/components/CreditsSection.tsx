interface CreditsSectionProps {
  actualTheme: string;
}

export default function CreditsSection({ actualTheme }: CreditsSectionProps) {
  return (
    <div className='px-4 py-3'>
      <div
        className={`text-sm font-medium mb-2 ${
          actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        👨‍💻 Credits
      </div>
      <div
        className={`text-xs leading-relaxed ${
          actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        <div className='mb-1'>
          <strong>Game Design & Development:</strong>{' '}
          <a
            href='https://github.com/timothy-y-yuan'
            target='_blank'
            rel='noopener noreferrer'
            className={`font-medium transition-colors ${
              actualTheme === 'dark'
                ? 'text-blue-300 hover:text-blue-200'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            @timothy-y-yuan
          </a>
        </div>
        <div className='text-xs text-center mt-3 pt-2 border-t border-gray-600 dark:border-gray-700'>
          <em>Vibe coded with Claude Code ✨</em> <br />
          <em>
            (sort of? i kinda got invested and started doing things myself)
          </em>
        </div>
      </div>
    </div>
  );
}
