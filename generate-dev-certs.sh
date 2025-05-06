#!/bin/bash

# Create a script to generate self-signed SSL certificates for development

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate a private key
openssl genrsa -out ssl/key.pem 2048

# Generate a CSR (Certificate Signing Request)
openssl req -new -key ssl/key.pem -out ssl/csr.pem -subj "/CN=localhost/O=Papier/C=US"

# Generate a self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem

# Remove the CSR as it's no longer needed
rm ssl/csr.pem

echo "Self-signed SSL certificates generated successfully!"
echo "Note: These certificates are for development only. For production, use certificates from a trusted CA."