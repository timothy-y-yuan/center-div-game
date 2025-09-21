# Center Div Game - Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Repository Overview

Center Div Game is an interactive React-based web application that teaches CSS centering techniques through 10 progressive levels. Built with React 19, TypeScript, Vite 5.4, Tailwind CSS v4, Monaco Editor, and comprehensive test coverage with Vitest.

## Essential Development Setup

Bootstrap the repository and validate functionality:

```bash
# Install dependencies (takes ~15 seconds)
npm install

# Start development server (ready in ~1 second)
npm run dev
# → Access at http://localhost:5173/
# → Game loads immediately with Monaco editor and live preview

# Run tests - NEVER CANCEL: All 174 tests complete in 6 seconds
npm run test:run
# Expected: ✓ 12 test files, 174 tests passed

# Run tests in watch mode for development  
npm test
```

**CRITICAL BUILD NOTE**: The build currently fails due to TypeScript errors but the development server works perfectly. Use `npm run dev` for all development work.

```bash
# Build attempt (fails in ~4 seconds due to TS errors)
npm run build
# Expected: 73 TypeScript errors, build fails
# Status: Known issue - development server works fine

# Lint check (completes in ~2 seconds)
npm run lint  
# Expected: 29 linting errors but doesn't prevent development
```

## Working Effectively

**Primary development workflow:**
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:5173/
3. Make changes in src/ directory  
4. Test automatically with hot reload
5. Run test suite: `npm run test:run`
6. Commit changes

**NEVER CANCEL timeouts:**
- `npm install`: Set timeout to 60+ seconds
- `npm run test:run`: Set timeout to 30+ seconds (actual: ~6 seconds)
- `npm run dev`: Set timeout to 30+ seconds (actual: ~2 seconds)
- `npm run lint`: Set timeout to 30+ seconds (actual: ~2 seconds)

## Manual Validation Requirements

**ALWAYS test these user scenarios after making changes:**

1. **Game Loading**: Navigate to http://localhost:5173/ and verify:
   - Game title "Can You Center The <div>?" displays
   - Level dropdown shows "1: Baby's First Center"
   - Monaco editors load with "Loading..." then show code
   - Live preview shows red cat emoji square in top-left

2. **Core Gameplay**: Test at least one complete level:
   - Click in CSS editor and add `margin: 0 auto;` to `.target`
   - Click "🎯 Check" button  
   - Verify completion detection and feedback
   - Test hint system with "💡 Hint" button

3. **Level Navigation**: 
   - Use level dropdown to switch between levels 1-10
   - Verify each level loads with correct constraints and content
   - Test settings dropdown functionality

**Screenshots required**: Take screenshots of the running application after any UI changes.

## Repository Structure & Key Files

**Core application files:**
- `src/App.tsx` - Main game component with state management
- `src/components/` - UI components (Header, CodeEditor, Preview, etc.)  
- `src/data/levels.ts` - 10 level definitions with constraints and solutions
- `src/test/` - 12 test files with 174 comprehensive tests
- `src/types.ts` - TypeScript interfaces and types

**Configuration files:**
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration with Vitest setup
- `tailwind.config.js` - Tailwind CSS v4 configuration
- `eslint.config.js` - ESLint configuration
- `tsconfig.json` - TypeScript project references

**Critical locations for common changes:**
- Game logic: `src/App.tsx` (lines 59-100 contain completion checking)
- Level definitions: `src/data/levels.ts` (10 comprehensive levels)
- Styling: `src/index.css` (Tailwind v4 imports and Monaco editor overrides)
- Test utilities: `src/test/setup.ts` (localStorage and matchMedia mocks)

## Known Issues & Workarounds

**TypeScript Build Errors**: 
- Build fails with 73 TypeScript errors related to type mismatches
- Workaround: Use `npm run dev` for development, build issues don't affect functionality
- Development server works perfectly despite build errors

**Font Loading Issues**:
- External fonts (Google Fonts, jsDelivr) may be blocked in some environments
- Monaco Editor uses fallback fonts automatically
- Victor Mono font loads when available, defaults gracefully

**Linting Warnings**:
- 29 ESLint errors exist but don't prevent development
- Run `npm run lint` to see current issues
- Focus on functionality over linting perfection for development

## Technology Stack Details

**Frontend Framework**: React 19 with TypeScript
- Uses React 19 features and hooks
- All components in `src/components/`
- Context providers in `src/contexts/`

**Build & Development**: Vite 5.4
- Dev server: `npm run dev` → http://localhost:5173/
- Preview: `npm run preview` → http://localhost:4173/ (requires successful build)
- Hot module replacement enabled

**Styling**: Tailwind CSS v4  
- Import syntax: `@import "tailwindcss"` in `src/index.css`
- Uses `@tailwindcss/vite` plugin
- Custom glassmorphism effects with `.glass` utility

**Testing**: Vitest with Testing Library
- 174 tests across 12 files
- Tests include component rendering, user interactions, and game logic
- Setup file: `src/test/setup.ts` with localStorage and matchMedia mocks

**Code Editor**: Monaco Editor (@monaco-editor/react)
- Syntax highlighting and IntelliSense for HTML/CSS
- Victor Mono font with ligatures when available
- Real-time code validation and preview

## Validation Checklist

Before completing any change:

1. **Run and pass**: `npm run test:run` (NEVER CANCEL - 6 seconds)
2. **Start successfully**: `npm run dev` (NEVER CANCEL - 2 seconds)  
3. **Load application**: Navigate to http://localhost:5173/
4. **Test core functionality**: Complete at least level 1 of the game
5. **Check responsive design**: Test different viewport sizes
6. **Validate no regressions**: Ensure existing features still work

## Common Commands Reference

```bash
# Development workflow
npm install                    # Install dependencies (~15s)
npm run dev                   # Start dev server (~2s)
npm run test:run              # Run all tests (~6s) - NEVER CANCEL
npm test                      # Run tests in watch mode
npm run lint                  # Check linting (~2s)

# Advanced testing  
npm run test:ui               # Vitest UI interface
vitest --reporter=verbose     # Detailed test output

# Build (currently fails due to TS errors)
npm run build                 # TypeScript + Vite build (~4s when failing)

# Never run these without NEVER CANCEL warnings
npm run build                 # Set timeout 60+ seconds  
npm run test:run              # Set timeout 30+ seconds
npm install                   # Set timeout 60+ seconds
```

## Development Philosophy

**Always validate changes immediately:**
- Code changes → run tests → start dev server → test manually
- Component changes → check all related tests still pass  
- Type changes → expect build failures but verify dev server works
- UI changes → take screenshot to document visual impact

**Test-driven development:**
- 174 comprehensive tests validate core functionality
- Tests serve as living documentation of expected behavior
- Run `npm run test:run` after every change
- Fix failing tests before adding new features

**Hot reload development:**
- Make changes in `src/` directory
- Changes appear immediately in browser at http://localhost:5173/
- No need to restart dev server for most changes
- Monaco editor and game state preserved across reloads