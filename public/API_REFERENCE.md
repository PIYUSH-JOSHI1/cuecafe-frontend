# Cue Stories - Complete API Reference

## 📖 API Documentation

This document outlines all API endpoints and how to use them.

---

## 🔐 Authentication & User Types

### User Roles

The system supports two user types, stored in the `users` table:

```sql
-- Check user role
SELECT email, is_admin FROM users;

-- Make user an admin
UPDATE users SET is_admin = true WHERE email = 'owner@cuestories.com';

-- Make user a regular user
UPDATE users SET is_admin = false WHERE email = 'user@example.com';
```

### User Object

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "9876543210",
  "name": "John Doe",
  "is_admin": false,
  "created_at": "2024-01-25T10:30:00Z",
  "last_login": "2024-01-25T14:22:00Z"
}
```

### Admin Object

Same as User, but with `is_admin: true`

---

## 🌐 Frontend API Endpoints

All frontend API calls go directly to Supabase REST API.

### Base URL
```
https://dtmjfodtpbjutrebgzzl.supabase.co/rest/v1
```

### Headers (Required for all requests)
```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

---

## 👤 User Management Endpoints

### 1. Sign Up User

**Endpoint**: `POST /users`

**Frontend Code**:
```javascript
const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY,
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    phone: '9876543210',
    name: 'John Doe',
    is_admin: false,
  }),
});
const user = await response.json();
```

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "phone": "9876543210",
  "name": "John Doe",
  "is_admin": false
}
```

**Response** (201 Created):
```json
{
  "id": "uuid-1234",
  "email": "newuser@example.com",
  "phone": "9876543210",
  "name": "John Doe",
  "is_admin": false,
  "created_at": "2024-01-25T10:30:00Z"
}
```

---

### 2. Get User by Email or Phone

**Endpoint**: `GET /users?email=eq.user@example.com` or `GET /users?phone=eq.9876543210`

**Frontend Code**:
```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
  {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
  }
);
const users = await response.json();
const user = users[0]; // First result
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid-1234",
    "email": "user@example.com",
    "phone": "9876543210",
    "name": "John Doe",
    "is_admin": false,
    "created_at": "2024-01-25T10:30:00Z"
  }
]
```

---

## 🎮 Games Endpoints

### 1. Get All Games for Venue

**Endpoint**: `GET /games?venue_id=eq.VENUE_UUID`

**Frontend Code**:
```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/games?venue_id=eq.${venueId}`,
  {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
  }
);
const games = await response.json();
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid-game-1",
    "venue_id": "uuid-venue",
    "name": "Snooker",
    "description": "Premium snooker tables",
    "price_per_hour": 150,
    "first_booking_discount": 25,
    "created_at": "2024-01-25T10:30:00Z"
  },
  {
    "id": "uuid-game-2",
    "venue_id": "uuid-venue",
    "name": "Foosball",
    "description": "High-quality foosball tables",
    "price_per_hour": 150,
    "first_booking_discount": 25,
    "created_at": "2024-01-25T10:30:00Z"
  }
]
```

---

## 📅 Bookings Endpoints

### 1. Create Booking

**Endpoint**: `POST /bookings`

**Frontend Code**:
```javascript
const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY,
  },
  body: JSON.stringify({
    user_id: 'uuid-user',
    venue_id: 'uuid-venue',
    game_id: 'uuid-game',
    booking_date: '2024-01-30',
    start_time: '09:00',
    end_time: '10:00',
    total_price: 125,
    discount_applied: 25,
    payment_status: 'pending',
    status: 'pending',
  }),
});
const booking = await response.json();
```

**Request Body**:
```json
{
  "user_id": "uuid-user",
  "venue_id": "uuid-venue",
  "game_id": "uuid-game",
  "booking_date": "2024-01-30",
  "start_time": "09:00",
  "end_time": "10:00",
  "total_price": 125,
  "discount_applied": 25,
  "payment_status": "pending",
  "status": "pending"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid-booking-123",
  "user_id": "uuid-user",
  "venue_id": "uuid-venue",
  "game_id": "uuid-game",
  "booking_date": "2024-01-30",
  "start_time": "09:00",
  "end_time": "10:00",
  "total_price": 125,
  "discount_applied": 25,
  "payment_status": "pending",
  "payment_id": null,
  "order_id": null,
  "status": "pending",
  "created_at": "2024-01-25T10:30:00Z"
}
```

**Error Response** (409 Conflict - Slot already booked):
```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint"
}
```

---

### 2. Get User's Bookings

**Endpoint**: `GET /bookings?user_id=eq.UUID&order=created_at.desc`

**Frontend Code**:
```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/bookings?user_id=eq.${userId}&order=created_at.desc`,
  {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
  }
);
const bookings = await response.json();
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid-booking-123",
    "user_id": "uuid-user",
    "venue_id": "uuid-venue",
    "game_id": "uuid-game",
    "booking_date": "2024-01-30",
    "start_time": "09:00",
    "end_time": "10:00",
    "total_price": 125,
    "discount_applied": 25,
    "payment_status": "completed",
    "payment_id": "pay_xxx",
    "order_id": "order_xxx",
    "status": "confirmed",
    "created_at": "2024-01-25T10:30:00Z"
  }
]
```

---

### 3. Get Available Slots

**Endpoint**: `GET /bookings?game_id=eq.UUID&booking_date=eq.2024-01-30&status=eq.confirmed`

**Frontend Code**:
```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/bookings?game_id=eq.${gameId}&booking_date=eq.${date}&status=eq.confirmed`,
  {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
  }
);
const bookedSlots = await response.json();
// Filter out booked times and show available ones
```

