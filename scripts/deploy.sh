#!/bin/bash

# NRSgirls Platform - Deployment Automation Script
# This script handles deployment to different environments

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
ENVIRONMENT=""
DOCKER_REGISTRY="nrsgirls"
VERSION=""
SKIP_TESTS=false
SKIP_BUILD=false

# Print functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Show usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Deploy NRSgirls platform to specified environment.

OPTIONS:
    -e, --environment    Environment to deploy to (development|staging|production)
    -v, --version        Version tag for deployment
    -s, --skip-tests     Skip running tests
    -b, --skip-build     Skip building Docker images
    -h, --help           Show this help message

EXAMPLES:
    $0 -e staging -v 1.0.0
    $0 --environment production --version 1.2.0
    $0 -e development --skip-tests

EOF
    exit 1
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -b|--skip-build)
                SKIP_BUILD=true
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                print_error "Unknown option: $1"
                usage
                ;;
        esac
    done
    
    # Validate required arguments
    if [ -z "$ENVIRONMENT" ]; then
        print_error "Environment is required"
        usage
    fi
    
    if [ -z "$VERSION" ]; then
        VERSION=$(git describe --tags --always)
        print_warning "No version specified, using git tag: $VERSION"
    fi
}

# Validate environment
validate_environment() {
    print_header "Validating Environment"
    
    case $ENVIRONMENT in
        development|staging|production)
            print_success "Environment: $ENVIRONMENT"
            ;;
        *)
            print_error "Invalid environment: $ENVIRONMENT"
            print_error "Must be one of: development, staging, production"
            exit 1
            ;;
    esac
    
    # Check if we're on the right branch
    current_branch=$(git branch --show-current)
    
    case $ENVIRONMENT in
        production)
            if [ "$current_branch" != "main" ]; then
                print_error "Production deployments must be from 'main' branch"
                print_error "Current branch: $current_branch"
                exit 1
            fi
            ;;
        staging)
            if [ "$current_branch" != "staging" ] && [ "$current_branch" != "main" ]; then
                print_warning "Staging typically deploys from 'staging' or 'main' branch"
                print_warning "Current branch: $current_branch"
            fi
            ;;
    esac
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Skipping tests"
        return
    fi
    
    print_header "Running Tests"
    
    # Backend tests
    if [ -f "backend/api/package.json" ]; then
        print_info "Running backend tests..."
        cd backend/api
        npm test || {
            print_error "Backend tests failed"
            exit 1
        }
        cd ../..
        print_success "Backend tests passed"
    fi
    
    # Frontend tests
    if [ -f "frontend/package.json" ]; then
        print_info "Running frontend tests..."
        cd frontend
        npm test -- --watchAll=false || {
            print_error "Frontend tests failed"
            exit 1
        }
        cd ..
        print_success "Frontend tests passed"
    fi
}

# Build Docker images
build_images() {
    if [ "$SKIP_BUILD" = true ]; then
        print_warning "Skipping image build"
        return
    fi
    
    print_header "Building Docker Images"
    
    # Build API image
    print_info "Building API image..."
    docker build -t ${DOCKER_REGISTRY}/api:${VERSION} -f backend/api/Dockerfile backend/api
    docker tag ${DOCKER_REGISTRY}/api:${VERSION} ${DOCKER_REGISTRY}/api:latest
    print_success "API image built"
    
    # Build frontend image
    print_info "Building frontend image..."
    docker build -t ${DOCKER_REGISTRY}/frontend:${VERSION} -f frontend/Dockerfile frontend
    docker tag ${DOCKER_REGISTRY}/frontend:${VERSION} ${DOCKER_REGISTRY}/frontend:latest
    print_success "Frontend image built"
    
    # Build streaming image
    if [ -f "backend/streaming/Dockerfile" ]; then
        print_info "Building streaming image..."
        docker build -t ${DOCKER_REGISTRY}/streaming:${VERSION} -f backend/streaming/Dockerfile backend/streaming
        docker tag ${DOCKER_REGISTRY}/streaming:${VERSION} ${DOCKER_REGISTRY}/streaming:latest
        print_success "Streaming image built"
    fi
}

# Push images to registry
push_images() {
    print_header "Pushing Images to Registry"
    
    # Login to Docker registry
    print_info "Logging in to Docker registry..."
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    
    # Push images
    print_info "Pushing API image..."
    docker push ${DOCKER_REGISTRY}/api:${VERSION}
    docker push ${DOCKER_REGISTRY}/api:latest
    
    print_info "Pushing frontend image..."
    docker push ${DOCKER_REGISTRY}/frontend:${VERSION}
    docker push ${DOCKER_REGISTRY}/frontend:latest
    
    if [ -f "backend/streaming/Dockerfile" ]; then
        print_info "Pushing streaming image..."
        docker push ${DOCKER_REGISTRY}/streaming:${VERSION}
        docker push ${DOCKER_REGISTRY}/streaming:latest
    fi
    
    print_success "All images pushed"
}

