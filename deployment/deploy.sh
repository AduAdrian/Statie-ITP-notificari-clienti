#!/bin/bash
# =============================================================================
# SCRIPT DEPLOYMENT pentru misedainspectsrl.ro
# =============================================================================

set -e  # Exit on any error

echo "🚀 Starting deployment for misedainspectsrl.ro..."

# Variables
SERVER_USER="root"  # sau alt user cu sudo
SERVER_HOST="misedainspectsrl.ro"
DEPLOY_PATH="/var/www/misedainspectsrl.ro"
BACKUP_PATH="/var/backups/misedainspectsrl.ro"
SERVICE_NAME="miseda-notificari"

# Colors pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Build client pentru producție
print_status "Building React client for production..."
cd client
npm install
npm run build:prod
cd ..

# 2. Prepare server files
print_status "Preparing server files..."
cd server
npm install --production
cd ..

# 3. Create deployment archive
print_status "Creating deployment archive..."
tar -czf miseda-notificari-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=*.log \
    --exclude=client/src \
    --exclude=client/public \
    --exclude=client/node_modules \
    client/build/ server/ deployment/

# 4. Upload și deploy pe server (uncomment pentru folosire reală)
print_warning "Upload commands - uncomment when ready to deploy:"
echo "# scp miseda-notificari-*.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/"
echo "# ssh $SERVER_USER@$SERVER_HOST 'bash -s' < deployment/server-deploy.sh"

print_status "Local build completed successfully!"
print_status "Files ready for deployment in miseda-notificari-*.tar.gz"

# 5. Instructions pentru configurare email
print_status "=== EMAIL CONFIGURATION INSTRUCTIONS ==="
echo ""
echo "1. Configure email server pentru notificari@misedainspectsrl.ro:"
echo "   - Creați contul de email în cPanel/hosting panel"
echo "   - Configurați SMTP settings"
echo "   - Testați conectivitatea"
echo ""
echo "2. Update .env.production cu datele corecte:"
echo "   EMAIL_HOST=mail.misedainspectsrl.ro"
echo "   EMAIL_USER=notificari@misedainspectsrl.ro"
echo "   EMAIL_PASS=your-secure-password"
echo ""
echo "3. Configurare DNS pentru email:"
echo "   - MX record: mail.misedainspectsrl.ro"
echo "   - SPF record: 'v=spf1 include:_spf.hosting-provider.com ~all'"
echo "   - DKIM record (dacă disponibil)"
echo ""

print_status "Deployment preparation completed! 🎉"