---

### 4. Update Booking Status

**Endpoint**: `PATCH /bookings?id=eq.UUID`

**Frontend Code**:
```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      status: 'cancelled',
      payment_status: 'refunded',
    }),
  }
);
const updated = await response.json();
```

---

## 💳 Backend Payment Endpoints

**Base URL**: `http://localhost:5000/api` (or your production URL)

All payment operations go through the Python backend.

---

### 1. Create Razorpay Order

**Endpoint**: `POST /razorpay/create-order`

**Request**:
```json
{
  "booking_id": "uuid-booking-123",
  "amount": 125
}
```

**Response** (201 Created):
```json
{
  "order_id": "order_1234567890",
  "amount": 125,
  "currency": "INR"
}
```

---

### 2. Verify Payment

**Endpoint**: `POST /razorpay/verify-payment`

**Request**:
```json
{
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_order_id": "order_1234567890",
  "razorpay_signature": "xxx",
  "booking_id": "uuid-booking-123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment verified and booking confirmed",
  "booking_id": "uuid-booking-123"
}
```

---

### 3. Cancel Booking

**Endpoint**: `POST /bookings/{booking_id}/cancel`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "refund_amount": 112.5
}
```

---

### 4. Submit Review

**Endpoint**: `POST /bookings/{booking_id}/review`

**Request**:
```json
{
  "rating": 5,
  "comment": "Amazing experience!",
  "photo_urls": ["https://..."]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "review_id": "uuid-review-123"
}
```

---

### 5. Get Admin Stats

**Endpoint**: `GET /admin/stats`

**Response** (200 OK):
```json
{
  "total_bookings": 45,
  "total_revenue": 5625.50,
  "today_bookings": 3,
  "today_revenue": 375.00,
  "pending_payments": 2
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,  -- Admin classification here
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Games Table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  name TEXT NOT NULL,
  description TEXT,
  price_per_hour INTEGER NOT NULL,
  first_booking_discount INTEGER DEFAULT 25,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  game_id UUID NOT NULL REFERENCES games(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  discount_applied INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  order_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(venue_id, game_id, booking_date, start_time)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  razorpay_payment_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 Query Examples

### Get all bookings for today
```sql
SELECT * FROM bookings 
WHERE booking_date = CURRENT_DATE 
ORDER BY start_time ASC;
```

### Calculate total revenue
```sql
SELECT SUM(total_price) as total_revenue 
FROM bookings 
WHERE payment_status = 'completed';
```

### Get admin users
```sql
SELECT id, name, email 
FROM users 
WHERE is_admin = true;
```

### Get available slots for tomorrow at 9 AM
```sql
SELECT * FROM games 
WHERE NOT EXISTS (
  SELECT 1 FROM bookings 
  WHERE games.id = bookings.game_id 
  AND bookings.booking_date = CURRENT_DATE + 1 
  AND bookings.start_time = '09:00'
  AND bookings.status = 'confirmed'
);
```

---

## 🚨 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Check authentication credentials |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate booking (slot already taken) |
| 500 | Server Error | Backend error - check logs |

---

## 📱 Frontend Integration Examples

### Complete Booking Flow

```javascript
// 1. Load games
const games = await fetch(`${SUPABASE_URL}/rest/v1/games?venue_id=eq.${venueId}`)
  .then(r => r.json());

// 2. User selects game and date
const selectedGame = games[0];
const selectedDate = '2024-01-30';

// 3. Check available slots
const bookedSlots = await fetch(
  `${SUPABASE_URL}/rest/v1/bookings?game_id=eq.${selectedGame.id}&booking_date=eq.${selectedDate}`
).then(r => r.json());

// 4. Create booking
const booking = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
  method: 'POST',
  headers: { /* headers */ },
  body: JSON.stringify({
    user_id: currentUser.id,
    venue_id: venueId,
    game_id: selectedGame.id,
    booking_date: selectedDate,
    start_time: '09:00',
    end_time: '10:00',
    total_price: 125,
    discount_applied: 25,
  })
}).then(r => r.json());

// 5. Process payment via backend
const payment = await paymentManager.initiatePayment(booking.id, 125);

// 6. Confirm booking (backend does this after payment verification)
```

---

## 🔒 Security Notes

1. **Anon Key**: Used by frontend - has limited permissions
2. **Service Role Key**: Used by backend - has full permissions
3. **Never share Service Role Key** in frontend code
4. **Use Row Level Security (RLS)** policies in Supabase
5. **Verify payments** on backend only

---

## 📞 Support

For API issues:
- Check browser console for errors
- Check backend logs
- Verify credentials are correct
- Ensure Supabase project is active

---

## ✅ Checklist

- [ ] Credentials updated in frontend
- [ ] Database tables created
- [ ] Backend running on correct port
- [ ] Admin user created
- [ ] Test booking created
- [ ] Payment verified
- [ ] Email notifications working
