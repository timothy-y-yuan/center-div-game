interface LevelStatusIconProps {
  isCompleted: boolean;
  isFailed: boolean;
  actualTheme: string;
}

export default function LevelStatusIcon({
  isCompleted,
  isFailed,
  actualTheme,
}: LevelStatusIconProps) {
  if (isCompleted) {
    return (
      <div className='w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-sm'>
        🎉
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className='w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm'>
        😭
      </div>
    );
  }

  return (
    <div
      className={`w-6 h-6 rounded-full border-2 ${
        actualTheme === 'dark' ? 'border-gray-500' : 'border-gray-300'
      }`}
    />
  );
}