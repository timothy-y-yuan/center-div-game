# Project Setup Checklist for Maintainers 🚀

This checklist helps maintainers set up the Center Div Game repository with all the professional development workflow features.

## 📋 Initial Repository Setup

### Basic Repository Configuration

- [ ] **Repository created** on GitHub
- [ ] **Description added**: "Interactive CSS centering game for learning web development"
- [ ] **Topics added**: `css`, `game`, `education`, `react`, `typescript`, `web-development`
- [ ] **License selected**: MIT License
- [ ] **README.md** committed to main branch
- [ ] **Initial code** pushed to main branch

### Security & Analysis Settings

Go to **Settings → Security & Analysis**:

- [ ] **Dependency graph**: Enabled
- [ ] **Dependabot alerts**: Enabled  
- [ ] **Dependabot security updates**: Enabled
- [ ] **Code scanning**: Enable CodeQL analysis
- [ ] **Secret scanning**: Enabled
- [ ] **Secret scanning push protection**: Enabled

### General Repository Settings

Go to **Settings → General**:

**Features**:
- [ ] **Issues**: Enabled ✅
- [ ] **Projects**: Enabled (optional)
- [ ] **Wiki**: Enabled ✅
- [ ] **Discussions**: Enabled ✅ (recommended for community)
- [ ] **Sponsorships**: Enabled ✅

**Pull Requests**:
- [ ] **Allow merge commits**: Enabled ✅
- [ ] **Allow squash merging**: Enabled ✅
- [ ] **Allow rebase merging**: Enabled ✅
- [ ] **Always suggest updating pull request branches**: Enabled ✅
- [ ] **Automatically delete head branches**: Enabled ✅

**Pushes**:
- [ ] **Limit pushes that create files larger than 100 MB**: Enabled ✅

## 🛡️ Branch Protection Setup

### Main Branch Protection

Go to **Settings → Branches → Add rule**:

**Branch name pattern**: `main`

**Protect matching branches**:
- [ ] **Restrict pushes that create files larger than 100 MB**: ✅
- [ ] **Require a pull request before merging**: ✅
  - [ ] **Require approvals**: 1 minimum ✅
  - [ ] **Dismiss stale reviews when new commits are pushed**: ✅
  - [ ] **Require review from CODEOWNERS**: ✅
- [ ] **Require status checks to pass before merging**: ✅
  - [ ] **Require branches to be up to date before merging**: ✅
  - Required status checks:
    - [ ] `Lint Code`
    - [ ] `Type Check`
    - [ ] `Run Tests`  
    - [ ] `Build Project`
- [ ] **Require conversation resolution before merging**: ✅
- [ ] **Require signed commits**: ✅ (recommended)
- [ ] **Require linear history**: ✅
- [ ] **Do not allow bypassing the above settings**: ✅
- [ ] **Allow force pushes**: ❌ (disabled)
- [ ] **Allow deletions**: ❌ (disabled)

### Development Branch Protection (Optional)

If using a `develop` branch, create similar rules but with relaxed requirements.

## 🚀 GitHub Pages Setup

Go to **Settings → Pages**:

- [ ] **Source**: Deploy from a branch → `gh-pages` (will be created by GitHub Actions)
- [ ] **Custom domain**: (optional)
- [ ] **Enforce HTTPS**: Enabled ✅

**OR** if using GitHub Actions:

- [ ] **Source**: GitHub Actions
- [ ] **Custom domain**: (optional)  
- [ ] **Enforce HTTPS**: Enabled ✅

## 🔄 GitHub Actions Setup

The workflows are already committed. Verify they run correctly:

### After First Push to Main Branch

- [ ] **CI workflow** runs successfully on main branch
- [ ] **Deploy workflow** runs and deploys to GitHub Pages
- [ ] **Check deployment** at `https://username.github.io/center-div-game`

### Test Pull Request Workflow

Create a test PR to verify:
- [ ] **CI workflow** runs on PR
- [ ] **All checks pass** (lint, typecheck, test, build)
- [ ] **Status checks block merge** if any fail
- [ ] **PR templates** appear when creating PRs

## 👥 Team & Access Management

Go to **Settings → Manage access**:

- [ ] **Repository visibility**: Public (for open source) or Private
- [ ] **Base permissions**: Read (for public repos)
- [ ] **Add collaborators** with appropriate roles:
  - **Admin**: Core maintainers
  - **Maintain**: Trusted contributors
  - **Write**: Regular contributors
  - **Triage**: Issue managers
  - **Read**: Default for public repos

