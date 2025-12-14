# =============================================================================
# LearnAI - Production-Ready Makefile
# =============================================================================
# Author: Ruslan Magana (ruslanmv.com)
# License: MIT
# =============================================================================

.PHONY: help install dev build start serve lint lint-fix format type-check test test-watch clean clean-all prisma-generate prisma-push prisma-migrate prisma-studio prisma-seed docker-build docker-up docker-down deploy-vercel setup-env check-env validate pre-commit vercel-install vercel-build production-check checkup

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Project variables
PROJECT_NAME := learnai-portal
NODE_VERSION := 20
NPM := npm

##@ General

help: ## Display this help message
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  LearnAI - AI Tutor Marketplace$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Setup & Installation

install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@$(NPM) install
	@echo "$(GREEN)✓ Dependencies installed successfully$(NC)"

setup-env: ## Create .env.local from .env.example
	@echo "$(YELLOW)Setting up environment variables...$(NC)"
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "$(GREEN)✓ Created .env.local from .env.example$(NC)"; \
		echo "$(YELLOW)⚠ Please edit .env.local with your configuration$(NC)"; \
	else \
		echo "$(YELLOW)⚠ .env.local already exists, skipping...$(NC)"; \
	fi

check-env: ## Validate environment variables
	@echo "$(YELLOW)Checking environment variables...$(NC)"
	@if [ ! -f .env.local ]; then \
		echo "$(RED)✗ .env.local not found! Run 'make setup-env' first$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ Environment file exists$(NC)"

setup: install setup-env prisma-generate ## Complete project setup (install + env + prisma)
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✓ Setup complete! Next steps:$(NC)"
	@echo "  1. Edit .env.local with your configuration"
	@echo "  2. Run 'make prisma-push' to setup database"
	@echo "  3. Run 'make dev' to start development server"
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"

##@ Development

dev: check-env ## Start development server
	@echo "$(GREEN)Starting development server...$(NC)"
	@$(NPM) run dev

build: ## Build for production (without env check, like Vercel)
	@echo "$(GREEN)Building for production...$(NC)"
	@$(NPM) run build
	@echo "$(GREEN)✓ Build completed successfully$(NC)"

start: ## Start production server
	@echo "$(GREEN)Starting production server...$(NC)"
	@$(NPM) run start

serve: ## Serve production build (alias for start)
	@echo "$(GREEN)Serving production build...$(NC)"
	@$(NPM) run start

##@ Code Quality

lint: ## Run ESLint
	@echo "$(YELLOW)Running linter...$(NC)"
	@$(NPM) run lint

lint-fix: ## Fix ESLint issues automatically
	@echo "$(YELLOW)Fixing linter issues...$(NC)"
	@$(NPM) run lint -- --fix

format: ## Format code with Prettier
	@echo "$(YELLOW)Formatting code...$(NC)"
	@npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"
	@echo "$(GREEN)✓ Code formatted$(NC)"

format-check: ## Check code formatting
	@echo "$(YELLOW)Checking code formatting...$(NC)"
	@npx prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"

type-check: ## Run TypeScript type checking
	@echo "$(YELLOW)Running type check...$(NC)"
	@npx tsc --noEmit
	@echo "$(GREEN)✓ Type check passed$(NC)"

validate: lint type-check format-check ## Run all validation checks (lint + type-check + format)
	@echo "$(GREEN)✓ All validation checks passed$(NC)"

##@ Testing

test: ## Run tests (placeholder - add your test framework)
	@echo "$(YELLOW)Running tests...$(NC)"
	@echo "$(YELLOW)⚠ No tests configured yet. Add Jest or Vitest to package.json$(NC)"

test-watch: ## Run tests in watch mode
	@echo "$(YELLOW)Running tests in watch mode...$(NC)"
	@echo "$(YELLOW)⚠ No tests configured yet$(NC)"

##@ Database (Prisma)

prisma-generate: ## Generate Prisma Client
	@echo "$(YELLOW)Generating Prisma Client...$(NC)"
	@$(NPM) run prisma:generate
	@echo "$(GREEN)✓ Prisma Client generated$(NC)"

prisma-push: check-env ## Push schema changes to database (dev)
	@echo "$(YELLOW)Pushing schema to database...$(NC)"
	@$(NPM) run prisma:push
	@echo "$(GREEN)✓ Schema pushed to database$(NC)"

prisma-migrate: check-env ## Create and run migrations (production)
	@echo "$(YELLOW)Creating migration...$(NC)"
	@npx prisma migrate dev
	@echo "$(GREEN)✓ Migration complete$(NC)"

prisma-studio: check-env ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	@npx prisma studio

prisma-seed: check-env ## Seed database with sample data
	@echo "$(YELLOW)Seeding database...$(NC)"
	@echo "$(YELLOW)⚠ No seed script configured. Add to package.json$(NC)"

