# 🚀 Hướng Dẫn Deploy HaNoiSun Travel

## 📋 Tổng Quan
Dự án HaNoiSun Travel đã được chuẩn bị đầy đủ để deploy lên các nền tảng hosting phổ biến và sử dụng Docker.

## 🐳 Deploy với Docker

### Cài Đặt Docker
1. **Windows**: Tải Docker Desktop từ https://www.docker.com/products/docker-desktop/
2. **Khởi động Docker Desktop** sau khi cài đặt

### Build và Chạy Production
```bash
# Build Docker image
docker build -t hanoisun-travel:latest .

# Chạy container
docker run -d -p 3000:80 --name hanoisun-app hanoisun-travel:latest

# Truy cập: http://localhost:3000
```

### Chạy Development với Docker
```bash
# Build development image
docker build -f Dockerfile.dev -t hanoisun-travel:dev .

# Chạy development container
docker run -d -p 5173:5173 -v ${PWD}:/app --name hanoisun-dev hanoisun-travel:dev

# Hoặc sử dụng docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

### Docker Compose Production
```bash
# Chạy production stack
docker-compose up -d

# Dừng services
docker-compose down

# Xem logs
docker-compose logs -f
```

## ☁️ Deploy lên Cloud Hosting

### 1. Netlify (Khuyến nghị)
```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Hoặc kết nối với Git repository
netlify init
```

**Cấu hình Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

### 2. Vercel
```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Hoặc kết nối với Git
vercel init
```

### 3. GitHub Pages
```bash
# Cài gh-pages
npm install --save-dev gh-pages

# Thêm vào package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

### 4. Firebase Hosting
```bash
# Cài Firebase CLI
npm install -g firebase-tools

# Login và init
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

## 🔧 Cấu Hình Môi Trường

### Environment Variables
Tạo file `.env.production`:
```env
VITE_API_URL=https://api.hanoisuntravel.com
VITE_APP_NAME=HaNoiSun Travel
VITE_APP_VERSION=1.0.0
```

### Build Optimization
```bash
# Build cho production
npm run build

# Preview build locally
npm run preview

# Analyze bundle size
npm install --save-dev rollup-plugin-visualizer
```

## 🚀 CI/CD với GitHub Actions

Tạo file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🐳 Deploy Docker lên Cloud

### 1. Docker Hub
```bash
# Tag image
docker tag hanoisun-travel:latest yourusername/hanoisun-travel:latest

# Push to Docker Hub
docker push yourusername/hanoisun-travel:latest
```

### 2. Google Cloud Run
```bash
# Build và push
gcloud builds submit --tag gcr.io/PROJECT_ID/hanoisun-travel

# Deploy
gcloud run deploy --image gcr.io/PROJECT_ID/hanoisun-travel --platform managed
```

### 3. AWS ECS/Fargate
```bash
# Push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com

docker tag hanoisun-travel:latest aws_account_id.dkr.ecr.region.amazonaws.com/hanoisun-travel:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/hanoisun-travel:latest
```

## 📊 Monitoring & Performance

### Health Check Endpoint
Thêm vào `public/health.json`:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### Performance Monitoring
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

## 🔒 Security Best Practices

1. **HTTPS**: Luôn sử dụng HTTPS cho production
2. **Environment Variables**: Không commit secrets vào Git
3. **Content Security Policy**: Cấu hình CSP headers
4. **Rate Limiting**: Implement rate limiting cho API

## 🛠️ Troubleshooting

### Common Issues
1. **Build fails**: Kiểm tra Node.js version (cần >= 18)
2. **Docker build slow**: Sử dụng .dockerignore
3. **Routing issues**: Cấu hình SPA fallback
4. **Large bundle**: Analyze và optimize imports

### Debug Commands
```bash
# Check build output
npm run build -- --mode development

# Debug Docker build
docker build --no-cache -t hanoisun-travel:debug .

# Check container logs
docker logs hanoisun-app
```

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy, hãy kiểm tra:
1. Node.js version >= 18
2. Docker Desktop đang chạy
3. Network connectivity
4. Build logs để xác định lỗi cụ thể

---
**Chúc bạn deploy thành công! 🎉**
