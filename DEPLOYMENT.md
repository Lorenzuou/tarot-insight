# Deployment Guide - Taro App

This guide walks you through setting up the Taro Next.js application on a VM server after cloning the repository.

## Prerequisites

Your VM should have:
- **Linux OS** (Ubuntu 20.04+ or similar)
- **SSH access** with sudo privileges
- **Git** installed
- **Port 3000** (or custom port) open in firewall

## Step 1: Install Node.js and npm

SSH into your VM and install Node.js (v18+ recommended):

```bash
# Update package list
sudo apt update

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

Alternative using nvm (Node Version Manager):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

## Step 2: Clone the Repository

```bash
# Navigate to your preferred directory
cd /var/www  # or ~/apps or wherever you want

# Clone the repository
git clone <your-repo-url> taro
cd taro
```

## Step 3: Install Dependencies

```bash
npm install
```

If you encounter permission issues, avoid using `sudo npm install`. Instead, fix npm permissions or use a user-level install.

## Step 4: Build the Application

```bash
# Create production build
npm run build
```

This creates an optimized production build in `.next/` directory.

## Step 5: Start the Production Server

### Option A: Direct Start (for testing)

```bash
# Start on default port 3000
npm start
```

The app will be available at `http://your-vm-ip:3000`

### Option B: Custom Port

```bash
# Start on custom port (e.g., 8080)
PORT=8080 npm start
```

### Option C: Production Server with PM2 (Recommended)

PM2 is a process manager that keeps your app running, handles restarts, and manages logs.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app with PM2
pm2 start npm --name "taro" -- start

# Or with custom port
PORT=8080 pm2 start npm --name "taro" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the command output instructions
```

#### Useful PM2 Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs taro

# Restart app
pm2 restart taro

# Stop app
pm2 stop taro

# Delete app from PM2
pm2 delete taro
```

## Step 6: Configure Reverse Proxy (Optional but Recommended)

Use Nginx or Apache to proxy requests from port 80/443 to your Node.js app.

### Nginx Example

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/taro
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or VM IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/taro /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Now your app will be accessible at `http://your-domain.com` (port 80).

## Step 7: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

Your app will now be available at `https://your-domain.com`.

## Step 8: Configure Firewall

```bash
# Allow SSH (if not already allowed)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Or if running directly on port 3000
sudo ufw allow 3000

# Enable firewall
sudo ufw enable
```

## Environment Variables

If your app needs environment variables, create a `.env.local` file:

```bash
# In the project directory
nano .env.local
```

Add your variables:

```
NEXT_PUBLIC_API_URL=https://api.example.com
# Add other variables as needed
```

Then rebuild:

```bash
npm run build
pm2 restart taro  # if using PM2
```

## Updating the Application

When you push changes to your repository:

```bash
# SSH into your VM
cd /var/www/taro  # or your project directory

# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart the server
pm2 restart taro  # if using PM2
# or restart your process manager
```

## Monitoring and Logs

### PM2 Logs

```bash
# View real-time logs
pm2 logs taro

# View last 200 lines
pm2 logs taro --lines 200

# Clear logs
pm2 flush
```

### System Resources

```bash
# Monitor with PM2
pm2 monit

# Check memory/CPU
htop
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Permission Issues

```bash
# Fix ownership of project directory
sudo chown -R $USER:$USER /var/www/taro
```

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Quick Reference

```bash
# Development (local)
npm run dev

# Production build
npm run build

# Start production server
npm start

# With PM2
pm2 start npm --name "taro" -- start
pm2 logs taro
pm2 restart taro
pm2 stop taro
```

## Security Recommendations

1. **Keep Node.js updated**: Regularly update Node.js and npm
2. **Use environment variables**: Never commit sensitive data to git
3. **Enable firewall**: Only open necessary ports
4. **Use HTTPS**: Set up SSL certificates with Let's Encrypt
5. **Regular updates**: Keep dependencies up to date with `npm audit fix`
6. **Limit SSH access**: Use SSH keys instead of passwords
7. **Run as non-root user**: Don't run the Node.js process as root

---

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
