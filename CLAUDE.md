# Center Div Game - Claude AI Project Documentation

## Project Overview

"Can You Center The <div>?" - A comprehensive, interactive web game for mastering CSS centering techniques. Now featuring **10 progressive levels**, complete progress persistence, advanced UI components, and multiple themes. Built with React 19 + TypeScript + Tailwind CSS v4.

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Format code with Prettier
npm run format

# Check Prettier formatting
npm run format:check

# Run type checking (if available)
npm run typecheck
```

## Architecture & Components

### Core Files

- `src/App.tsx` - Main app component with comprehensive game state and progress persistence
- `src/components/Header.tsx` - Advanced header with level selection, progress tracking, and player titles
- `src/components/CodeEditor.tsx` - Monaco Editor wrapper with Victor Mono font and syntax highlighting
- `src/components/Preview.tsx` - Live preview iframe with completion detection and confetti effects
- `src/components/ConfettiEffect.tsx` - Celebration animations for level completion
- `src/components/HintPopup.tsx` - Advanced hint system with positioning and animations
- `src/components/LevelDropdown.tsx` - Level navigation with completion status indicators
- `src/components/SettingsDropdown.tsx` - Game settings and progress management
- `src/components/ThemeDropdown.tsx` - Theme selection and customization
- `src/components/ChatbotHint.tsx` - Interactive chatbot-style hint interface
- `src/data/levels.ts` - **10 comprehensive levels** with detailed explanations and solutions
- `src/types.ts` - Comprehensive TypeScript interfaces for levels, progress, and user data
- `src/contexts/themeContext.ts` - Theme management context

### Key Technologies

- **React 19** with TypeScript
- **Vite 5.4** as build tool and dev server
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax)
- **Monaco Editor** for advanced code editing with ligatures
- **react-resizable-panels** for draggable split-screen layouts
- **Vitest** for comprehensive testing
- **ESLint** with TypeScript support for code quality

### Styling Notes

- Uses Tailwind v4 with new syntax in `src/index.css`
- Custom CSS overrides for Monaco Editor fonts (Victor Mono)
- Material 3 Expressive design patterns
- Glassmorphism effects with `glass` utility class

## Game Mechanics

### Level Progression (10 Levels)

1. **Level 1**: "Baby's First Center" - Horizontal centering with `margin: 0 auto`
2. **Level 2**: "Add Vertical Too" - Full centering with Flexbox
3. **Level 3**: "Grid Power" - Centering with CSS Grid's `place-items`
4. **Level 4**: "Absolute Beginner" - Absolute positioning with transforms
5. **Level 5**: "Text-Align Hack" - Old-school inline-block with pseudo-elements
6. **Level 6**: "Table Cell Vibes" - Table-cell display centering
7. **Level 7**: "CSS Calc() Wizard" - Mathematical positioning with calc()
8. **Level 8**: "Margin Auto Magic" - Absolute positioning with all-sides margin auto
9. **Level 9**: "Multiple Targets" - Centering multiple elements with flexbox
10. **Level 10**: "CSS Ninja Final Boss" - Advanced responsive centering with clamp()

### Advanced Progress System

- **Comprehensive persistence**: All progress saved to localStorage
- **Detailed tracking**: Completion time, attempts, hint usage per level
- **Player progression**: Dynamic titles based on completion count (from "0.001x Engineer" to "CSS Ninja")
- **Failed levels**: Tracks when users reveal answers (prevents completion credit)
- **Statistics**: Total play time, average completion time, attempt counts

### Completion Logic

- Located in `src/App.tsx:59-100` (`checkCompletion` function)
- Real-time iframe DOM measurement for precise centering detection
- Level 1 only requires horizontal centering (5px tolerance)
- Levels 2-10 require both horizontal and vertical centering (5px tolerance)
- Confetti effects trigger on first-time completion
- Progress immediately persisted to localStorage

## Development Notes

### ⚠️ CRITICAL: Code Quality & Standards

This project maintains exceptionally high code quality and readability standards. Every contribution must meet these requirements.

#### Code Quality Requirements

**Readability Standards:**

- All code must be written with obsessive attention to readability and clarity
- TypeScript must be used properly with comprehensive type safety
- Every function, interface, and complex logic must have clear, descriptive names
- Comments should explain _why_, not _what_ (the code should be self-documenting)
- Prefer longer, descriptive variable names over cryptic abbreviations
- Break complex logic into smaller, well-named functions
- Use consistent patterns and conventions throughout the codebase

**Pull Request Requirements:**
Before any pull request can be approved, ALL of the following must pass:

1. **Build Success**: `npm run build` must complete without errors
2. **Test Coverage**: `npm run test:run` must pass all tests (174+ tests)
3. **Linting**: `npm run lint` must pass without warnings
4. **Code Formatting**: `npm run format:check` must pass without errors
5. **Type Checking**: TypeScript compilation must succeed
6. **Manual Testing**: Core game functionality must be verified working

#### Essential Testing Workflow

**CRITICAL REMINDER**: After making ANY code changes, always validate:

```bash
# 1. Run the full test suite
npm run test:run

# 2. Check linting
npm run lint

# 3. Check Prettier formatting
npm run format:check

# 4. Verify build succeeds
npm run build

