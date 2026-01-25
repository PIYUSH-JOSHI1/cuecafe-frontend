# 🏗️ Cue Stories - System Architecture

## 📐 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERNET / USERS                              │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/HTTPS
             │
    ┌────────▼─────────────────────────────────────┐
    │         FRONTEND (Netlify)                    │
    │    HTML/CSS/JavaScript                       │
    │  ✅ No frameworks (vanilla JS)               │
    │  ✅ Bootstrap 5 + Custom CSS                 │
    │  ✅ Responsive (Mobile/Desktop)              │
    └────────┬─────────────────┬────────────────────┘
             │                 │
         API │                 │ Direct API
        Calls│                 │ Calls
             │                 │
    ┌────────▼──────┐    ┌────▼──────────────────┐
    │  BACKEND      │    │  SUPABASE             │
    │ (Render.com)  │    │  (Database)           │
    │               │    │                       │
    │  Python Flask │    │  PostgreSQL           │
    │  - Payments   │    │  - Users (is_admin)   │
    │  - Emails     │    │  - Bookings           │
    │  - Stats      │    │  - Payments           │
    │  - Admin Ops  │    │  - Reviews            │
    └────────┬──────┘    │  - Notifications      │
             │           │  - Games              │
    ┌────────┼───────────┤  - Venues             │
    │        │           └──────────────────────┘
    │    REST API
    │        │
    ├────────┘
    │
    ├─→ Razorpay API (Payment Processing)
    │
    └─→ Gmail SMTP (Email Notifications)
```

---

## 🔄 User Journey Flow

### New User Sign-Up

```
┌──────────────────┐
│  User arrives at │
│   homepage       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Clicks "Login" button    │
│ Goes to /pages/login.html│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Clicks "Sign Up" tab     │
│ Fills signup form        │
│ - Name                   │
│ - Email                  │
│ - Phone                  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Frontend validates       │
│ (email, phone format)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /users to Supabase  │
│ (via REST API)           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ User stored in database  │
│ is_admin = false         │
│ created_at timestamp     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirect to /booking.html│
│ User now logged in       │
└──────────────────────────┘
```

### Booking Slot

```
┌──────────────────┐
│ User logged in   │
│ at /booking.html │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ STEP 1: Select Game      │
│ - Snooker                │
│ - Foosball               │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ GET /games (Supabase)    │
│ Load games from DB       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ STEP 2: Pick Date & Time │
│ - Select date            │
│ - See available slots    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ GET /bookings (Supabase)     │
│ Find booked slots for that   │
│ date/game to show available  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ STEP 3: Confirm Booking  │
│ Review details:          │
│ - Game                   │
│ - Date                   │
│ - Time                   │
│ - Price                  │
│ - Discount               │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ STEP 4: Payment          │
│ Click "Pay with Razorpay"│
└────────┬─────────────────┘
         │
         ▼
    [See Payment Flow below]
```

### Payment Processing

```
┌──────────────────────────┐
│ Frontend:                │
│ paymentManager.          │
│ initiatePayment()        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Backend:                         │
│ POST /api/razorpay/create-order  │
│ - booking_id                     │
│ - amount (in rupees)             │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Backend creates Razorpay order   │
│ Returns: order_id                │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Frontend: Open Razorpay popup    │
│ - Show test card form            │
│ - User enters card details       │
│ - User clicks "Pay"              │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Razorpay:                        │
│ - Processes payment              │
│ - Returns: razorpay_payment_id   │
│            razorpay_signature    │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Frontend:                        │
│ POST /api/razorpay/verify-payment│
│ - payment_id                     │
│ - order_id                       │
│ - signature                      │
│ - booking_id                     │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Backend:                         │
│ 1. Verify Razorpay signature     │
│ 2. Update booking:               │
│    - payment_status = "completed"│
│    - status = "confirmed"        │
│ 3. Create payment record         │
│ 4. Create notification           │
│ 5. Send confirmation email       │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User:                            │
│ 📧 Receives confirmation email   │
│ ✅ Booking confirmed             │
│ 📍 Redirected to profile         │
└──────────────────────────────────┘
```

### Admin Operations

```
┌──────────────────────────────┐
│ Admin (is_admin = true)      │
│ Visits /pages/admin.html     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Frontend checks:             │
│ if user.is_admin == true?    │
└────────┬─────────────────────┘
         │
    YES▼ │ NO
       │ └─→ Redirect to /index.html
       │
       ▼
