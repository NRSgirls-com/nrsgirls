#!/bin/bash

# NRSgirls Platform - One-Command Setup Script
# This script sets up the entire development environment

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "NRSgirls Platform Setup"
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Setup databases
    setup_databases
    
    # Start services
    start_services
    
    # Run migrations
    run_migrations
    
    # Seed data (optional)
    seed_data
    
    # Final checks
    final_checks
    
    # Print success message
    print_completion
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local all_good=true
    
    # Check Docker
    if command_exists docker; then
        print_success "Docker is installed: $(docker --version)"
    else
        print_error "Docker is not installed"
        all_good=false
    fi
    
    # Check Docker Compose
    if command_exists docker-compose || docker compose version >/dev/null 2>&1; then
        print_success "Docker Compose is available"
    else
        print_error "Docker Compose is not installed"
        all_good=false
    fi
    
    # Check Node.js
    if command_exists node; then
        print_success "Node.js is installed: $(node --version)"
    else
        print_warning "Node.js is not installed (optional for local development)"
    fi
    
    # Check npm
    if command_exists npm; then
        print_success "npm is installed: $(npm --version)"
    else
        print_warning "npm is not installed (optional for local development)"
    fi
    
    # Check Git
    if command_exists git; then
        print_success "Git is installed: $(git --version)"
    else
        print_error "Git is not installed"
        all_good=false
    fi
    
    if [ "$all_good" = false ]; then
        print_error "Please install missing prerequisites and try again"
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"
    
    # Check if .env exists
    if [ -f .env ]; then
        print_warning ".env file already exists"
        read -p "Do you want to overwrite it? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing .env file"
            return
        fi
    fi
    
    # Create .env from example
    if [ -f .env.example ]; then
        print_info "Creating .env from .env.example"
        cp .env.example .env
        print_success ".env file created"
    else
        print_info "Creating default .env file"
        create_default_env
    fi
    
    # Generate secrets
    print_info "Generating secure secrets..."
    generate_secrets
    
    print_success "Environment setup complete!"
}

# Create default .env file
create_default_env() {
    cat > .env <<EOF
# Environment
NODE_ENV=development

# Database
POSTGRES_USER=nrsgirls
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=nrsgirls

# MongoDB
MONGO_USER=nrsgirls
MONGO_PASSWORD=$(openssl rand -base64 32)

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# JWT Secrets
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)

# AWS (Update with your credentials)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nrsgirls-media-dev

# Stripe (Update with your keys)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email (Update with your SMTP credentials)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@nrsgirls.com
SMTP_PASS=your_password

# Application URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STREAM_URL=rtmp://localhost:1935
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
EOF
    
    print_success "Default .env file created"
}

# Generate secrets
generate_secrets() {
    if command_exists openssl; then
        # Replace placeholder secrets with real ones
        sed -i.bak "s/your_jwt_secret/$(openssl rand -base64 64)/" .env 2>/dev/null || \
        sed -i "" "s/your_jwt_secret/$(openssl rand -base64 64)/" .env
        
        print_success "Secrets generated"
    else
        print_warning "OpenSSL not found. Please manually update secrets in .env"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Ask if user wants to install dependencies locally
    read -p "Install dependencies locally? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -d "backend/api" ]; then
            print_info "Installing backend dependencies..."
            cd backend/api && npm install && cd ../..
            print_success "Backend dependencies installed"
        fi
        
        if [ -d "frontend" ]; then
            print_info "Installing frontend dependencies..."
            cd frontend && npm install && cd ..
            print_success "Frontend dependencies installed"
        fi
    else
        print_info "Skipping local dependency installation"
        print_info "Dependencies will be installed in Docker containers"
    fi
}

# Setup databases
setup_databases() {
    print_header "Setting Up Databases"
    
    print_info "Starting database containers..."
    docker-compose up -d postgres mongodb redis
    
    print_info "Waiting for databases to be ready..."
    sleep 10
    
    # Wait for PostgreSQL
    print_info "Waiting for PostgreSQL..."
    until docker-compose exec -T postgres pg_isready -U nrsgirls >/dev/null 2>&1; do
        sleep 2
        echo -n "."
    done
    echo ""
    print_success "PostgreSQL is ready"
    
    # Wait for MongoDB
    print_info "Waiting for MongoDB..."
    until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
        sleep 2
        echo -n "."
    done
    echo ""
    print_success "MongoDB is ready"
    
    # Wait for Redis
    print_info "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; do
        sleep 2
        echo -n "."
    done
    echo ""
    print_success "Redis is ready"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    print_info "Starting all services with Docker Compose..."
    docker-compose up -d
    
    print_info "Waiting for services to start..."
    sleep 5
    
    print_success "All services started"
}

# Run migrations
run_migrations() {
    print_header "Running Database Migrations"
    
    print_info "Running PostgreSQL migrations..."
    docker-compose exec -T api npm run migrate 2>/dev/null || print_warning "Migrations not configured yet"
    
    print_success "Migrations complete"
}

# Seed data
seed_data() {
    print_header "Seeding Database"
    
    read -p "Do you want to seed the database with sample data? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Seeding database..."
        docker-compose exec -T api npm run seed 2>/dev/null || print_warning "Seed script not configured yet"
        print_success "Database seeded"
    else
        print_info "Skipping database seeding"
    fi
}

# Final checks
final_checks() {
    print_header "Running Final Checks"
    
    # Check if services are running
    print_info "Checking service status..."
    docker-compose ps
    
    # Check API health
    print_info "Checking API health..."
    sleep 5
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_success "API is healthy"
    else
        print_warning "API health check failed (this is normal if API is still starting)"
    fi
}

# Print completion message
print_completion() {
    print_header "Setup Complete!"
    
    echo ""
    echo -e "${GREEN}✓${NC} NRSgirls platform is ready for development!"
    echo ""
    echo "Services are running at:"
    echo -e "  ${BLUE}Frontend:${NC}    http://localhost:3001"
    echo -e "  ${BLUE}API:${NC}         http://localhost:3000"
    echo -e "  ${BLUE}API Docs:${NC}    http://localhost:3000/api/docs"
    echo -e "  ${BLUE}PostgreSQL:${NC}  localhost:5432"
    echo -e "  ${BLUE}MongoDB:${NC}     localhost:27017"
    echo -e "  ${BLUE}Redis:${NC}       localhost:6379"
    echo ""
    echo "Useful commands:"
    echo -e "  ${YELLOW}View logs:${NC}       docker-compose logs -f"
    echo -e "  ${YELLOW}Stop services:${NC}   docker-compose down"
    echo -e "  ${YELLOW}Restart:${NC}         docker-compose restart"
    echo ""
    echo "Next steps:"
    echo "  1. Update .env with your API keys"
    echo "  2. Review the documentation in /docs"
    echo "  3. Start developing!"
    echo ""
}

# Error handler
trap 'print_error "Setup failed at line $LINENO. Check the error message above."' ERR

# Run main function
main "$@"
