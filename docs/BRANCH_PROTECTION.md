# Branch Protection and Repository Settings 🛡️

This document outlines the recommended branch protection rules and repository settings for the Center Div Game project to maintain code quality and ensure a smooth development workflow.

## 🌟 Branch Structure

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Protection**: Heavily protected
- **Deployment**: Auto-deploys to GitHub Pages

### Development Branch (`develop`)
- **Purpose**: Integration branch for features
- **Protection**: Moderately protected
- **Usage**: Feature branches merge here first

### Feature Branches
- **Naming**: `feature/description-of-feature`
- **Source**: Branch from `develop`
- **Target**: Merge back to `develop`

### Bugfix Branches
- **Naming**: `bugfix/issue-description`
- **Source**: Branch from `main` (for hotfixes) or `develop`
- **Target**: Merge to appropriate branch

## 🔒 Branch Protection Rules

### Main Branch Protection

**Required settings for `main` branch:**

```yaml
# Branch protection settings (GitHub UI configuration)
Branch name pattern: main

Protect matching branches:
✅ Restrict pushes that create files larger than 100 MB
✅ Require a pull request before merging
   ✅ Require approvals (1 minimum)
   ✅ Dismiss stale reviews when new commits are pushed  
   ✅ Require review from CODEOWNERS
   ✅ Restrict pushes that modify CODEOWNERS
✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Required status checks:
   - Lint Code
   - Type Check  
   - Run Tests
   - Build Project
✅ Require conversation resolution before merging
✅ Require signed commits (recommended)
✅ Require linear history
✅ Do not allow bypassing the above settings
   ❌ Allow force pushes (disabled for safety)
   ❌ Allow deletions (disabled for safety)
```

### Develop Branch Protection

**Required settings for `develop` branch:**

```yaml
# Branch protection settings (GitHub UI configuration)
Branch name pattern: develop

Protect matching branches:
✅ Require a pull request before merging
   ✅ Require approvals (1 minimum)
   ✅ Dismiss stale reviews when new commits are pushed
✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Required status checks:
   - Lint Code
   - Type Check
   - Run Tests
   - Build Project
✅ Require conversation resolution before merging
✅ Require linear history (optional)
❌ Allow force pushes (disabled)
❌ Allow deletions (disabled)
```

## 👥 Repository Settings

### General Settings

**Recommended repository settings:**

```yaml
# Repository settings (GitHub UI configuration)
General:
✅ Template repository: false
✅ Require contributors to sign off on web-based commits
✅ Web commit signoff required

Features:
✅ Wikis: enabled
✅ Issues: enabled  
✅ Sponsorships: enabled (if desired)
✅ Preserve this repository: enabled
✅ Discussions: enabled (recommended for community)

Pull Requests:
✅ Allow merge commits
✅ Allow squash merging
✅ Allow rebase merging
✅ Always suggest updating pull request branches
✅ Automatically delete head branches

Archives:
❌ Include Git LFS objects in archives: disabled
```

### Security & Analysis

**Security settings:**

```yaml
# Security settings (GitHub UI configuration)
Code security and analysis:
✅ Dependency graph: enabled
✅ Dependabot alerts: enabled
✅ Dependabot security updates: enabled
✅ Code scanning: enabled (CodeQL)
✅ Secret scanning: enabled
✅ Secret scanning push protection: enabled
```

## 🔧 Setting Up Branch Protection

### Method 1: GitHub Web Interface

1. **Navigate to Settings** → Branches
2. **Click "Add rule"**
3. **Enter branch name pattern** (e.g., `main`)
4. **Configure protection settings** as outlined above
5. **Save changes**

### Method 2: GitHub CLI

```bash
# Install GitHub CLI first
# https://cli.github.com/

# Set up main branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint Code","Type Check","Run Tests","Build Project"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

### Method 3: Terraform (Advanced)

```hcl
# terraform/github.tf
resource "github_branch_protection" "main" {
  repository_id = github_repository.center_div_game.id
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = ["Lint Code", "Type Check", "Run Tests", "Build Project"]
  }

  required_pull_request_reviews {
    dismiss_stale_reviews      = true
    required_approving_review_count = 1
  }

  enforce_admins = true
}
```

## 👤 Team Permissions

### Repository Roles

**Recommended role assignments:**

- **Admin**: Repository owner(s)
- **Maintain**: Core maintainers  
- **Write**: Regular contributors
- **Triage**: Issue managers
- **Read**: General contributors

### CODEOWNERS File

Create `.github/CODEOWNERS` to define code ownership:

```bash
# Global owners
* @timothy-y-yuan

# Frontend components
/src/components/ @timothy-y-yuan
/src/contexts/ @timothy-y-yuan

# Build and CI
/.github/ @timothy-y-yuan
/vite.config.ts @timothy-y-yuan
/package.json @timothy-y-yuan

# Game data and levels
/src/data/ @timothy-y-yuan

# Documentation
*.md @timothy-y-yuan
```

## 🚀 Deployment Protection

### GitHub Pages Deployment

**Recommended settings:**

```yaml
# Pages settings (GitHub UI configuration)
Source: GitHub Actions
Custom domain: (optional)
Enforce HTTPS: ✅ enabled

# Environment protection rules
Environment name: github-pages
Environment protection rules:
✅ Required reviewers: @timothy-y-yuan
✅ Wait timer: 0 minutes  
✅ Prevent self-review: enabled
```

## 🔍 Monitoring and Notifications

### Notification Settings

**Recommended notifications:**

- ✅ Email notifications for direct mentions
- ✅ Web notifications for pull request reviews
- ✅ Email notifications for security alerts
- ✅ Email notifications for failed Actions

### Repository Insights

**Monitor these metrics:**

- Pull request merge time
- CI/CD success rates  
- Code coverage trends
- Dependency vulnerability counts
- Community engagement (issues, discussions)

## 🎯 Workflow Examples

### Feature Development Flow

1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-css-level
   ```

2. **Develop feature** with commits
3. **Push branch** and create PR to `develop`
4. **Code review** and CI checks pass
5. **Merge to develop** after approval
6. **Deploy to staging** (optional)
7. **Create PR from develop to main** when ready
8. **Deploy to production** after main merge

### Hotfix Flow

1. **Create hotfix branch** from `main`
   ```bash
   git checkout main
   git pull origin main  
   git checkout -b hotfix/critical-bug-fix
   ```

2. **Fix issue** quickly
3. **Create PR to main** 
4. **Emergency review** (may bypass some rules if critical)
5. **Merge and deploy** immediately
6. **Backport to develop** if needed

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Configuration](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates)

---

**Note**: These are recommendations. Adjust the settings based on your team size, development velocity, and specific needs. The goal is to balance security with productivity! 🚀