@echo off
REM ssl/generate-self-signed.bat
REM Script to generate self-signed SSL certificates for development on Windows

echo Generating self-signed SSL certificates for development...

REM Store the current directory
set SCRIPT_DIR=%~dp0

REM Generate a self-signed certificate valid for 365 days
openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
  -keyout "%SCRIPT_DIR%key.pem" ^
  -out "%SCRIPT_DIR%cert.pem" ^
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo.
echo Self-signed certificates generated successfully!
echo Location: %SCRIPT_DIR%cert.pem and %SCRIPT_DIR%key.pem
echo.
echo WARNING: Self-signed certificates are only suitable for development.
echo For production, use Let's Encrypt or another trusted certificate authority.
echo.
pause