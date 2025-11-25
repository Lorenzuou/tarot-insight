#!/bin/sh

# Start either nginx (production) or a lightweight Node static server (development)

if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production mode: Starting nginx with SSL configuration"
    # copy nginx config and start nginx
    cp /tmp/nginx.prod.conf /etc/nginx/conf.d/default.conf
    exec nginx -g 'daemon off;'
else
    echo "🔧 Development mode: Starting Node static server (serve)"
    # Use 'serve' to serve the built static files from /app/dist on port 80
    # If 'serve' isn't installed globally (it should be in the image), fall back to npx
    if command -v serve >/dev/null 2>&1; then
        exec serve -s dist -l 80
    else
        exec npx serve -s dist -l 80
    fi
fi
