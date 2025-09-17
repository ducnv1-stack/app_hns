# /root/app_hns/HaNoiSun-main/Dockerfile

# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets từ stage build
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx ĐƠN GIẢN dành cho container
COPY nginx.container.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (bên trong container)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
