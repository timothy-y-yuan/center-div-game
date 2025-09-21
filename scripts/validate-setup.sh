#!/bin/bash
# Validate project setup script for Center Div Game
# This script checks if all the professional project structure is properly set up

set -e

echo "🎯 Center Div Game - Project Setup Validation"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        return 1
    fi
}

# Function to check if directory exists
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing directory: $1${NC}"
        return 1
    fi
}

# Function to check npm script
check_npm_script() {
    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  jq is not installed. Skipping npm script existence check. Attempting to run the script...${NC}"
        if npm run "$1" --silent >/dev/null 2>&1; then
            echo -e "${GREEN}✅ npm run $1${NC}"
            return 0
        else
            echo -e "${RED}❌ npm run $1 failed${NC}"
            return 1
        fi
    fi

    if jq -e --arg script "$1" '.scripts[$script]' package.json >/dev/null 2>&1; then
        if npm run "$1" --silent >/dev/null 2>&1; then
            echo -e "${GREEN}✅ npm run $1${NC}"
            return 0
        else
            echo -e "${RED}❌ npm run $1 failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ npm script \"$1\" not found in package.json${NC}"
        return 1
    fi
}

echo ""
echo -e "${BLUE}📁 Checking file structure...${NC}"

# Core files
check_file "package.json"
check_file "README.md"
check_file ".gitignore"

# GitHub workflows
echo ""
echo -e "${BLUE}🔄 Checking GitHub Actions workflows...${NC}"
check_directory ".github/workflows"
check_file ".github/workflows/ci.yml"
check_file ".github/workflows/deploy.yml"
check_file ".github/workflows/stale.yml"

# Issue and PR templates
echo ""
echo -e "${BLUE}📋 Checking issue and PR templates...${NC}"
check_directory ".github/ISSUE_TEMPLATE"
check_file ".github/ISSUE_TEMPLATE/bug_report.yml"
check_file ".github/ISSUE_TEMPLATE/feature_request.yml"
check_file ".github/ISSUE_TEMPLATE/documentation.yml"

check_directory ".github/pull_request_template"
check_file ".github/pull_request_template/default.md"
check_file ".github/pull_request_template/bug_fix.md"
check_file ".github/pull_request_template/feature.md"

# GitHub configuration files
echo ""
echo -e "${BLUE}⚙️ Checking GitHub configuration...${NC}"
check_file ".github/CODEOWNERS"
check_file ".github/dependabot.yml"
check_file ".github/FUNDING.yml"

# Documentation
echo ""
echo -e "${BLUE}📚 Checking documentation...${NC}"
check_file "CONTRIBUTING.md"
check_file "CODE_OF_CONDUCT.md"
check_file "SECURITY.md"
check_directory "docs"
check_file "docs/BRANCH_PROTECTION.md"
check_file "docs/PROJECT_SETUP.md"

# Package.json scripts
echo ""
echo -e "${BLUE}📦 Checking npm scripts...${NC}"
if command -v npm >/dev/null 2>&1; then
    if [ -f "package.json" ]; then
        # Check if scripts exist in package.json
        if grep -q "\"lint\"" package.json; then
            echo -e "${GREEN}✅ lint script defined${NC}"
        else
            echo -e "${RED}❌ Missing lint script${NC}"
        fi
        
        if grep -q "\"typecheck\"" package.json; then
            echo -e "${GREEN}✅ typecheck script defined${NC}"
        else
            echo -e "${RED}❌ Missing typecheck script${NC}"
        fi
        
        if grep -q "\"test:run\"" package.json; then
            echo -e "${GREEN}✅ test:run script defined${NC}"
        else
            echo -e "${RED}❌ Missing test:run script${NC}"
        fi
        
        if grep -q "\"build\"" package.json; then
            echo -e "${GREEN}✅ build script defined${NC}"
        else
            echo -e "${RED}❌ Missing build script${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️ npm not found - skipping script checks${NC}"
fi

# Check if node_modules exists (dependencies installed)
echo ""
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️ Dependencies not installed (run 'npm install')${NC}"
fi

# Check Git configuration
echo ""
echo -e "${BLUE}🔧 Checking Git setup...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    
    # Check if remote origin exists
    if git remote get-url origin >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Remote origin configured${NC}"
    else
        echo -e "${YELLOW}⚠️ No remote origin configured${NC}"
    fi
else
    echo -e "${RED}❌ Not a Git repository${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Setup Validation Complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run 'npm install' if dependencies aren't installed"
echo "2. Set up branch protection rules (see docs/BRANCH_PROTECTION.md)"
echo "3. Configure GitHub repository settings (see docs/PROJECT_SETUP.md)"
echo "4. Test the CI/CD pipeline by creating a pull request"
echo ""
echo -e "${GREEN}🚀 Your project is ready for professional development!${NC}"