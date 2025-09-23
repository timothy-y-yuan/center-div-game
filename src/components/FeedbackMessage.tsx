import type { ValidationFeedback as ValidationFeedbackData } from '../types';

interface FeedbackMessageProps {
  feedback: ValidationFeedbackData;
  actualTheme: string;
}

export default function FeedbackMessage({
  feedback,
  actualTheme,
}: FeedbackMessageProps) {
  const generateFeedbackMessage = (): string => {
    if (feedback.isCompleted) {
      return 'Perfect! Your element is properly centered! 🎉';
    }

    const issues: string[] = [];

    if (feedback.requiresHorizontal && !feedback.horizontalCentered) {
      issues.push(
        `horizontally off by ${feedback.horizontalOffset.toFixed(1)}px`
      );
    }

    if (feedback.requiresVertical && !feedback.verticallyCentered) {
      issues.push(`vertically off by ${feedback.verticalOffset.toFixed(1)}px`);
    }

    if (issues.length === 0) {
      return 'Hmm, something went wrong with the validation...';
    }

    return `Close! Your element is ${issues.join(' and ')}.`;
  };

  return (
    <p
      className={`text-sm leading-relaxed mb-3 ${
        actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      }`}
    >
      {generateFeedbackMessage()}
    </p>
  );
}