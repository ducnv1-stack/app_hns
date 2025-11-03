# 🚀 HNS Migration Guide: PostgreSQL Local → Supabase

## 📋 Tổng quan

Hướng dẫn migrate dự án HNS từ PostgreSQL local sang Supabase cloud database.

**Connection Info:**
- **Host**: `db.exjxxakldtjjnpsivknb.supabase.co`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `Superbai@2025`

---

## ✅ Lợi ích của Supabase

### 🌐 Cloud Benefits
- **Không mất dữ liệu** khi tắt máy local
- **Backup tự động** và point-in-time recovery
- **High availability** 99.9% uptime
- **Global CDN** cho performance tốt

### 🚀 Supabase Features
- **Real-time subscriptions** - Perfect cho analytics dashboard
- **Auto-generated APIs** (REST + GraphQL)
- **Built-in Auth** - Có thể thay thế JWT hiện tại
- **Storage** - Cho images và files
- **Edge Functions** - Serverless functions

---

## 🔧 Bước 1: Export Database từ Local

### 1.1 Chạy export script
```bash
cd backend
node scripts/exportLocalDatabase.js
```

**Script sẽ tạo:**
- `exports/schema_[timestamp].sql` - Database schema
- `exports/data_[timestamp].sql` - Database data
- `exports/full_backup_[timestamp].sql` - Full backup
- `exports/supabase_import_[timestamp].sql` - **Script import cho Supabase**

### 1.2 Verify export files
```bash
ls -la exports/
# Kiểm tra các file đã được tạo
```

---

## 📊 Bước 2: Import vào Supabase

### 2.1 Truy cập Supabase Dashboard
1. Vào [supabase.com](https://supabase.com)
2. Login vào project của bạn
3. Vào **SQL Editor**

### 2.2 Import Database
1. Mở file `exports/supabase_import_[timestamp].sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click **Run** để execute

### 2.3 Verify Import
```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check data
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM bookings;
```

---

## ⚙️ Bước 3: Cập nhật Configuration

### 3.1 Backup config hiện tại
```bash
cp config.env config.env.backup
```

### 3.2 Cập nhật config cho Supabase
```bash
cp config.env.supabase config.env
```

### 3.3 Verify config
```bash
cat config.env | grep SUPABASE
# Kiểm tra SUPABASE_DB_URL đã đúng chưa
```

---

## 🧪 Bước 4: Test Supabase Connection

### 4.1 Test connection
```bash
cd backend
node scripts/testSupabaseConnection.js
```

**Expected output:**
```
✅ Supabase connection successful!
✅ Found X tables
✅ Services: X
✅ Users: X
✅ Bookings: X
✅ Analytics query successful
✅ Transaction test successful
🎉 All Supabase tests passed!
```

### 4.2 Nếu test fail
```bash
# Check config
cat config.env | grep SUPABASE_DB_URL

# Test với psql
psql "postgresql://postgres:Superbai@2025@db.exjxxakldtjjnpsivknb.supabase.co:5432/postgres"
```

---

## 🔄 Bước 5: Cập nhật Server Code

### 5.1 Update server.js
```javascript
// Thay đổi import từ:
const { pool, query, getClient } = require('./config/database');

// Thành:
const { pool, query, getClient } = require('./config/database-supabase');
```

### 5.2 Test server
```bash
node server.js
# Kiểm tra log: "✅ Connected to Supabase PostgreSQL database"
```

---

## 🧪 Bước 6: Test APIs

### 6.1 Test health endpoint
```bash
curl http://localhost:5000/api/health
```

### 6.2 Test analytics API
```bash
# Test analytics (cần admin token)
node scripts/testAnalyticsAPI.js
```

### 6.3 Test all endpoints
```bash
# Test tất cả APIs
npm run test:api
```

---

## 🎨 Bước 7: Test Frontend

### 7.1 Start frontend
```bash
cd HaNoiSun-main
npm run dev
```

### 7.2 Test analytics dashboard
1. Truy cập: `http://localhost:5173/#/admin/analytics`
2. Login với admin account
3. Kiểm tra data hiển thị đúng
4. Test date filtering
5. Test real-time updates (nếu có)

---

## 🚀 Bước 8: Production Deployment

### 8.1 Environment Variables
```bash
# Production config
NODE_ENV=production
SUPABASE_DB_URL=postgresql://postgres:Superbai@2025@db.exjxxakldtjjnpsivknb.supabase.co:5432/postgres
```

### 8.2 Update CORS
```javascript
// server.js - Update CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-domain.com',
  'https://app.hanoisuntravel.com'
];
```

---

## 📈 Bước 9: Optimization (Optional)

### 9.1 Real-time Analytics
```javascript
// Thêm real-time updates cho analytics dashboard
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Listen to booking changes
supabase
  .channel('analytics')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'bookings' },
    (payload) => {
      // Update analytics dashboard real-time
      updateAnalyticsCards();
    }
  )
  .subscribe();
```

### 9.2 Supabase Dashboard
- Monitor queries performance
- Check connection usage
- View logs và errors
- Manage users và permissions

---

## 🔒 Security Considerations

### 9.1 Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### 9.2 API Keys
- Sử dụng **Service Role Key** cho backend
- Sử dụng **Anon Key** cho frontend
- Không expose keys trong client code

---

## 🎯 Migration Checklist

- [ ] ✅ Export local database
- [ ] ✅ Import vào Supabase
- [ ] ✅ Update environment variables
- [ ] ✅ Test Supabase connection
- [ ] ✅ Update server code
- [ ] ✅ Test all APIs
- [ ] ✅ Test frontend
- [ ] ✅ Deploy to production
- [ ] ✅ Monitor performance

---

## 🚨 Rollback Plan

Nếu có vấn đề, có thể rollback:

```bash
# 1. Revert config
cp config.env.backup config.env

# 2. Revert server code
# Thay đổi import lại database.js

# 3. Restart với local database
node server.js

# 4. Data vẫn an toàn trong Supabase
```

---

## 💡 Next Steps

1. **Real-time Analytics**: Implement real-time dashboard updates
2. **Supabase Auth**: Migrate từ custom JWT sang Supabase Auth
3. **Storage**: Move images từ local storage sang Supabase Storage
4. **Edge Functions**: Move business logic sang serverless functions

---

## 🎉 Kết luận

Migration sang Supabase sẽ:
- ✅ Giữ nguyên toàn bộ code hiện tại
- ✅ Thêm cloud benefits (backup, availability)
- ✅ Mở ra real-time features
- ✅ Chuẩn bị cho production scaling
- ✅ Không mất dữ liệu khi tắt máy

**Ready to migrate?** 🚀

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trong Supabase Dashboard
2. Verify connection string
3. Test với psql command line
4. Check network connectivity

**Happy migrating!** 🎯
