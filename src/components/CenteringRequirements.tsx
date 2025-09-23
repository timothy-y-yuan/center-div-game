import type { ValidationFeedback as ValidationFeedbackData } from '../types';

interface CenteringRequirementsProps {
  feedback: ValidationFeedbackData;
  actualTheme: string;
}

export default function CenteringRequirements({
  feedback,
  actualTheme,
}: CenteringRequirementsProps) {
  if (feedback.isCompleted) {
    return null;
  }

  return (
    <div
      className={`text-xs p-3 rounded-lg ${
        actualTheme === 'dark'
          ? 'bg-gray-900 border border-gray-700'
          : 'bg-gray-100 border border-gray-300'
      }`}
    >
      <div className='font-semibold mb-2 text-gray-600 dark:text-gray-400'>
        Centering Requirements:
      </div>
      <div className='space-y-1'>
        {feedback.requiresHorizontal && (
          <div className='flex items-center gap-2'>
            <span className={feedback.horizontalCentered ? '✅' : '❌'}>
              {feedback.horizontalCentered ? '✅' : '❌'}
            </span>
            <span
              className={
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }
            >
              Horizontal centering{' '}
              {feedback.horizontalCentered
                ? '(Perfect!)'
                : `(Off by ${feedback.horizontalOffset.toFixed(1)}px)`}
            </span>
          </div>
        )}
        {feedback.requiresVertical && (
          <div className='flex items-center gap-2'>
            <span className={feedback.verticallyCentered ? '✅' : '❌'}>
              {feedback.verticallyCentered ? '✅' : '❌'}
            </span>
            <span
              className={
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }
            >
              Vertical centering{' '}
              {feedback.verticallyCentered
                ? '(Perfect!)'
                : `(Off by ${feedback.verticalOffset.toFixed(1)}px)`}
            </span>
          </div>
        )}
      </div>
      <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
        💡 Tolerance: Elements within 5px are considered centered
      </div>
    </div>
  );
}
