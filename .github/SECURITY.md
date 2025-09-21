# Security Policy

## Supported Versions

We actively support the latest version of the Center Div Game. Since this is an educational web application, security updates are applied to the main branch.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in the Center Div Game, please report it responsibly:

### For Non-Critical Issues
- Open a GitHub issue with the `security` label
- Provide detailed steps to reproduce
- Include potential impact assessment

### For Critical Security Issues
- Email the repository maintainer directly (check GitHub profile)
- Do not publicly disclose until we've had a chance to address it
- We aim to respond within 48 hours

## Security Considerations

This project is an educational CSS game that runs entirely in the browser. Key security aspects:

- **No Server-Side Components**: All code runs client-side
- **Local Storage Only**: User progress stored locally, no external services
- **Iframe Sandboxing**: Preview content uses `srcDoc` attribute for safety
- **No User Authentication**: No login system or user data collection
- **Static Hosting**: Designed for static site deployment

## What We Consider Security Issues

- XSS vulnerabilities in user-generated content
- Code injection through CSS input fields
- Malicious code execution in Monaco Editor
- Unsafe iframe content rendering
- Client-side code tampering that affects other users

## What We Don't Consider Security Issues

- Local storage manipulation by users (affects only themselves)
- CSS that breaks the game UI (educational purpose)
- Browser developer tools access (expected for learning)
- Client-side performance issues

## Security Best Practices for Contributors

- Sanitize any dynamic content before rendering
- Use TypeScript for type safety
- Follow CSP guidelines for iframe content
- Validate user inputs in CSS editor
- Keep dependencies updated
- Use secure coding practices