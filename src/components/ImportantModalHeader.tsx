interface ImportantModalHeaderProps {
  bounceTitle: boolean;
}

export default function ImportantModalHeader({
  bounceTitle,
}: ImportantModalHeaderProps) {
  return (
    <div className='p-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden'>
      {/* Animated background pattern */}
      <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-red-400/20 to-pink-400/20 animate-pulse'></div>
      <div className='absolute inset-0 bg-gradient-to-l from-red-700/30 via-transparent to-red-700/30 animate-ping'></div>

      <div className='flex items-center gap-3 relative z-10'>
        <span className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''}`}>
          🚨
        </span>
        <h3
          className={`font-bold text-white text-xl tracking-wide ${bounceTitle ? 'animate-pulse' : ''}`}
        >
          🔥💀 Well, aren't YOU !important?? 💀🔥
        </h3>
        <span
          className={`text-3xl ${bounceTitle ? 'animate-bounce' : ''} rotate-12`}
        >
          🚨
        </span>
      </div>

      {/* Multiple Flashing warning stripes for maximum obnoxiousness */}
      <div className='absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse'></div>
      <div className='absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 animate-ping'></div>
    </div>
  );
}