# GitHub Copilot Instructions for Center Div Game

## Project Overview

This is a **CSS centering game** built with React 19, TypeScript, and modern web technologies. It teaches CSS centering techniques through interactive levels with real-time preview and comprehensive progress tracking.

## Architecture & Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Architecture**: Service layer pattern with custom hooks
- **Styling**: Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- **Code Editor**: Monaco Editor with Victor Mono font and ligatures
- **Testing**: Vitest with comprehensive test coverage
- **Layout**: react-resizable-panels for split-screen experience
- **Build**: Vite with ESLint and TypeScript checking
- **State Management**: Custom hooks with service layer abstraction

## Development Guidelines

### Code Style & Standards

- **Always run tests** after changes: `npm run test:run`
- **Use TypeScript strictly** - avoid `any` types, prefer proper interfaces
- **Follow existing patterns** - match component structure and naming conventions
- **Maintain test coverage** - update tests when modifying components
- **Use semantic commits** - clear, descriptive commit messages

### Key Development Commands

```bash
# Development server
npm run dev

# Type checking & build
npm run build

# Linting (fix issues)
npm run lint

# Tests (comprehensive suite)
npm run test:run          # Single run
npm run test             # Watch mode
npm run test:ui          # UI mode
```

### Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Level navigation & progress
│   ├── CodeEditor.tsx   # Monaco editor wrapper
│   ├── Preview.tsx      # Live preview with completion detection
│   └── ...              # Other UI components
├── contexts/
│   └── ThemeContext.tsx # Theme management
├── services/            # Service layer
│   ├── GameStateService.ts  # Game state management logic
│   └── StorageService.ts    # LocalStorage abstraction
├── hooks/               # Custom React hooks
│   ├── useGameState.ts  # Main game state hook
│   ├── useProgress.ts   # Progress tracking hook
│   ├── useLevelCompletion.ts # Level completion logic
│   └── useLevelContent.ts   # Level content management
├── constants/           # Configuration constants
│   └── index.ts         # UI, game, and educational constants
├── data/
│   └── levels.ts        # Game level definitions (10 levels)
├── test/                # Comprehensive test suite
├── utils/               # Utility functions
│   └── typeHelpers.ts   # Type safety helpers with branded types
└── types.ts            # TypeScript interfaces
```

## Important Implementation Details

### Monaco Editor Configuration

- Uses Victor Mono font with CSS overrides in `src/index.css`
- Requires specific font-feature-settings for ligatures
- CSS overrides use `!important` to ensure proper rendering

### Tailwind CSS v4

- Uses new syntax: `@import "tailwindcss";` (NOT v3 syntax)
- Configured via `@tailwindcss/vite` plugin in `vite.config.ts`
- Glass morphism effects via custom `glass` utility class

### Game State Management

- **Service Layer**: Centralized game logic in `GameStateService.ts` and `StorageService.ts`
- **Custom Hooks**: Domain-specific hooks for different aspects of game state
- **Branded Types**: Type-safe IDs and measurements using branded types from `typeHelpers.ts`
- **Comprehensive progress tracking** with localStorage persistence
- **Level completion detection** via real-time iframe DOM measurement
- **Player progression system** with dynamic titles
- **Confetti effects** on level completion

### Service Layer Architecture

The project uses a clean service layer pattern:

```typescript
// Services handle business logic
import { gameStateService } from '../services/GameStateService';
import { storageService } from '../services/StorageService';

// Hooks provide React integration
import { useGameState } from '../hooks/useGameState';
import { useProgress } from '../hooks/useProgress';

// Types are branded for safety
import { createLevelId, createTimestampMs } from '../utils/typeHelpers';
```

### Testing Strategy

- 174+ comprehensive tests covering all components
- Uses happy-dom environment for fast DOM testing
- Mock implementations for localStorage and window.matchMedia
- Component testing with React Testing Library

## Critical Patterns

### Service Layer Usage

Always use the service layer for business logic:

```typescript
// ✅ Good - Use services for business logic
import { gameStateService } from '../services/GameStateService';

const handleLevelComplete = () => {
  gameStateService.markLevelCompleted(levelId);
  storageService.saveProgress(progress);
};

// ❌ Avoid - Don't put business logic in components
const handleLevelComplete = () => {
  setCompletedLevels(new Set([...completedLevels, levelIndex]));
  localStorage.setItem('completedLevels', JSON.stringify([...completedLevels, levelIndex]));
};
```

### Custom Hook Patterns

Use domain-specific hooks for React state management:

```typescript
// ✅ Good - Use custom hooks
function GameComponent() {
  const gameState = useGameState(levels);
  const progress = useProgress();
  const completion = useLevelCompletion(currentLevel);
  
  return <GameUI {...gameState} />;
}
```

### Branded Types

Use branded types from `typeHelpers.ts` for type safety:

```typescript
// ✅ Good - Use branded types
import { createLevelId, createTimestampMs } from '../utils/typeHelpers';

const levelId = createLevelId(1);
const timestamp = createTimestampMs();

// ❌ Avoid - Raw primitives
const levelId = 1;
const timestamp = Date.now();
```

### Component Props

Always include proper TypeScript interfaces:

```typescript
interface ComponentProps {
  // Use specific types, avoid 'any'
  onAction: () => void;
  data: SpecificType[];
  isActive: boolean;
}

### CSS Class Patterns

Use consistent Tailwind patterns:

```tsx
<div className="glass rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
```

## Testing Requirements

### When Modifying Components

1. **Update corresponding tests** in `src/test/`
2. **Ensure all interfaces match** between components and tests
3. **Run full test suite** before committing: `npm run test:run`
4. **Check TypeScript compilation**: `npm run build`

### Test Patterns

```typescript
// Use proper typing in tests
const mockProps: ComponentProps = {
  onAction: vi.fn(),
  data: mockData,
  isActive: false
};

// Test service layer integration
import { gameStateService } from '../services/GameStateService';

vi.mock('../services/GameStateService');
const mockGameStateService = vi.mocked(gameStateService);

// Test user interactions
fireEvent.click(screen.getByRole('button', { name: /action/i }));
expect(mockProps.onAction).toHaveBeenCalled();
```

## Common Issues & Solutions

### Build Failures

1. **TypeScript errors**: Fix unused imports, proper typing
2. **Tailwind not working**: Ensure v4 syntax in imports
3. **Monaco Editor fonts**: Check CSS overrides in `src/index.css`
4. **Test failures**: Update test interfaces to match component changes

### Development Workflow

1. Create feature branch from `main`
2. Make minimal, focused changes
3. Run tests continuously: `npm test`
4. Fix linting issues: `npm run lint`
5. Build successfully: `npm run build`
6. Commit with clear messages

## Performance Considerations

- **Monaco Editor**: Lazy loading and proper cleanup
- **Iframe Preview**: Debounced updates for real-time rendering
- **LocalStorage**: Efficient serialization of progress data
- **Confetti Effects**: Cleanup after animations

## Accessibility

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly content
- High contrast theme support

## Security

- Sanitized iframe content (uses `srcDoc`)
- No eval() or unsafe dynamic code execution
- localStorage data validation
- Proper TypeScript typing prevents injection

## Future Enhancements

When extending the project:

- Add new levels in `src/data/levels.ts`
- Follow existing level structure and validation patterns
- Maintain test coverage for new features
- Consider mobile responsiveness
- Preserve backward compatibility with progress data

---

**Remember**: This is an educational project focused on CSS learning. Keep solutions clear, well-documented, and aligned with modern web development practices.