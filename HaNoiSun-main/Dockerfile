# syntax=docker/dockerfile:1

# ---- Build stage: compile Vite app ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps using lockfile for reproducible builds
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage: serve with Nginx ----
FROM nginx:1.27-alpine AS runtime

# Replace default config with SPA-friendly fallback and asset caching
RUN rm -f /etc/nginx/conf.d/default.conf \
  && printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  location / {' \
  '    try_files $uri /index.html;' \
  '  }' \
  '  location /assets/ {' \
  '    expires 1y;' \
  '    add_header Cache-Control "public, max-age=31536000, immutable";' \
  '  }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


