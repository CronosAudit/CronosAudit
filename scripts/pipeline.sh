#!/bin/bash

# 🚀 Cronos Audit - Pipeline Helper Scripts
# Utilitários para gerenciamento de deploy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║     Cronos Audit - Pipeline Tools      ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running in repo root
check_repo() {
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    print_success "Repository validated"
}

# Build local
build_local() {
    print_info "Building application locally..."
    npm ci
    npm run build
    print_success "Build completed"
}

# Run security audit
audit_security() {
    print_info "Running security audit..."
    npm audit
}

# Run tests (if available)
run_tests() {
    print_info "Running tests..."
    if npm list jest > /dev/null 2>&1; then
        npm test
        print_success "Tests passed"
    else
        print_warning "Jest not installed, skipping tests"
    fi
}

# Run lint
lint_code() {
    print_info "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Type check
type_check() {
    print_info "Running TypeScript type check..."
    npx tsc --noEmit
    print_success "Type check passed"
}

# Docker build
docker_build() {
    print_info "Building Docker image..."
    docker build -t cronos-audit:latest .
    print_success "Docker image built"
}

# Docker run
docker_run() {
    print_info "Running Docker container..."
    docker run -p 3000:3000 \
        -e NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
        -e API_KEY_OPEN_AI=${API_KEY_OPEN_AI} \
        cronos-audit:latest
}

# Check environment
check_env() {
    print_info "Checking environment variables..."
    
    local required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "API_KEY_OPEN_AI"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        else
            print_success "$var is set"
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing environment variables: ${missing_vars[*]}"
        print_info "Copy .env.example to .env.local and configure"
        return 1
    fi
    
    print_success "All required environment variables are set"
    return 0
}

# Full CI pipeline (local)
run_full_ci() {
    print_banner
    
    check_repo
    lint_code
    type_check
    build_local
    audit_security
    
    print_success "Full CI pipeline completed successfully!"
}

# Pre-commit checks
pre_commit() {
    print_info "Running pre-commit checks..."
    
    lint_code
    type_check
    
    print_success "Pre-commit checks passed"
}

# Show help
show_help() {
    cat << EOF
${BLUE}Cronos Audit - Pipeline Helper${NC}

Usage: ./scripts/pipeline.sh [command]

Commands:
  ${GREEN}check-repo${NC}       Check if we're in the repo root
  ${GREEN}check-env${NC}        Validate environment variables
  ${GREEN}lint${NC}            Run ESLint
  ${GREEN}type-check${NC}      Run TypeScript type check
  ${GREEN}build${NC}           Build application locally
  ${GREEN}audit${NC}           Run security audit
  ${GREEN}test${NC}            Run tests (if available)
  ${GREEN}docker-build${NC}    Build Docker image
  ${GREEN}docker-run${NC}      Run Docker container
  ${GREEN}pre-commit${NC}      Run pre-commit checks
  ${GREEN}full-ci${NC}         Run full CI pipeline locally
  ${GREEN}help${NC}            Show this help message

Examples:
  ./scripts/pipeline.sh build
  ./scripts/pipeline.sh full-ci
  ./scripts/pipeline.sh pre-commit

EOF
}

# Main
print_banner

case "${1:-help}" in
    check-repo)
        check_repo
        ;;
    check-env)
        check_env
        ;;
    lint)
        check_repo
        lint_code
        ;;
    type-check)
        check_repo
        type_check
        ;;
    build)
        check_repo
        build_local
        ;;
    audit)
        check_repo
        audit_security
        ;;
    test)
        check_repo
        run_tests
        ;;
    docker-build)
        docker_build
        ;;
    docker-run)
        check_env
        docker_run
        ;;
    pre-commit)
        check_repo
        pre_commit
        ;;
    full-ci)
        check_repo
        run_full_ci
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

exit 0
