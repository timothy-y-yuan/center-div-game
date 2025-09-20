# Center Div Game - Claude AI Project Documentation

## Project Overview
"Can You Center The <div>?" - A modern, interactive web game for learning CSS centering techniques. Built with React + TypeScript + Tailwind CSS v4, featuring a split-screen Monaco code editor and live preview.

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

# Run linting (if configured)
npm run lint

# Run type checking
npm run typecheck
```

## Architecture & Components

### Core Files
- `src/App.tsx` - Main app component with game state management
- `src/components/Header.tsx` - Top bar with title, level info, and controls
- `src/components/CodeEditor.tsx` - Monaco Editor wrapper with custom font config
- `src/components/Preview.tsx` - Live preview iframe with completion UI
- `src/data/levels.ts` - Game level definitions and progression
- `src/types.ts` - TypeScript interfaces

### Key Technologies
- **React 18** with TypeScript
- **Vite** as build tool
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax)
- **Monaco Editor** for code editing
- **react-resizable-panels** for draggable layouts

### Styling Notes
- Uses Tailwind v4 with new syntax in `src/index.css`
- Custom CSS overrides for Monaco Editor fonts (Victor Mono)
- Material 3 Expressive design patterns
- Glassmorphism effects with `glass` utility class

## Game Mechanics

### Level Progression
1. **Level 1**: Horizontal centering only (`margin: 0 auto`)
2. **Level 2**: Full centering with Flexbox
3. **Level 3**: Centering with CSS Grid

### Completion Logic
- Located in `src/App.tsx:15-46` (`checkCompletion` function)
- Measures center positions via iframe DOM access
- Level 1 only requires horizontal centering
- Levels 2-3 require both horizontal and vertical centering
- 5px tolerance for "close enough" centering

## Development Notes

### Font Configuration
Monaco Editor uses Victor Mono with aggressive CSS overrides in `src/index.css`:
```css
.monaco-editor .view-lines .view-line,
.monaco-editor .view-lines .view-line span {
  font-family: "Victor Mono", "SF Mono", Monaco, Menlo, "Ubuntu Mono", Consolas, "Courier New", monospace !important;
  font-variant-ligatures: normal !important;
  font-feature-settings: "liga" 1, "calt" 1 !important;
}
```

### Tailwind v4 Setup
- Uses `@tailwindcss/vite` plugin in `vite.config.ts`
- Import statement: `@import "tailwindcss";` (not v3 syntax)
- Content scanning configured in `tailwind.config.js`

### State Management
Game state is managed in App.tsx:
- `currentLevel` - Current level index (0-based)
- `html/css` - Current code editor values
- `isCompleted` - Whether current level is solved
- `showHint` - Hint visibility toggle

## Known Issues & Solutions

### Common Problems
1. **Tailwind not working**: Ensure using v4 syntax `@import "tailwindcss"`
2. **Monaco fonts wrong**: Check CSS overrides in index.css
3. **Dev server cache**: Clear with `rm -rf node_modules/.vite`

### Browser Compatibility
- Requires modern browsers for CSS Grid and Flexbox
- Monaco Editor needs ES6+ support
- iframe srcDoc used for live preview

## Future Enhancements
- Additional centering techniques (absolute positioning, transforms)
- More complex layouts and challenges
- User progress persistence
- Mobile responsive design improvements
- Accessibility features for screen readers

## File Structure
```
src/
├── components/
│   ├── Header.tsx
│   ├── CodeEditor.tsx
│   └── Preview.tsx
├── data/
│   └── levels.ts
├── types.ts
├── App.tsx
├── index.css
└── main.tsx
```

Last updated: Session with component refactoring completed
Dev server running on: http://localhost:5174/