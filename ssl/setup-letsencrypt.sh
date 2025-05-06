#!/bin/bash
# ssl/setup-letsencrypt.sh
# Script to automate Let's Encrypt SSL certificate setup and renewal for production

# Set default values
EMAIL=""
DOMAIN=""
WEBROOT="/var/www/html"
APP_PATH=$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")
COMPOSE_CMD="docker-compose"

# Function to display help
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -d, --domain DOMAIN     Domain name for the certificate (required)"
    echo "  -e, --email EMAIL       Email for Let's Encrypt notifications (required)"
    echo "  -p, --path PATH         Path to your application directory (default: script parent directory)"
    echo "  -w, --webroot PATH      Path to webroot for certbot (default: /var/www/html)"
    echo "  -h, --help              Show this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        -p|--path)
            APP_PATH="$2"
            shift 2
            ;;
        -w|--webroot)
            WEBROOT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

# Check required parameters
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Error: Domain and email are required parameters."
    show_help
fi

# Set paths
SSL_DIR="$APP_PATH/ssl"
LOG_FILE="$SSL_DIR/letsencrypt.log"

# Ensure SSL directory exists
mkdir -p "$SSL_DIR"
mkdir -p "$WEBROOT/.well-known/acme-challenge"

echo "Setting up Let's Encrypt SSL certificates for $DOMAIN..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Request certificates using webroot plugin
echo "Requesting certificates from Let's Encrypt..."
sudo certbot certonly --webroot -w "$WEBROOT" \
    --email "$EMAIL" --agree-tos --no-eff-email \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --cert-name "$DOMAIN" \
    --post-hook "bash $SSL_DIR/update-certs.sh" \
    --non-interactive

# Create update script
cat > "$SSL_DIR/update-certs.sh" << 'EOL'
#!/bin/bash

# This script is automatically called after successful certificate renewal
DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
    # Try to get from environment or use default
    DOMAIN="${CERTBOT_DOMAIN:-$(ls /etc/letsencrypt/live/ | head -n 1)}"
fi

APP_PATH=$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")
SSL_DIR="$APP_PATH/ssl"

# Copy the renewed certificates to the application directory
echo "Updating certificates in $SSL_DIR..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Set proper permissions
sudo chmod 644 $SSL_DIR/cert.pem
sudo chmod 600 $SSL_DIR/key.pem

# Restart nginx container to apply new certificates
cd $APP_PATH
docker-compose restart client

echo "Certificates updated successfully!"
EOL

# Make the update script executable
chmod +x "$SSL_DIR/update-certs.sh"

# Call the update script to copy certificates initially
sudo bash "$SSL_DIR/update-certs.sh" "$DOMAIN"

# Set up automatic renewal via cron
echo "Setting up automatic renewal..."
CRON_JOB="0 0,12 * * * certbot renew --quiet --post-hook \"bash $SSL_DIR/update-certs.sh\""

# Add to crontab if not already there
(crontab -l 2>/dev/null | grep -v "$SSL_DIR/update-certs.sh" ; echo "$CRON_JOB") | crontab -

echo "Let's Encrypt certificates have been set up successfully!"
echo "Certificates will automatically renew before they expire."
echo ""
echo "Certificate locations:"
echo "  - $SSL_DIR/cert.pem"
echo "  - $SSL_DIR/key.pem"
echo ""
echo "Renewal logs will be available in: $LOG_FILE"