┌──────────────────────────────┐
│ Admin Dashboard Loaded       │
│ Options:                     │
│ 1. View all bookings         │
│ 2. View revenue              │
│ 3. Manage slots              │
│ 4. Update pricing            │
│ 5. View customers            │
└──────────────────────────────┘
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────────┐
│      VENUES         │
│                     │
│ id (PK)             │
│ name: "Cue Stories" │
│ email               │
│ phone               │
│ location            │
└─────────────────────┘
        │
        │ 1:N
        │
┌───────▼──────────────────┐     ┌─────────────────────┐
│      GAMES               │     │      USERS          │
│                          │     │                     │
│ id (PK)                  │     │ id (PK)             │
│ venue_id (FK) ─────┬─────┼──→  │ email (UNIQUE)      │
│ name: Snooker     │    │     │ phone (UNIQUE)      │
│ price_per_hour    │    │     │ name                │
│ first_booking...  │    │     │ is_admin ⭐         │
└───────┬────────────┘    │     └─────────────────────┘
        │                 │
        │ 1:N             │
        │                 │ 1:N
        │                 │
┌───────▼──────────────────┐     │
│      BOOKINGS            │     │
│                          │     │
│ id (PK)                  │◄────┘
│ user_id (FK) ────────────┘
│ venue_id (FK) ────────────┐
│ game_id (FK) ─────────────┤
│ booking_date              │
│ start_time                │
│ end_time                  │
│ total_price               │
│ discount_applied          │
│ payment_status            │
│ status                    │
│ UNIQUE(venue, game, date, time)
└───────┬────────┬──────────┘
        │        │
        │ 1:N    │ 1:N
        │        │
┌───────▼──┐  ┌──▼──────────────┐
│ PAYMENTS │  │    REVIEWS      │
│          │  │                 │
│ id (PK)  │  │ id (PK)         │
│ booking..│  │ booking_id (FK) │
│ razorpay │  │ user_id (FK)    │
│ amount   │  │ rating (1-5)    │
│ status   │  │ comment         │
└──────────┘  │ photo_urls[]    │
              └─────────────────┘

NOTIFICATIONS     BLOCKED_SLOTS
└─ user_id       └─ venue_id
└─ booking_id    └─ game_id
└─ type          └─ blocked_date
└─ message       └─ start_time
                 └─ end_time
```

---

## 🌐 API Architecture

### Frontend → Supabase (Direct)
```
Frontend JS
    │
    ├─→ POST /rest/v1/users           (Signup)
    ├─→ GET /rest/v1/users?email=...  (Login)
    ├─→ GET /rest/v1/games?venue...   (Load games)
    ├─→ POST /rest/v1/bookings        (Create booking)
    ├─→ GET /rest/v1/bookings?user... (Fetch bookings)
    └─→ PATCH /rest/v1/bookings       (Update booking)
    
All with headers:
- Authorization: Bearer SUPABASE_ANON_KEY
- apikey: SUPABASE_ANON_KEY
```

### Frontend → Backend → Razorpay
```
Frontend JS
    │
    ├─→ POST /api/razorpay/create-order
    │   ├─→ Backend → Razorpay API
    │   └─→ Returns order_id
    │
    └─→ POST /api/razorpay/verify-payment
        ├─→ Backend → Razorpay API (verify)
        ├─→ Backend → Supabase (update booking)
        ├─→ Backend → Gmail SMTP (send email)
        └─→ Returns success/failure
```

### Backend Operations
```
Backend (Flask)
    │
    ├─→ POST /api/razorpay/create-order
    │   └─→ Razorpay Client → Create Order
    │
    ├─→ POST /api/razorpay/verify-payment
    │   ├─→ Razorpay Client → Verify Signature
    │   ├─→ Supabase Client → Update booking
    │   ├─→ Supabase Client → Create payment record
    │   ├─→ Gmail SMTP → Send email
    │   └─→ Supabase Client → Create notification
    │
    ├─→ POST /api/bookings/{id}/cancel
    │   ├─→ Supabase → Update booking status
    │   └─→ Gmail SMTP → Send cancellation email
    │
    ├─→ POST /api/bookings/{id}/review
    │   └─→ Supabase → Insert review record
    │
    └─→ GET /api/admin/stats
        └─→ Supabase → Query bookings, calculate stats
```

---

## 🔐 Authentication Flow

```
LOGIN FLOW:
━━━━━━━━━━━

