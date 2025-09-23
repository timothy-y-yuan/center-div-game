export default function CreditsSection() {
  return (
    <div className='px-4 py-3'>
      <div className='text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>
        👨‍💻 Credits
      </div>
      <div className='text-xs leading-relaxed text-gray-600 dark:text-gray-300'>
        <div className='mb-1'>
          <strong>Game Design & Development:</strong>{' '}
          <a
            href='https://github.com/timothy-y-yuan'
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium transition-colors text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200'
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
