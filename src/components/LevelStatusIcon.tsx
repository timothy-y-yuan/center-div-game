interface LevelStatusIconProps {
  isCompleted: boolean;
  isFailed: boolean;
}

export default function LevelStatusIcon({
  isCompleted,
  isFailed,
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
    <div className='w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500' />
  );
}
