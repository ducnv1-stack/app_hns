#!/bin/bash

# HaNoiSun Deployment Script
# Server: 36.50.55.209

set -e

echo "🚀 Starting HaNoiSun deployment..."

# Configuration
SERVER_IP="36.50.55.209"
APP_NAME="hanoisun-app"
PROJECT_DIR="/opt/hanoisun"
BACKUP_DIR="/opt/hanoisun-backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Create backup of current deployment
create_backup() {
    if [ -d "$PROJECT_DIR" ]; then
        print_status "Creating backup of current deployment..."
        sudo mkdir -p "$BACKUP_DIR"
        sudo cp -r "$PROJECT_DIR" "$BACKUP_DIR/hanoisun-$(date +%Y%m%d_%H%M%S)"
        print_status "Backup created successfully"
    fi
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    if docker ps -q --filter "name=$APP_NAME" | grep -q .; then
        docker stop "$APP_NAME" || true
        docker rm "$APP_NAME" || true
    fi
    
    # Stop using docker-compose if compose file exists
    if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
        cd "$PROJECT_DIR"
        docker-compose down || true
    fi
}

# Deploy application
deploy_app() {
    print_status "Deploying HaNoiSun application..."
    
    # Create project directory
    sudo mkdir -p "$PROJECT_DIR"
    
    # Copy files to server (assuming files are in current directory)
    print_status "Copying application files..."
    sudo cp -r . "$PROJECT_DIR/"
    
    # Set proper permissions
    sudo chown -R $USER:$USER "$PROJECT_DIR"
    
    # Navigate to project directory
    cd "$PROJECT_DIR"
    
    # Build and start containers
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting containers..."
    docker-compose up -d
    
    # Wait for containers to be ready
    sleep 10
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_status "✅ Deployment successful!"
        print_status "Application is running at: http://$SERVER_IP:8080"
    else
        print_error "❌ Deployment failed. Check container logs:"
        docker-compose logs
        exit 1
    fi
}

# Cleanup old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Check if port 8080 is accessible
    if curl -f -s "http://localhost:8080" > /dev/null; then
        print_status "✅ Health check passed - Application is responding"
    else
        print_warning "⚠️  Health check failed - Application may not be fully ready"
        print_status "Check logs: docker-compose logs"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment to server: $SERVER_IP"
    
    check_docker
    create_backup
    stop_containers
    deploy_app
    cleanup
    health_check
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Access your application at: http://$SERVER_IP:8080"
    print_status ""
    print_status "Useful commands:"
    print_status "  - View logs: docker-compose logs -f"
    print_status "  - Restart: docker-compose restart"
    print_status "  - Stop: docker-compose down"
    print_status "  - Update: ./deploy.sh"
}

# Run main function
main "$@"
