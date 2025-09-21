# Contributing to Center Div Game 🎯

Thanks for your interest in contributing to the Center Div Game! This document provides guidelines and information for contributors.

## 🎮 About the Project

Center Div Game is an interactive educational tool that teaches CSS centering techniques through gamification. It's built with React, TypeScript, and modern web technologies to create an engaging learning experience.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Git

### Local Development Setup

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
5. **Open your browser** to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run preview` - Preview production build

## 🎯 How to Contribute

### Types of Contributions Welcome

- 🐛 **Bug fixes** - Help us squash those pesky bugs
- ✨ **New features** - Add exciting new functionality
- 🎨 **UI/UX improvements** - Make the game more beautiful and usable
- 📝 **Documentation** - Improve or add documentation
- 🎮 **New levels** - Create new CSS centering challenges
- 🧪 **Tests** - Add or improve test coverage
- ♿ **Accessibility** - Make the game more accessible
- ⚡ **Performance** - Optimize for better performance

### Before You Start

1. **Check existing issues** to see if your idea is already being worked on
2. **Create an issue** to discuss your proposed changes (for larger features)
3. **Assign yourself** to an issue you want to work on

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make your changes**:
   - Write clear, concise code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   npm run lint          # Check code style
   npm run typecheck     # Check TypeScript
   npm run test:run      # Run tests
   npm run build         # Ensure it builds
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance

5. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

6. **Create a Pull Request** on GitHub

## 🎮 Adding New Levels

New levels are always welcome! Here's how to add them:

1. **Edit `/src/data/levels.ts`**
2. **Add your level object** with these properties:
   ```typescript
   {
     id: number,           // Unique level ID
     title: string,        // Level title
     description: string,  // What the player needs to do
     initialHTML: string,  // Starting HTML code
     initialCSS: string,   // Starting CSS code
     hint: string,         // Helpful hint
     solutionCSS: string,  // Working solution
     explanation: string   // Detailed explanation of the technique
   }
   ```
3. **Test your level** thoroughly
4. **Update the README** if needed

### Level Design Guidelines

- **Progressive difficulty** - Each level should build on previous concepts
- **Clear objectives** - Make it obvious what needs to be centered
- **Good hints** - Provide helpful guidance without giving away the answer
- **Educational value** - Include thorough explanations of the CSS concepts
- **Multiple solutions** - Consider different valid approaches

## 🎨 Code Style

### TypeScript/JavaScript
- Use TypeScript for type safety
- Prefer functional components with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS/Styling
- Use Tailwind CSS classes for styling
- Follow the existing naming conventions
- Ensure responsive design
- Test across different browsers

### Testing
- Write tests for new functionality
- Maintain or improve test coverage
- Use descriptive test names
- Test both success and error cases

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Screenshots** if applicable
5. **Browser and OS information**
6. **Console errors** if any

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) for consistency.

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. **Check existing issues** first
2. **Use the feature request template**
3. **Provide clear use cases**
4. **Consider implementation complexity**
5. **Be open to discussion and feedback**

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] Tests added/updated
- [ ] All checks pass (lint, typecheck, tests, build)

### PR Description Should Include
- Clear description of changes
- Reference to related issues
- Screenshots for UI changes
- Breaking changes noted
- Testing instructions

### Review Process
- All PRs require review before merging
- CI checks must pass
- Address reviewer feedback promptly
- Keep PRs focused and reasonably sized

## 🎯 Project Structure

```
src/
├── components/          # Reusable React components
├── contexts/           # React contexts (theme, etc.)
├── data/              # Game data (levels, etc.)
├── test/              # Test files
├── types.ts           # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## 🤝 Community Guidelines

### Be Respectful
- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Give and receive constructive feedback gracefully

### Be Collaborative
- Help newcomers get started
- Share knowledge and learn from others
- Credit others for their contributions

### Be Patient
- Remember this is a volunteer project
- Reviews and responses may take time
- Be understanding of different skill levels

## ❓ Getting Help

Need help? Here are your options:

1. **Check the documentation** - README, code comments, etc.
2. **Search existing issues** - Your question might already be answered
3. **Create a new issue** - Use the appropriate template
4. **Join discussions** - Participate in issue discussions

## 🙏 Recognition

Contributors are recognized in several ways:

- Listed in commit history
- Mentioned in release notes for significant contributions
- Featured in the project README (coming soon)
- Our eternal gratitude! 🎉

## 📝 License

By contributing to Center Div Game, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Happy contributing! Let's make learning CSS centering fun for everyone! 🎯✨**