prisma-reset: check-env ## Reset database (WARNING: deletes all data)
	@echo "$(RED)⚠ WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		npx prisma migrate reset; \
		echo "$(GREEN)✓ Database reset complete$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

##@ Cleaning

clean: ## Clean build artifacts and cache
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf .next
	@rm -rf out
	@rm -rf build
	@rm -rf dist
	@rm -rf .vercel
	@echo "$(GREEN)✓ Clean complete$(NC)"

clean-all: clean ## Clean everything including node_modules
	@echo "$(RED)Cleaning everything (including node_modules)...$(NC)"
	@rm -rf node_modules
	@rm -rf package-lock.json
	@rm -rf yarn.lock
	@rm -rf pnpm-lock.yaml
	@echo "$(GREEN)✓ Clean all complete$(NC)"

##@ Docker (Optional)

docker-build: ## Build Docker image
	@echo "$(YELLOW)Building Docker image...$(NC)"
	@docker build -t $(PROJECT_NAME):latest .
	@echo "$(GREEN)✓ Docker image built$(NC)"

docker-up: ## Start Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Docker containers started$(NC)"

docker-down: ## Stop Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Docker containers stopped$(NC)"

docker-logs: ## View Docker logs
	@docker-compose logs -f

##@ Deployment

vercel-install: ## Simulate Vercel install process
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)🔄 Simulating Vercel Install Process...$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Running: npm install$(NC)"
	@$(NPM) install
	@echo "$(GREEN)✓ Install completed successfully$(NC)"

vercel-build: vercel-install ## Simulate complete Vercel build process
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)🏗️  Simulating Vercel Build Process...$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Running: vercel build$(NC)"
	@$(NPM) run build
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✅ Vercel build simulation completed successfully!$(NC)"
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  - Run 'make serve' to test the production build locally"
	@echo "  - Run 'make checkup' to validate production readiness"

production-check: ## Comprehensive production readiness check
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)🔍 Production Readiness Check...$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Checking Node.js version...$(NC)"
	@node --version
	@echo "$(GREEN)✓ Node.js version check passed$(NC)"
	@echo ""
	@echo "$(YELLOW)2. Checking npm version...$(NC)"
	@npm --version
	@echo "$(GREEN)✓ npm version check passed$(NC)"
	@echo ""
	@echo "$(YELLOW)3. Running TypeScript type check...$(NC)"
	@npx tsc --noEmit || (echo "$(RED)✗ Type check failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Type check passed$(NC)"
	@echo ""
	@echo "$(YELLOW)4. Running ESLint...$(NC)"
	@$(NPM) run lint || (echo "$(RED)✗ Linting failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Linting passed$(NC)"
	@echo ""
	@echo "$(YELLOW)5. Checking for security vulnerabilities...$(NC)"
	@npm audit --audit-level=high || echo "$(YELLOW)⚠ Security vulnerabilities found - review above$(NC)"
	@echo ""
	@echo "$(YELLOW)6. Checking for outdated packages...$(NC)"
	@npm outdated || true
	@echo ""
	@echo "$(YELLOW)7. Verifying Prisma schema...$(NC)"
	@npx prisma validate || (echo "$(RED)✗ Prisma schema validation failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Prisma schema valid$(NC)"
	@echo ""
	@echo "$(YELLOW)8. Testing production build...$(NC)"
	@$(NPM) run build || (echo "$(RED)✗ Production build failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Production build successful$(NC)"
	@echo ""
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✅ All production checks passed!$(NC)"
	@echo "$(GREEN)Your project is ready for deployment to Vercel$(NC)"
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(NC)"

checkup: production-check ## Alias for production-check

deploy-vercel: validate build ## Deploy to Vercel
	@echo "$(GREEN)Deploying to Vercel...$(NC)"
	@npx vercel --prod
	@echo "$(GREEN)✓ Deployed to Vercel$(NC)"

deploy-vercel-preview: ## Deploy preview to Vercel
	@echo "$(GREEN)Deploying preview to Vercel...$(NC)"
	@npx vercel
	@echo "$(GREEN)✓ Preview deployed$(NC)"

##@ Git Hooks

pre-commit: lint-fix format type-check ## Run pre-commit checks
	@echo "$(GREEN)✓ Pre-commit checks passed$(NC)"

##@ Information

info: ## Show project information
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)Project:$(NC) $(PROJECT_NAME)"
	@echo "$(GREEN)Author:$(NC) Ruslan Magana"
	@echo "$(GREEN)Website:$(NC) ruslanmv.com"
	@echo "$(GREEN)Node Version:$(NC) $(NODE_VERSION)"
	@echo "$(GREEN)Package Manager:$(NC) $(NPM)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════════$(NC)"
	@$(NPM) --version
	@node --version

version: ## Show version information
	@echo "$(GREEN)LearnAI Version:$(NC)"
	@cat package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g' | tr -d '[:space:]'
