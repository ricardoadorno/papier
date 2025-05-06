# SSL Automation Guide for Papier

This document explains how to use the SSL automation scripts for both development and production environments.

## Development Environment (Self-Signed Certificates)

For local development and testing, you can use self-signed certificates:

### On Windows:
1. Run the `ssl/generate-self-signed.bat` script by double-clicking it or running it from Command Prompt:
   ```
   cd path\to\papier\ssl
   .\generate-self-signed.bat
   ```

### On Linux/Mac:
1. Make the script executable:
   ```bash
   chmod +x ssl/generate-self-signed.sh
   ```

2. Run the script:
   ```bash
   ./ssl/generate-self-signed.sh
   ```

The script will generate `cert.pem` and `key.pem` files in the `ssl` directory, which will be automatically mounted to the Nginx container.

**Note**: Browsers will show a security warning when using self-signed certificates. This is normal and can be bypassed for development purposes.

## Production Environment (Let's Encrypt)

For production on AWS EC2, follow these steps to set up automated Let's Encrypt certificates:

1. Deploy your application to your EC2 instance
2. Make sure your domain is pointing to your EC2 instance's IP address
3. Make the script executable:
   ```bash
   chmod +x ssl/setup-letsencrypt.sh
   ```

4. Run the script with your domain and email:
   ```bash
   ./ssl/setup-letsencrypt.sh --domain yourdomain.com --email your@email.com
   ```

The script will:
- Install Certbot if necessary
- Request SSL certificates from Let's Encrypt
- Copy the certificates to your application's `ssl` directory
- Set up automatic renewal using cron jobs
- Configure automatic certificate updates when renewed

### Verification

To verify the SSL setup is working correctly:
1. Access your site using HTTPS: `https://yourdomain.com`
2. Check the certificate details in your browser
3. You can also use SSL verification services like [SSL Labs](https://www.ssllabs.com/ssltest/)

### Troubleshooting

If you encounter issues:
1. Check the Let's Encrypt logs: `/var/log/letsencrypt/letsencrypt.log`
2. Ensure ports 80 and 443 are open in your EC2 security group
3. Verify your domain DNS is correctly pointing to your EC2 instance

## Managing SSL in Docker Compose

The Docker Compose configuration is already set up to:
- Mount the `ssl` directory to the Nginx container
- Expose both HTTP (80) and HTTPS (443) ports

## Force HTTPS Redirection

To force all HTTP traffic to redirect to HTTPS, uncomment these lines in `nginx.conf`:
```nginx
if ($scheme != "https") {
    return 301 https://$host$request_uri;
}
```

Then restart the client container:
```bash
docker-compose restart client
```