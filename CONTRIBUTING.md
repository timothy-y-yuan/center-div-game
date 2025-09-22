# Contributing to Center Div Game 🎯

Thank you for your interest in contributing to the Center Div Game! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 22+)
- npm (comes with Node.js)
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/center-div-game.git
   cd center-div-game
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The game will be available at http://localhost:5173

5. **Run the tests**:
   ```bash
   npm run test:run
   ```

### Development Workflow

1. **Create a new branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them locally

3. **Run the test suite** after making changes:
   ```bash
   npm run test:run
   ```

4. **Commit your changes** with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add new centering technique to level 5"
   ```

5. **Push to your fork** and create a pull request

## 🧪 Testing

**CRITICAL**: Always run tests after making changes!

```bash
# Run all tests (quick)
npm run test:run

# Run tests in watch mode during development
npm test

# Run tests with UI
npm run test:ui

# Check linting (known issues exist, don't worry if it fails)
npm run lint
```

### Current Status
- ✅ **Tests**: 174 tests pass consistently
- ❌ **Build**: Currently fails due to TypeScript errors (known issue)
- ❌ **Lint**: 29 ESLint errors (known issue, doesn't block development)
- ✅ **Dev Server**: Works perfectly

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Main header with navigation
│   ├── CodeEditor.tsx  # Monaco editor wrapper
│   ├── Preview.tsx     # Live preview pane
│   └── ...
├── data/
│   └── levels.ts       # Game level definitions
├── test/               # Test files (Vitest)
├── types.ts           # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🎮 Types of Contributions

### 🐛 Bug Fixes
- Fix game functionality issues
- Resolve UI/UX problems
- Address cross-browser compatibility

### ✨ New Features
- Add new game levels
- Enhance the hint system
- Improve progress tracking
- Add themes or visual improvements

### 📚 Educational Content
- Improve level explanations
- Add better hint messages
- Create educational resources
- Enhance CSS technique coverage

### 🧪 Testing & Quality
- Add new test cases
- Improve test coverage
- Fix failing tests
- Performance optimizations

## 🎯 Adding New Game Levels

If you want to add a new level:

1. **Edit `src/data/levels.ts`**
2. **Follow the existing pattern**:
   ```typescript
   {
     id: 11,
     title: "Your Level Title",
     description: "What the player needs to achieve",
     initialHTML: `<div class="target">Center me!</div>`,
     initialCSS: `.target {\n  /* Your starting CSS */\n}`,
     hints: [
       "First hint for the player",
       "Second hint if they're still stuck"
     ],
     explanation: "Educational content about the technique",
     editableSelectors: {
       '.target': {
         allowedProperties: ['display', 'margin', 'etc'],
         lockedProperties: ['width', 'height']
       }
     },
     completionCriteria: {
       horizontalTolerance: 5,
       verticalTolerance: 5
     }
   }
   ```

3. **Test your level** thoroughly
4. **Add tests** in `src/test/levels.test.ts`

## 📝 Commit Message Guidelines

We use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.

Examples:
```bash
git commit -m "feat: add flexbox centering level"
git commit -m "fix: resolve hint positioning on mobile"
git commit -m "docs: update setup instructions"
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Browser and version**
5. **Game level** where it occurred
6. **Console errors** (if any)

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) for consistency.

## 💡 Suggesting Features

We welcome feature suggestions! Please use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:

1. **Problem statement** - what problem does this solve?
2. **Proposed solution** - how should it work?
3. **Educational value** - how does it help players learn CSS?
4. **Implementation ideas** (if you have any)

## 🎨 Code Style

- **TypeScript**: Use strict typing where possible
- **React**: Functional components with hooks
- **CSS**: Use Tailwind CSS classes
- **Testing**: Write tests for new functionality
- **Comments**: Document complex logic

## 🚦 Pull Request Process

1. **Fill out the PR template** completely
2. **Ensure all tests pass** locally
3. **Update documentation** if needed
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Checklist
- [ ] Tests pass (`npm run test:run`)
- [ ] Development server works (`npm run dev`)
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] No new console errors

## ❓ Getting Help

- **Questions**: Use [GitHub Discussions](https://github.com/timothy-y-yuan/center-div-game/discussions)
- **Issues**: Check [existing issues](https://github.com/timothy-y-yuan/center-div-game/issues) first
- **Chat**: Mention @timothy-y-yuan in issues or PRs

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- README acknowledgments
- Release notes (for significant contributions)

## 📜 Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We're all here to learn and improve the game together!

## 🎉 First Time Contributors

New to open source? This project is beginner-friendly! Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`

Don't hesitate to ask questions or request guidance.

---

Thank you for contributing to Center Div Game! Every contribution, no matter how small, helps make this educational tool better for everyone learning CSS. 🎯