# 5. Start dev server and test manually
npm run dev
```

**Why this matters:**

- Tests catch breaking changes immediately
- Linting enforces code quality standards
- Build failures indicate type safety issues
- Manual testing verifies user experience

**Test failure workflow:**

1. Run tests after changes: `npm run test:run`
2. If tests fail, update them to match new interfaces/behavior
3. Ensure new functionality has appropriate test coverage
4. Fix all linting errors: `npm run lint`
5. Ensure build succeeds: `npm run build`
6. Re-run all validations until they pass
7. Only then commit changes

**Branching reminder:**

- ALWAYS create new branches from `main`, never from feature branches
- Use: `git checkout main && git checkout -b feature/your-feature-name`

**Automatic Rejection Criteria:**
Pull requests will be automatically rejected if:

- Build fails with TypeScript errors
- Any tests fail or are broken
- ESLint warnings exist
- Prettier formatting violations exist (run `npm run format` to fix)
- Code contains unclear variable names or functions
- Code lacks type safety or uses `any` types inappropriately

### Font Configuration

Monaco Editor uses Victor Mono with aggressive CSS overrides in `src/index.css`:

```css
.monaco-editor .view-lines .view-line,
.monaco-editor .view-lines .view-line span {
  font-family:
    'Victor Mono', 'SF Mono', Monaco, Menlo, 'Ubuntu Mono', Consolas,
    'Courier New', monospace !important;
  font-variant-ligatures: normal !important;
  font-feature-settings:
    'liga' 1,
    'calt' 1 !important;
}
```

### Tailwind v4 Setup

- Uses `@tailwindcss/vite` plugin in `vite.config.ts`
- Import statement: `@import "tailwindcss";` (not v3 syntax)
- Content scanning configured in `tailwind.config.js`

### State Management

Comprehensive game state managed in App.tsx:

- `currentLevel` - Current level index (0-based, persisted)
- `html/css` - Current code editor values (auto-loads from level data)
- `isCompleted` - Whether current level is solved (checks failed status)
- `showHint` - Hint visibility toggle
- `completedLevels` - Set of completed level indices (persisted)
- `failedLevels` - Set of failed level indices (persisted)
- `showConfetti` - Confetti animation trigger
- `userProgress` - Detailed progress tracking (NEW in recent implementation)

## Known Issues & Solutions

### Common Problems

1. **Tailwind not working**: Ensure using v4 syntax `@import "tailwindcss"`
2. **Monaco fonts wrong**: Check CSS overrides in index.css
3. **Dev server cache**: Clear with `rm -rf node_modules/.vite`

### Browser Compatibility

- Requires modern browsers for CSS Grid and Flexbox
- Monaco Editor needs ES6+ support
- iframe srcDoc used for live preview

## Recent Major Updates

- ✅ **Expanded to 10 levels** with comprehensive CSS centering techniques
- ✅ **Complete progress persistence** system with localStorage
- ✅ **Advanced UI components** (dropdowns, hints, confetti, themes)
- ✅ **Player progression system** with dynamic titles
- ✅ **Detailed progress tracking** (attempts, timing, hints used)
- ✅ **Testing framework** with Vitest
- ✅ **Theme system** with multiple visual options

## Future Enhancements

- Additional centering techniques (CSS transforms, logical properties)
- More complex multi-element layout challenges
- User accounts with cloud progress sync
- Mobile responsive design improvements
- Accessibility features for screen readers
- Level editor for custom challenges
- Multiplayer/competitive modes
- Integration with CSS learning platforms

## File Structure

```
src/
├── components/
│   ├── Header.tsx              # Advanced header with level navigation
│   ├── CodeEditor.tsx          # Monaco editor wrapper
│   ├── Preview.tsx             # Live preview with completion detection
│   ├── ConfettiEffect.tsx      # Celebration animations
│   ├── HintPopup.tsx          # Positioned hint overlay
│   ├── LevelDropdown.tsx      # Level selection with progress indicators
│   ├── SettingsDropdown.tsx   # Game settings and progress reset
│   ├── ThemeDropdown.tsx      # Theme selection interface
│   └── ChatbotHint.tsx        # Interactive hint chatbot
├── contexts/
│   └── themeContext.ts       # Theme state management
├── data/
│   └── levels.ts              # 10 comprehensive level definitions
├── hooks/                     # (empty, reserved for future)
├── utils/                     # (empty, reserved for future)
├── test/                      # Vitest test files
├── types.ts                   # Comprehensive TypeScript interfaces
├── App.tsx                    # Main game component with state
├── index.css                  # Tailwind v4 + custom styles
├── main.tsx                   # React root and setup
└── vite-env.d.ts             # Vite type definitions
```

---

---

# important-instruction-reminders

This project maintains exceptionally high readability and code quality standards. Every single contribution must meet these requirements:

**Mandatory Validation Checklist:**

- [ ] `npm run build` completes successfully without TypeScript errors
- [ ] `npm run test:run` passes all tests completely
- [ ] `npm run lint` passes without any warnings
- [ ] Code uses descriptive variable and function names
- [ ] Complex logic is broken into well-named, focused functions
- [ ] TypeScript types are comprehensive and accurate (no `any` types)
- [ ] Code follows established patterns and conventions
- [ ] Manual testing confirms game functionality works

**Code Quality Standards:**

- Write code with obsessive attention to clarity and readability
- Use self-documenting code practices (clear names, obvious structure)
- Break complex logic into smaller, well-named functions
- Maintain comprehensive TypeScript type safety
- Follow consistent patterns throughout the codebase

**AUTOMATIC REJECTION:** Pull requests will be rejected if build, tests, or linting fail, or if code quality standards are not met.

---

**Last updated:** Session with comprehensive progress system implementation completed
**Dev server:** http://localhost:5173/
**Current status:** Fully functional 10-level CSS centering game with persistence