# Deploy to development
deploy_development() {
    print_header "Deploying to Development"
    
    print_info "Stopping existing services..."
    docker-compose down
    
    print_info "Starting services with new images..."
    docker-compose up -d
    
    print_info "Running migrations..."
    docker-compose exec -T api npm run migrate
    
    print_success "Development deployment complete"
}

# Deploy to staging
deploy_staging() {
    print_header "Deploying to Staging"
    
    # Update ECS task definition
    print_info "Updating ECS task definition..."
    aws ecs register-task-definition \
        --cli-input-json file://deployment/task-definition-staging.json
    
    # Update ECS service
    print_info "Updating ECS service..."
    aws ecs update-service \
        --cluster nrsgirls-staging \
        --service nrsgirls-api \
        --task-definition nrsgirls-api-staging:latest \
        --force-new-deployment
    
    # Wait for deployment
    print_info "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster nrsgirls-staging \
        --services nrsgirls-api
    
    print_success "Staging deployment complete"
}

# Deploy to production
deploy_production() {
    print_header "Deploying to Production"
    
    # Confirm deployment
    print_warning "You are about to deploy to PRODUCTION"
    print_warning "Version: $VERSION"
    read -p "Are you sure you want to continue? (yes/NO) " -r
    echo
    if [ "$REPLY" != "yes" ]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    # Create backup
    print_info "Creating database backup..."
    ./scripts/backup-database.sh production
    
    # Enable maintenance mode
    print_info "Enabling maintenance mode..."
    aws s3 cp deployment/maintenance.html s3://nrsgirls-cdn/maintenance.html
    
    # Update ECS task definition
    print_info "Updating ECS task definition..."
    aws ecs register-task-definition \
        --cli-input-json file://deployment/task-definition-production.json
    
    # Blue-green deployment
    print_info "Starting blue-green deployment..."
    
    # Create new task set
    aws ecs create-task-set \
        --cluster nrsgirls-production \
        --service nrsgirls-api \
        --task-definition nrsgirls-api-production:latest
    
    # Wait for new tasks to be healthy
    print_info "Waiting for new tasks to be healthy..."
    sleep 60
    
    # Shift traffic to new task set
    print_info "Shifting traffic to new deployment..."
    aws ecs update-service-primary-task-set \
        --cluster nrsgirls-production \
        --service nrsgirls-api \
        --primary-task-set taskSetId=new-task-set-id
    
    # Monitor for issues
    print_info "Monitoring deployment..."
    sleep 120
    
    # If successful, delete old task set
    print_info "Cleaning up old deployment..."
    aws ecs delete-task-set \
        --cluster nrsgirls-production \
        --service nrsgirls-api \
        --task-set old-task-set-id
    
    # Disable maintenance mode
    print_info "Disabling maintenance mode..."
    aws s3 rm s3://nrsgirls-cdn/maintenance.html
    
    # Invalidate CloudFront cache
    print_info "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*"
    
    print_success "Production deployment complete"
}

# Run post-deployment checks
post_deployment_checks() {
    print_header "Running Post-Deployment Checks"
    
    # Health check
    print_info "Checking application health..."
    case $ENVIRONMENT in
        development)
            HEALTH_URL="http://localhost:3000/health"
            ;;
        staging)
            HEALTH_URL="https://staging.nrsgirls.com/health"
            ;;
        production)
            HEALTH_URL="https://nrsgirls.com/health"
            ;;
    esac
    
    for i in {1..10}; do
        if curl -f "$HEALTH_URL" >/dev/null 2>&1; then
            print_success "Health check passed"
            break
        fi
        print_info "Waiting for application to be ready... ($i/10)"
        sleep 10
    done
    
    # Smoke tests
    print_info "Running smoke tests..."
    # Add smoke test commands here
    
    print_success "Post-deployment checks complete"
}

# Send deployment notification
send_notification() {
    print_header "Sending Deployment Notification"
    
    # Send to Slack
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"Deployment to $ENVIRONMENT completed\",
                \"attachments\": [{
                    \"color\": \"good\",
                    \"fields\": [
                        {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
                        {\"title\": \"Version\", \"value\": \"$VERSION\", \"short\": true},
                        {\"title\": \"Deployed by\", \"value\": \"$(whoami)\", \"short\": true},
                        {\"title\": \"Time\", \"value\": \"$(date)\", \"short\": true}
                    ]
                }]
            }"
    fi
    
    print_success "Notification sent"
}

# Main deployment function
main() {
    print_header "NRSgirls Platform Deployment"
    
    parse_args "$@"
    validate_environment
    run_tests
    build_images
    
    # Deploy based on environment
    case $ENVIRONMENT in
        development)
            deploy_development
            ;;
        staging)
            push_images
            deploy_staging
            ;;
        production)
            push_images
            deploy_production
            ;;
    esac
    
    post_deployment_checks
    send_notification
    
    print_header "Deployment Complete!"
    echo -e "${GREEN}✓${NC} Successfully deployed version ${VERSION} to ${ENVIRONMENT}"
}

# Error handler
trap 'print_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
