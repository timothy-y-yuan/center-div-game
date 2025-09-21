# Contributing to Center Div Game

Thank you for your interest in contributing to the Center Div Game! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. This is an educational project aimed at helping people learn CSS.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of React, TypeScript, and CSS

### Setup
```bash
# Clone the repository
git clone https://github.com/timothy-y-yuan/center-div-game.git
cd center-div-game

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (always do this before contributing!)
npm run test:run
```

## Development Workflow

### 1. Before You Start
- Check existing issues and PRs to avoid duplication
- Create an issue to discuss large changes
- Always work on a feature branch from `main`

### 2. Making Changes

```bash
# Create a feature branch
git checkout main
git checkout -b feature/your-feature-name

# Make your changes
# Always run tests after changes
npm run test:run

# Check linting
npm run lint

# Ensure build works
npm run build
```

### 3. Testing Requirements

**CRITICAL**: Always run the full test suite before submitting:

```bash
# Must pass before contributing
npm run test:run     # All 174+ tests must pass
npm run lint         # Fix all linting issues
npm run build        # Must compile without errors
```

### 4. Commit Guidelines

Use clear, descriptive commit messages:
```
feat: add new CSS grid centering level
fix: resolve Monaco editor font loading issue
docs: update level progression documentation
test: add comprehensive tests for theme switching
```

## Types of Contributions

### 🎯 New Game Levels
- Follow existing level structure in `src/data/levels.ts`
- Include comprehensive explanation and solution
- Add corresponding tests
- Ensure completion detection works correctly

### 🐛 Bug Fixes
- Include test cases that reproduce the bug
- Fix the issue with minimal changes
- Update tests to prevent regression
- Document the fix in PR description

### ✨ Feature Enhancements
- Discuss in an issue first for large features
- Maintain backward compatibility
- Add comprehensive tests
- Update documentation

### 📚 Documentation
- Keep documentation current with code changes
- Use clear, beginner-friendly language
- Include code examples where helpful
- Test any setup instructions

## Code Standards

### TypeScript
```typescript
// Use proper interfaces, avoid 'any'
interface LevelProps {
  level: Level;
  isCompleted: boolean;
  onComplete: () => void;
}

// Use strict typing
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // implementation
};
```

### React Components
```tsx
// Use functional components with hooks
export default function Component({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState<StateType>(initialValue);
  
  // Follow existing patterns for localStorage persistence
  useEffect(() => {
    localStorage.setItem('key', JSON.stringify(state));
  }, [state]);

  return (
    <div className="consistent-tailwind-classes">
      {/* Component content */}
    </div>
  );
}
```

### CSS/Tailwind
- Use Tailwind CSS v4 syntax (`@import "tailwindcss";`)
- Follow existing component patterns
- Maintain dark mode support
- Use semantic color classes

### Testing
```typescript
// Mock external dependencies properly
const mockProps: ComponentProps = {
  onAction: vi.fn(),
  data: mockData,
  isActive: false
};

// Test user interactions
fireEvent.click(screen.getByRole('button', { name: /action/i }));
expect(mockProps.onAction).toHaveBeenCalled();
```

## Project-Specific Guidelines

### Game Level Development
1. **Level Structure**: Each level must have title, description, HTML template, solution, and explanation
2. **Completion Detection**: Levels 2-10 require both horizontal and vertical centering (5px tolerance)
3. **Educational Value**: Explanations should teach concepts clearly
4. **Progressive Difficulty**: Each level should build on previous concepts

### Monaco Editor Changes
- Test with Victor Mono font loading
- Verify ligature support works
- Check CSS override effectiveness
- Test across different browsers

### Theme System
- Support all existing themes
- Test light/dark mode transitions
- Maintain consistent color schemes
- Update theme context properly

### Progress Tracking
- Maintain backward compatibility with existing progress data
- Test localStorage persistence thoroughly
- Handle edge cases (corrupted data, etc.)
- Verify completion detection accuracy

## Review Process

### PR Requirements
- [ ] All tests pass (`npm run test:run`)
- [ ] No linting errors (`npm run lint`)
- [ ] Builds successfully (`npm run build`)
- [ ] Comprehensive description of changes
- [ ] Screenshots for UI changes
- [ ] Updated tests for new functionality
- [ ] Documentation updated if needed

### What Reviewers Look For
- Code quality and consistency
- Test coverage and reliability
- Performance implications
- Accessibility considerations
- Educational value (for game content)
- Backward compatibility

## Need Help?

- **Questions**: Open a discussion or issue
- **Stuck on tests**: Check existing test patterns in `src/test/`
- **Build issues**: Ensure Node.js 18+ and clean `npm install`
- **CSS problems**: Verify Tailwind v4 syntax usage

## Recognition

Contributors will be recognized in:
- Project documentation
- Release notes for significant contributions
- Settings dropdown credits section

Thank you for contributing to help others learn CSS! 🎯