# Production Deployment Checklist

## Backend Deployment
- [ ] Deploy backend to production server
- [ ] Set NODE_ENV=production
- [ ] Configure domain: https://api.hanoisuntravel.com
- [ ] Update CORS origins in server.js
- [ ] Test API endpoints: https://api.hanoisuntravel.com/api/health

## Frontend Deployment  
- [ ] Build frontend: npm run build
- [ ] Deploy to: https://app.hanoisuntravel.com
- [ ] Set VITE_API_URL=https://api.hanoisuntravel.com/api
- [ ] Test API connection from production

## Testing Commands
```bash
# Test CORS from production
curl -H "Origin: https://app.hanoisuntravel.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.hanoisuntravel.com/api/tours

# Test API endpoint
curl https://api.hanoisuntravel.com/api/health
```

## Common Issues
1. **CORS Error**: Check allowed origins in server.js
2. **API URL**: Verify VITE_API_URL points to production API
3. **HTTPS**: Ensure both frontend and backend use HTTPS
4. **Port**: Backend should run on port 5000 or configured port
