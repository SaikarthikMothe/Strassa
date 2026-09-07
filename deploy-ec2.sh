#!/bin/bash
# ==============================================================================
# AWS EC2 Automated Deployment Script for Strassa (Frontend + Backend + WebSockets)
# Target OS: Ubuntu 22.04 / 24.04 LTS (t2.micro or t3.micro Free Tier)
# ==============================================================================

set -e

echo "🚀 Starting AWS EC2 Setup for Strassa..."

# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install essential dependencies
sudo apt install -y curl git nginx ufw

# 3. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 4. Install PM2 globally
sudo npm install -g pm2

# 5. Set up Backend
echo "⚙️ Setting up Backend..."
cd backend
npm install --omit=dev

# Start backend with PM2
pm2 stop strassa-backend || true
pm2 start server.js --name "strassa-backend"
pm2 save
pm2 startup systemd | tail -n 1 | sudo bash || true

cd ..

# 6. Configure Nginx Reverse Proxy with WebSocket support
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # Backend API & Health Check
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO WebSocket endpoints
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx

# 7. Configure Firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

PUBLIC_IP=$(curl -s ifconfig.me || echo "your-ec2-ip")

echo "=============================================================================="
echo "🎉 AWS EC2 Deployment Complete!"
echo "📡 Backend & WebSockets running at: http://$PUBLIC_IP"
echo "🔍 Health check: http://$PUBLIC_IP/health"
echo "=============================================================================="
