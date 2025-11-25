#!/bin/sh

# Script para selecionar configuração do Nginx baseado no ambiente

if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production mode: Using SSL configuration"
    cp /tmp/nginx.prod.conf /etc/nginx/conf.d/default.conf
else
    echo "🔧 Development mode: Using HTTP-only configuration"
    cp /tmp/nginx.dev.conf /etc/nginx/conf.d/default.conf
fi

# Start Nginx
nginx -g 'daemon off;'
