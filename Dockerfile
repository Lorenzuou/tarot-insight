# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
### Runtime stage - choose server depending on NODE_ENV

# Default to a lightweight Node runtime for development so we can run `npx serve`
FROM node:20-alpine AS runtime-dev
WORKDIR /app
COPY --from=builder /app/dist ./dist

# Install 'serve' for static serving in development
RUN npm install -g serve

# Production runtime (nginx)
FROM nginx:alpine AS runtime-prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.dev.conf /tmp/nginx.dev.conf
COPY nginx.prod.conf /tmp/nginx.prod.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Final image: pick node runtime and copy nginx files too (entrypoint will decide)
FROM node:20-alpine
WORKDIR /app

# Copy built assets and nginx configs/entrypoint so entrypoint can choose
COPY --from=builder /app/dist ./dist
COPY --from=runtime-prod /tmp/nginx.dev.conf /tmp/nginx.dev.conf
COPY --from=runtime-prod /tmp/nginx.prod.conf /tmp/nginx.prod.conf
COPY --from=runtime-prod /docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80 for HTTP (used by both serve and nginx)
EXPOSE 80

# Health check used by compose
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
