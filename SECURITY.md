# Security Policy 🔒

## Supported Versions 🎯

We actively support the following versions of Center Div Game:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| Previous| ⚠️ Security fixes only |
| Older   | ❌ No              |

## Reporting a Vulnerability 🚨

We take security seriously! If you discover a security vulnerability in Center Div Game, please follow these steps:

### 🔒 Private Disclosure

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities via one of these methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security tab](https://github.com/timothy-y-yuan/center-div-game/security) of our repository
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email** (Alternative)
   - Send an email to the project maintainers
   - Include "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### 📋 What to Include

When reporting a vulnerability, please include:

- **Type of issue** (e.g., XSS, injection, etc.)
- **Full paths** of source file(s) related to the issue
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Steps to reproduce** the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue, including how an attacker might exploit it
- **Any special configuration** required to reproduce the issue

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on complexity)

### 🛡️ Security Update Process

1. **Vulnerability confirmed** - We'll work to confirm and understand the issue
2. **Fix developed** - We'll develop a fix while keeping details confidential
3. **Testing** - Thorough testing to ensure the fix doesn't break existing functionality
4. **Release** - Security update released to all supported versions
5. **Disclosure** - Public disclosure after users have had time to update

## Security Considerations for Contributors 👨‍💻

### Client-Side Security

Since Center Div Game runs in the browser:

- **Input Sanitization** - All user CSS/HTML input should be properly sanitized
- **XSS Prevention** - Be careful with dynamic content injection
- **CSP Headers** - Consider Content Security Policy for production deployments
- **Dependency Scanning** - Regularly update and scan dependencies

### Code Review Guidelines

- **Validate all inputs** - Never trust user-provided data
- **Avoid `eval()` and similar** - Don't execute arbitrary code
- **Sanitize HTML** - When displaying user content, sanitize it properly
- **Check for injection** - CSS and HTML injection vulnerabilities

### Dependency Management

- **Regular Updates** - Keep dependencies up to date
- **Security Audits** - Run `npm audit` regularly
- **Vulnerability Scanning** - Use tools to scan for known vulnerabilities
- **Minimal Dependencies** - Only include necessary dependencies

## Security Features 🛡️

Current security measures in place:

### Input Validation
- CSS and HTML input is validated before execution
- Monaco Editor provides built-in protection against common injection attacks

### Content Security
- iframe sandboxing for code preview
- Proper escaping of user-generated content

### Build Security
- Automated dependency vulnerability scanning
- ESLint security rules enabled
- TypeScript for type safety

## Responsible Disclosure Recognition 🏆

We believe in recognizing security researchers who help keep our project safe:

- **Public Thanks** - Recognition in our security acknowledgments
- **CVE Assignment** - For qualifying vulnerabilities
- **Prompt Response** - We commit to responsive communication

## Security Best Practices for Users 👤

### For Players
- **Keep Browsers Updated** - Use the latest version of your browser
- **Be Careful with Extensions** - Browser extensions can affect security
- **Report Issues** - If you notice something suspicious, report it

### For Developers/Contributors
- **Secure Development** - Follow secure coding practices
- **Regular Updates** - Keep your development environment updated
- **Security Tools** - Use linting and security scanning tools

## Scope 🎯

This security policy applies to:
- ✅ The main Center Div Game application
- ✅ Build and deployment processes
- ✅ Dependencies and third-party libraries
- ✅ Documentation and setup guides

This security policy does NOT apply to:
- ❌ Third-party services or websites linked from our documentation
- ❌ User's individual browser configurations
- ❌ Issues in users' local development environments

## Security Updates 📢

Security updates will be communicated through:
- 🚨 GitHub Security Advisories
- 📝 Release notes with clear security indicators
- 💬 Issue discussions for non-sensitive updates

## Questions? 🤔

If you have questions about this security policy or general security practices:

1. Check our [FAQ section](README.md) first
2. Create a public issue for general security questions
3. Use private reporting only for actual vulnerabilities

---

**Thank you for helping keep Center Div Game secure! 🙏**