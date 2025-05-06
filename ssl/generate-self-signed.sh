#!/bin/bash
# ssl/generate-self-signed.sh
# Script to generate self-signed SSL certificates for development

# Set the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Generating self-signed SSL certificates for development..."

# Generate a self-signed certificate valid for 365 days
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SCRIPT_DIR/key.pem" \
  -out "$SCRIPT_DIR/cert.pem" \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Set appropriate permissions
chmod 644 "$SCRIPT_DIR/cert.pem"
chmod 600 "$SCRIPT_DIR/key.pem"

echo "Self-signed certificates generated successfully!"
echo "Location: $SCRIPT_DIR/cert.pem and $SCRIPT_DIR/key.pem"
echo ""
echo "WARNING: Self-signed certificates are only suitable for development."
echo "For production, use Let's Encrypt or another trusted certificate authority."