User enters email/phone
         │
         ▼
Frontend validates format
         │
         ▼
GET /users?email=xyz
(or ?phone=xyz)
         │
         ▼
Supabase returns user row
         │
         ▼
Frontend stores in localStorage:
{
  id: uuid,
  name: "...",
  email: "...",
  is_admin: false/true ⭐
}
         │
         ▼
User is "logged in"
Session persists in browser


LOGOUT FLOW:
━━━━━━━━━━━

User clicks logout
         │
         ▼
Frontend clears localStorage
         │
         ▼
Redirect to /index.html
         │
         ▼
User is logged out
```

---

## 💾 Data Persistence

```
FRONTEND (Browser)
└─ localStorage
   └─ cueStories_user
      ├─ id
      ├─ name
      ├─ email
      ├─ phone
      └─ is_admin

BACKEND (Python)
└─ Environment Variables (.env)
   ├─ SUPABASE credentials
   ├─ RAZORPAY credentials
   ├─ EMAIL credentials
   └─ FLASK settings

DATABASE (Supabase PostgreSQL)
└─ All persistent data
   ├─ users
   ├─ bookings
   ├─ payments
   ├─ reviews
   └─ notifications
```

---

## 🔄 Environment Variables Flow

```
DEPLOYMENT ENVIRONMENTS:

LOCAL (Development)
└─ /backend/.env
   ├─ SUPABASE_URL: http://localhost
   ├─ SUPABASE_KEY: dev_key
   ├─ RAZORPAY_KEY_ID: rzp_test_xxx
   ├─ EMAIL_PASSWORD: app_password
   └─ FLASK_ENV: development

PRODUCTION (Render)
└─ Environment Variables (Render Dashboard)
   ├─ SUPABASE_URL: https://...
   ├─ SUPABASE_KEY: prod_key
   ├─ RAZORPAY_KEY_ID: rzp_live_xxx
   ├─ EMAIL_PASSWORD: app_password
   └─ FLASK_ENV: production
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
│                                                           │
│ ┌───────────────────┐    ┌──────────────────────────┐   │
│ │   Netlify         │    │   Render.com             │   │
│ │                   │    │                          │   │
│ │ ✅ Frontend       │    │ ✅ Backend (Python)      │   │
│ │ - index.html      │    │ - Flask app.py           │   │
│ │ - pages/*         │    │ - Gunicorn server        │   │
│ │ - js/*            │    │ - Environment vars       │   │
│ │ - styles/*        │    │                          │   │
│ │                   │    │                          │   │
│ │ Domain:           │    │ Domain:                  │   │
│ │ booking.cuestories│    │ api.cuestories.com       │   │
│ └─────────┬─────────┘    └──────────┬───────────────┘   │
│           │                         │                    │
│           │ API Calls               │ Database Access    │
│           │                         │                    │
│           └────────────┬────────────┘                    │
│                        │                                 │
│              ┌─────────▼──────────┐                      │
│              │  Supabase          │                      │
│              │                    │                      │
│              │ ✅ PostgreSQL DB   │                      │
│              │ ✅ Auth            │                      │
│              │ ✅ Real-time API   │                      │
│              │                    │                      │
│              │ Domain:            │                      │
│              │ ...supabase.co     │                      │
│              └────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 System Capabilities Matrix

| Feature | Frontend | Backend | Database |
|---------|----------|---------|----------|
| User signup | ✅ | - | ✅ |
| User login | ✅ | - | ✅ |
| Game selection | ✅ | - | - |
| Slot availability | ✅ | - | ✅ |
| Create booking | ✅ | - | ✅ |
| Razorpay order | - | ✅ | - |
| Verify payment | - | ✅ | ✅ |
| Send email | - | ✅ | - |
| Admin dashboard | ✅ | ✅ | ✅ |
| Cancel booking | ✅ | ✅ | ✅ |
| View stats | - | ✅ | ✅ |

---

## 🔗 Integration Points

**3 External APIs:**

1. **Razorpay**
   - Purpose: Payment processing
   - Called by: Backend
   - Used for: Creating orders, verifying signatures

2. **Gmail SMTP**
   - Purpose: Email notifications
   - Called by: Backend
   - Used for: Sending confirmations, cancellations

3. **Supabase REST API**
   - Purpose: Database operations
   - Called by: Frontend & Backend
   - Used for: CRUD operations on all tables

---

This architecture provides a complete, scalable, production-ready booking system! 🚀
