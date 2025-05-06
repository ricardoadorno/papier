#!/bin/bash

# deploy.sh - Deployment script for Papier application
# This script handles both development and production deployments

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to display help message
show_help() {
  echo -e "${GREEN}Papier Deployment Script${NC}"
  echo -e "Usage: ./deploy.sh [options]"
  echo -e "Options:"
  echo -e "  --env [development|production]   Set deployment environment (default: development)"
  echo -e "  --domain [domain]                Domain name for production (e.g., papier.example.com)"
  echo -e "  --email [email]                  Email for Let's Encrypt (required for production)"
  echo -e "  --help                           Show this help message"
}

# Default values
ENVIRONMENT="production"
DOMAIN="ricardoadorno.com"
EMAIL="ricardo.castrorc1998@gmail.com"

# Parse command-line arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --env)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Error: Unknown option $1${NC}"
      show_help
      exit 1
      ;;
  esac
done

# Validate inputs for production environment
if [ "$ENVIRONMENT" = "production" ]; then
  if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Domain name is required for production deployment${NC}"
    echo -e "${YELLOW}Use: ./deploy.sh --env production --domain yourdomain.com --email your@email.com${NC}"
    exit 1
  fi
  
  if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email is required for Let's Encrypt certificates${NC}"
    echo -e "${YELLOW}Use: ./deploy.sh --env production --domain yourdomain.com --email your@email.com${NC}"
    exit 1
  fi
fi

# Update environment variables
sed -i "s/^NODE_ENV=.*/NODE_ENV=$ENVIRONMENT/g" .env

# Function to set up SSL certificates
setup_ssl() {
  if [ "$ENVIRONMENT" = "development" ]; then
    echo -e "${YELLOW}Development environment: Generating self-signed certificates...${NC}"
    # Generate self-signed certificates for development
    ./generate-dev-certs.sh
  else
    echo -e "${YELLOW}Production environment: Setting up Let's Encrypt certificates...${NC}"
    
    # Ensure certbot is installed
    if ! command -v certbot &> /dev/null; then
      echo -e "${YELLOW}Installing certbot...${NC}"
      sudo apt-get update
      sudo apt-get install -y certbot
    fi
    
    # Get or renew Let's Encrypt certificates
    echo -e "${YELLOW}Obtaining Let's Encrypt certificates for $DOMAIN...${NC}"
    sudo certbot certonly --standalone --preferred-challenges http \
      --agree-tos --email "$EMAIL" -d "$DOMAIN" \
      --non-interactive --keep-until-expiring
    
    # Copy certificates to the SSL directory
    echo -e "${YELLOW}Copying certificates to SSL directory...${NC}"
    sudo mkdir -p ./ssl
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/key.pem
    sudo chmod 644 ./ssl/cert.pem ./ssl/key.pem
    
    # Set up automatic renewal
    echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $(pwd)/ssl/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $(pwd)/ssl/key.pem") | crontab -
  fi
}

# Setup SSL certificates
setup_ssl

# Update Nginx configuration for production if needed
if [ "$ENVIRONMENT" = "production" ]; then
  echo -e "${YELLOW}Updating Nginx configuration for production...${NC}"
  sed -i "s/server_name localhost;/server_name $DOMAIN;/g" nginx.conf
  # Uncomment HSTS header for production
  sed -i 's/# add_header Strict-Transport-Security/add_header Strict-Transport-Security/g' nginx.conf
else
  echo -e "${YELLOW}Using development Nginx configuration...${NC}"
  sed -i "s/server_name .*;/server_name localhost;/g" nginx.conf
  # Comment out HSTS header for development
  sed -i 's/add_header Strict-Transport-Security/# add_header Strict-Transport-Security/g' nginx.conf
fi

# Deploy with Docker Compose
echo -e "${GREEN}Deploying Papier application in $ENVIRONMENT mode...${NC}"
docker-compose down
docker-compose build
docker-compose up -d

echo -e "${GREEN}Deployment completed successfully!${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
  echo -e "${GREEN}Your application is now available at https://$DOMAIN${NC}"
else
  echo -e "${GREEN}Your application is now available at https://localhost${NC}"
  echo -e "${YELLOW}Note: You may need to accept the self-signed certificate in your browser${NC}"
fi