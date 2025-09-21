export interface Level {
  id: number;
  title: string;
  description: string;
  initialHTML: string;
  initialCSS: string;
  hint: string;
  solutionCSS: string;
  explanation: string;
}

export interface LevelProgress {
  /** Whether the level has been completed */
  completed: boolean;
  /** Number of times the level has been attempted */
  attempts: number;
  /** Time taken to complete the level (in milliseconds), null if not completed */
  completionTime: number | null;
  /** Timestamp when the level was first started */
  firstAttemptTime: number;
  /** Timestamp when the level was completed, null if not completed */
  completedTime: number | null;
  /** Whether hints were used during completion */
  hintsUsed: boolean;
  /** The user's successful CSS solution (if completed) */
  successfulSolution?: string;
}

export interface UserProgress {
  /** Progress data for each level, keyed by level ID */
  levels: Record<number, LevelProgress>;
  /** Overall statistics */
  stats: {
    totalLevelsCompleted: number;
    totalPlayTime: number;
    averageCompletionTime: number;
    totalAttempts: number;
  };
  /** When the user first started playing */
  firstPlayTime: number;
  /** Last time progress was updated */
  lastUpdated: number;
}
