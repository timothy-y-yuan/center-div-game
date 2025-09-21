# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| < Latest| ❌ No              |

## Reporting a Vulnerability

We take the security of Center Div Game seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **GitHub Security Advisories** (Preferred):
   - Go to https://github.com/timothy-y-yuan/center-div-game/security/advisories/new
   - Fill out the form with details about the vulnerability
   - This allows for coordinated disclosure

2. **Email** (Alternative):
   - Send an email to the repository maintainer
   - Include "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### 📝 What to Include

When reporting a security vulnerability, please include:

- **Type of vulnerability** (e.g., XSS, code injection, etc.)
- **Location of the vulnerability** (file/line or URL)
- **Step-by-step instructions** to reproduce the issue
- **Potential impact** of the vulnerability
- **Any suggested fixes** (if you have them)

### 📋 Vulnerability Types We Care About

Given that this is a client-side educational game, relevant security concerns include:

- **Cross-Site Scripting (XSS)** in user-generated CSS/HTML
- **Code injection** through the Monaco editor
- **Unsafe iframe content** in the preview pane
- **Local storage** security issues
- **Dependency vulnerabilities** with security implications
- **Content Security Policy** bypasses

### 🕐 Response Timeline

We will acknowledge receipt of your vulnerability report within:
- **48 hours** for critical vulnerabilities
- **1 week** for non-critical vulnerabilities

We will provide regular updates on our progress and notify you when the vulnerability is fixed.

### 🛡️ Security Measures

Current security measures in place:

- **Content Security Policy** for iframe previews
- **Input sanitization** for user CSS/HTML
- **Dependency scanning** via automated tools
- **Regular security audits** of dependencies
- **Safe iframe sandbox** for code preview

### 🏆 Recognition

We appreciate security researchers who help keep our project safe. With your permission, we'll recognize your contribution:

- **Security Advisories** - Credit in the security advisory
- **CHANGELOG** - Credit in release notes
- **README** - Add to security contributors section

### ℹ️ Security Best Practices for Contributors

When contributing to the project:

- **Validate all inputs** - especially user-provided CSS/HTML
- **Use secure defaults** - for any new features
- **Review dependencies** - check for known vulnerabilities
- **Follow OWASP guidelines** - for web application security
- **Test security features** - ensure protections work as expected

### 🔍 Automated Security

We use automated tools to help identify security issues:

- **Dependabot** - Automated dependency updates
- **npm audit** - Vulnerability scanning of dependencies
- **GitHub Security Advisories** - Tracking known issues
- **Trivy scanner** - Container and code vulnerability scanning

### 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [npm Security Best Practices](https://docs.npmjs.com/security)

## Contact

For general security questions about this project, please open an issue or start a discussion. For sensitive security matters, use the private disclosure methods mentioned above.

Thank you for helping keep Center Div Game secure! 🔒