## 🏷️ Labels Setup

Go to **Issues → Labels** and create/edit labels:

**Priority Labels**:
- [ ] `priority: critical` (red)
- [ ] `priority: high` (orange)
- [ ] `priority: medium` (yellow)  
- [ ] `priority: low` (light gray)

**Type Labels**:
- [ ] `bug` (red)
- [ ] `enhancement` (blue)
- [ ] `documentation` (green)
- [ ] `help wanted` (purple)
- [ ] `good first issue` (green)

**Status Labels**:
- [ ] `work in progress` (yellow)
- [ ] `blocked` (red)
- [ ] `ready for review` (green)
- [ ] `stale` (gray) - used by automation
- [ ] `triage` (yellow)

**Component Labels**:
- [ ] `ui/ux` (pink)
- [ ] `game logic` (blue)
- [ ] `css levels` (cyan)
- [ ] `testing` (purple)
- [ ] `ci/cd` (dark blue)
- [ ] `dependencies` (orange) - used by Dependabot

## 📧 Notification Settings

Go to **Settings → Notifications**:

**Email notifications**:
- [ ] **Issues**: Enabled for mentions and assignments
- [ ] **Pull requests**: Enabled for mentions and assignments
- [ ] **Actions**: Enabled for failures
- [ ] **Dependabot alerts**: Enabled
- [ ] **Security alerts**: Enabled

## 🎯 Milestones Setup

Go to **Issues → Milestones** and create:

- [ ] **v1.0.0**: Initial stable release
- [ ] **v1.1.0**: Next feature release  
- [ ] **Documentation**: Documentation improvements
- [ ] **Community**: Community building tasks

## 📊 Insights Configuration

Verify these are accessible in **Insights**:

- [ ] **Pulse**: Community activity overview
- [ ] **Contributors**: Contributor statistics
- [ ] **Community**: Community standards checklist
- [ ] **Traffic**: Page views and clones
- [ ] **Dependency graph**: Dependency visualization
- [ ] **Security**: Security advisories and alerts

## 🧪 Testing the Complete Setup

### Create Test Issue
- [ ] Create a test issue using bug report template
- [ ] Verify template renders correctly
- [ ] Apply appropriate labels
- [ ] Close test issue

### Create Test Pull Request
- [ ] Fork repository (or create branch)
- [ ] Make a small change
- [ ] Create PR using feature template
- [ ] Verify all CI checks run
- [ ] Verify branch protection prevents merge without review
- [ ] Add reviewer and approve
- [ ] Merge PR and verify deployment

### Test Security Features
- [ ] Try pushing a file > 100MB (should be blocked)
- [ ] Test Dependabot by creating a dependency with known vulnerability
- [ ] Verify security alerts appear in Security tab

## 📝 Final Checklist

- [ ] **All workflows pass** on main branch
- [ ] **GitHub Pages deployed** successfully
- [ ] **Branch protection active** and working
- [ ] **Issue/PR templates** working correctly
- [ ] **Dependabot** creating dependency update PRs
- [ ] **Security scanning** enabled and running
- [ ] **Community standards** met (check Insights → Community)
- [ ] **Documentation** complete and accurate
- [ ] **Team members** added with correct permissions

## 🎉 Post-Setup

After completing setup:

1. **Announce to team**: Share repository access and contribution guidelines
2. **Create initial issues**: Add good first issues for new contributors  
3. **Set up monitoring**: Watch for security alerts and failed builds
4. **Plan releases**: Use milestones for release planning
5. **Engage community**: Respond to issues and PRs promptly

## 🔍 Maintenance Checklist (Weekly)

- [ ] **Review Dependabot PRs**: Merge dependency updates after testing
- [ ] **Check security alerts**: Address any new vulnerabilities
- [ ] **Monitor CI/CD**: Ensure builds and deployments are stable
- [ ] **Triage issues**: Label and prioritize new issues
- [ ] **Review stale items**: Address stale issues and PRs

## 📚 Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Community Standards Guide](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [Security Best Practices](https://docs.github.com/en/code-security)

---

**Completion Time**: Approximately 30-45 minutes for initial setup
**Maintenance**: 15-30 minutes per week for ongoing maintenance

🎯 **Remember**: This setup creates a professional, welcoming, and secure environment for contributors while maintaining high code quality standards!