# Database Structure - HNS Booking Tour

## Tổng quan

Database sử dụng PostgreSQL với các bảng chính:

## 1. User Management (4 bảng)

### users
Thông tin đăng nhập và authentication
```
id, party_id, username, password_hash, auth_provider, 
provider_user_id, is_active, last_login, created_at, updated_at
```

### parties  
Thông tin cá nhân (người hoặc tổ chức)
```
id, party_type, full_name, email, phone_number, 
is_email_verified, is_phone_verified, metadata, created_at, updated_at
```

### roles
Danh sách roles trong hệ thống
```
id, role_name, description, created_at, updated_at
```
**Data**: admin, user, provider

### user_roles
Liên kết user với role (many-to-many)
```
user_id, role_id, assigned_at
```

---

## 2. Services (5 bảng)

### services
Dịch vụ chính (tours, hotels, flights, combos)
```
id, service_type, name, short_description, description, 
status, created_at, updated_at
```

### service_details_tour
Chi tiết tour
```
id, service_id, duration_days, country, min_participants, 
max_participants, itinerary, created_at, updated_at
```

### service_details_flight
Chi tiết vé máy bay
```
id, service_id, airline, flight_number, departure_airport, 
arrival_airport, departure_time, arrival_time, aircraft_type, 
baggage_allowance, seat_class, created_at, updated_at
```

### service_details_hotel
Chi tiết khách sạn
```
id, service_id, hotel_name, hotel_address, star_rating, 
room_type, bed_type, room_size, max_occupancy, amenities, 
check_in_time, check_out_time, cancellation_policy, 
created_at, updated_at
```

### service_details_combo
Chi tiết combo
```
id, service_id, includes_tour, includes_hotel, includes_flight, 
combo_description, special_offers, created_at, updated_at
```

### service_variants
Các biến thể giá của service
```
id, service_id, variant_name, description, price, 
available_quantity, created_at, updated_at
```

### service_images
Ảnh của service
```
id, service_id, image_url, is_primary, sort_order, 
created_at, updated_at
```

### service_availabilities
Lịch khả dụng của service
```
id, service_id, start_datetime, end_datetime, 
available_slots, created_at, updated_at
```

---

## 3. Bookings (3 bảng)

### bookings
Đơn đặt chỗ
```
id, booking_code, buyer_party_id, total_amount, currency, 
status, note, created_at, updated_at
```

### booking_items
Chi tiết items trong booking
```
id, booking_id, availability_id, service_id, variant_id, 
quantity, unit_price, currency, total_price, note, 
created_at, updated_at
```

### booking_participants
Người tham gia trong booking
```
id, booking_id, party_id, participant_type, 
created_at, updated_at
```

---

## Quan hệ chính

### User Flow
```
users (1) ---> (1) parties
  |
  v (N)
user_roles (N) ---> (1) roles
```

### Service Flow
```
services (1) ---> (1) service_details_* (tour/flight/hotel/combo)
  |
  +---> (N) service_variants
  +---> (N) service_images
  +---> (N) service_availabilities
```

### Booking Flow
```
parties (1) ---> (N) bookings
  |
  v
booking_items (N) ---> (1) services
  |                     |
  |                     v
  |                  service_variants
  v
service_availabilities

bookings (1) ---> (N) booking_participants ---> (1) parties
```

---

## Enums

### party_type
- PERSON
- ORGANIZATION

### service_type
- TOUR
- HOTEL
- FLIGHT
- COMBO

### booking_status
- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

### service_status
- ACTIVE
- INACTIVE
- DRAFT

---

## Indexes

### users
- PRIMARY KEY: id
- UNIQUE: username
- INDEX: party_id

### parties
- PRIMARY KEY: id
- UNIQUE: email

### user_roles
- PRIMARY KEY: (user_id, role_id)
- INDEX: user_id, role_id

### services
- PRIMARY KEY: id
- INDEX: service_type, status

### bookings
- PRIMARY KEY: id
- UNIQUE: booking_code
- INDEX: buyer_party_id, status

---

## Sample Data

### Roles
```sql
INSERT INTO roles (role_name, description) VALUES
('admin', 'Administrator - Full system access'),
('user', 'Regular user - Can book tours'),
('provider', 'Service provider - Can manage services');
```

### Users
```sql
-- Admin user
INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified) 
VALUES ('PERSON', 'Admin User', 'admin@hanoisuntravel.com', '0123456789', true);

INSERT INTO users (party_id, username, password_hash, is_active) 
VALUES (1, 'admin@hanoisuntravel.com', '$2b$10$...', true);

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Regular user
INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified) 
VALUES ('PERSON', 'Demo User', 'user@demo.com', '0987654321', true);

INSERT INTO users (party_id, username, password_hash, is_active) 
VALUES (2, 'user@demo.com', '$2b$10$...', true);

INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);
```

---

## Migration Files

1. `add_service_type_details.sql` - Tạo bảng service_details_*
2. Các migration khác trong folder `backend/migrations/`

---

## Scripts hữu ích

### View user tables
```bash
node backend/scripts/viewUserTables.js
```

### Check schema
```bash
node backend/scripts/checkUserSchema.js
```

### Test Admin Users API
```bash
node backend/scripts/testAdminUsersAPI.js
```

---

## Notes

1. **party_id**: Tất cả thông tin cá nhân (email, phone, name) nằm trong bảng `parties`, không nằm trong `users`
2. **user_id vs party_id**: `users` dùng cho authentication, `parties` dùng cho thông tin cá nhân
3. **bookings**: Dùng `buyer_party_id` để link với `parties`, không dùng `user_id`
4. **service_type**: Mỗi service type có bảng detail riêng (tour, flight, hotel, combo)
5. **metadata**: Field JSONB trong `parties` để lưu thông tin bổ sung linh hoạt
