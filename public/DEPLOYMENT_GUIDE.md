# Cue Stories Booking System - Complete Deployment Guide

## 📋 Overview

This is a complete booking system for **Cue Stories** venue with the following architecture:

- **Frontend**: HTML/CSS/JavaScript (Deploy on Netlify)
- **Backend**: Python Flask (Deploy on Render.com)
- **Database**: Supabase PostgreSQL
- **Payments**: Razorpay Integration
- **Email**: Gmail SMTP

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Netlify)                │
│        HTML/CSS/JavaScript - User Interface         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├─── REST API Calls
                   │
┌──────────────────▼──────────────────────────────────┐
│               Backend (Render.com)                   │
│  Python Flask - Payments, Email, Admin Operations   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├─── Database Operations
                   │
┌──────────────────▼──────────────────────────────────┐
│              Database (Supabase)                     │
│    PostgreSQL - Users, Bookings, Payments, etc.     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
cue-stories/
├── index.html                 # Homepage
├── pages/
│   ├── login.html            # Authentication page
│   ├── booking.html          # 4-step booking wizard
│   ├── pricing.html          # Pricing and FAQs
│   ├── policies.html         # Cancellation policies
│   ├── profile.html          # User profile & history
│   └── admin.html            # Admin dashboard
├── js/
│   ├── auth.js               # Authentication logic
│   ├── booking.js            # Booking & slot management
│   ├── payment.js            # Razorpay integration
│   └── main.js               # Utility functions
├── styles/
│   └── main.css              # Global styles
├── scripts/
│   └── setup-database.sql    # Database schema
└── backend/
    ├── app.py                # Flask API server
    ├── requirements.txt      # Python dependencies
    └── .env.example          # Environment variables template
```

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ (for local testing)
- Python 3.8+
- Git
- Supabase account
- Razorpay account
- Gmail account (for email notifications)

### Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your **Project URL** and **Anon Key** from Settings → API
3. Run the database setup script:
   ```sql
   -- Copy content from /scripts/setup-database.sql
   -- Paste into Supabase SQL Editor and execute
   ```

4. Update your credentials in the frontend files:
   - `/js/auth.js` (lines 1-2)
   - `/js/booking.js` (lines 1-2)

### Step 2: Setup Frontend Locally

```bash
# Clone repository
git clone <your-repo>
cd cue-stories

# Install dependencies (if using a bundler)
npm install

# Start local server
python -m http.server 8000

# Open http://localhost:8000 in browser
```

### Step 3: Setup Python Backend Locally

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
cp .env.example .env

# Edit .env with your actual credentials
# SUPABASE_URL, SUPABASE_KEY, RAZORPAY credentials, Gmail details

# Run the app
python app.py

# App will run on http://localhost:5000
```

### Step 4: Get Razorpay Credentials

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Login/Signup
3. Navigate to **Settings → API Keys**
4. Copy **Key ID** and **Key Secret**
5. Add to backend `.env` file:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### Step 5: Setup Gmail for Email Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select **Mail** and **Windows Computer**
4. Copy the generated app password
5. Add to backend `.env` file:
   ```
   EMAIL_SENDER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

---

## 🌐 Deployment to Production

### Deploy Frontend to Netlify

#### Method 1: Using Netlify UI

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag and drop your project folder
5. Your site will be live with URL like: `https://your-site.netlify.app`

#### Method 2: Using Git Integration

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **"New site from Git"**
4. Connect your GitHub repository
5. Build settings:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root)
6. Click **Deploy**
7. Set environment variables in Netlify:
   - Netlify Dashboard → Site Settings → Build & Deploy → Environment
   - Add any environment-specific variables if needed

#### Configure Custom Domain (Optional)

1. In Netlify Dashboard → Site Settings → Domain Management
2. Add custom domain (e.g., `booking.cuestories.com`)
3. Follow DNS configuration steps

---

### Deploy Backend to Render.com

#### Step 1: Prepare Your Repository

```bash
# Make sure you have .env.example in backend folder
# Commit changes
git add .
git commit -m "Prepare for deployment"
git push
```

#### Step 2: Create Render Service

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository
5. Configure:
   - **Name**: `cue-stories-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Region**: Choose closest to your users

#### Step 3: Add Environment Variables

In Render Dashboard → Your Service → Environment:

```
SUPABASE_URL=https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_KEY=your_actual_supabase_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FLASK_ENV=production
PORT=5000
```

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy
3. Get your API URL: `https://your-service.onrender.com`

#### Update Frontend with Backend URL

Update the payment API calls in `/js/payment.js`:

```javascript
const API_BASE_URL = 'https://your-service.onrender.com/api';
```

---

## 🔑 Environment Variables Reference

### Frontend (.env or hardcoded in JS files)
```
SUPABASE_URL=https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (.env file)
```
SUPABASE_URL=https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_KEY=your_service_role_key
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxx
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FLASK_ENV=production
PORT=5000
```

---

## 🔐 Admin vs User Classification

### In Supabase Database

The `users` table has an `is_admin` boolean field:

```sql
-- Make a user admin (in Supabase SQL Editor)
UPDATE users SET is_admin = true WHERE email = 'owner@cuestories.com';

-- Check admin status
SELECT * FROM users WHERE is_admin = true;
```

### In Frontend

Admin access is checked in `/pages/admin.html`:

```javascript
// Check if current user is admin
if (!authManager.getCurrentUser().is_admin) {
  window.location.href = '/index.html';
}
```

### Admin Features
- View all bookings
- View revenue (daily/monthly)
- Manage time slots (block/unblock)
- Update pricing
- Manage customer details

---

## 💰 Razorpay Integration

### Payment Flow

1. User selects game, date, time
2. Frontend sends booking details to backend
3. Backend creates Razorpay order
4. Razorpay payment popup opens
5. User pays
6. Razorpay returns payment details
7. Backend verifies signature
8. Booking confirmed
9. Email notification sent

### Testing Razorpay

Use test credentials from Razorpay dashboard:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits

---

## 📧 Email Notifications

### When Emails are Sent

1. **Booking Confirmation** - After successful payment
2. **Booking Cancellation** - When user cancels booking
3. **Reminder Emails** - 24 hours before booking (optional - can be added)

### Email Templates

Located in `/backend/app.py`:
- `send_email()` function
- Customizable HTML templates

---

## 🐛 Troubleshooting

### Issue: Login not working

**Solution**: 
- Check Supabase URL and Key are correct in `/js/auth.js`
- Verify Supabase project is active
- Check browser console for errors

### Issue: Payment not going through

**Solution**:
- Verify Razorpay credentials in backend `.env`
- Check backend is running and accessible
- Check network tab in browser developer tools
- Verify Razorpay account is activated

### Issue: Emails not sending

**Solution**:
- Verify Gmail 2FA is enabled
- Check App Password is correctly generated
- Ensure SMTP credentials are correct in `.env`
- Check spam folder

### Issue: Slots not showing available

**Solution**:
- Verify database setup script was executed
- Check date format is correct (YYYY-MM-DD)
- Verify games are created in database

---

## 📞 API Endpoints (Backend)

### Health Check
```
GET /api/health
```

### Create Razorpay Order
```
POST /api/razorpay/create-order
Body: {
  "booking_id": "uuid",
  "amount": 125  // in rupees
}
```

### Verify Payment
```
POST /api/razorpay/verify-payment
Body: {
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "xxx",
  "booking_id": "uuid"
}
```

### Cancel Booking
```
POST /api/bookings/{booking_id}/cancel
```

### Submit Review
```
POST /api/bookings/{booking_id}/review
Body: {
  "rating": 5,
  "comment": "Great experience!",
  "photo_urls": []
}
```

### Admin Stats
```
GET /api/admin/stats
```

---

## 🔄 Continuous Deployment

### For Netlify (Frontend)

Automatic deployment on git push:
1. Connect GitHub repo
2. Every push to main branch deploys automatically
3. Preview deployments for pull requests

### For Render (Backend)

Automatic deployment on git push:
1. Service auto-redeploys when GitHub repo updates
2. Check deployment logs in Render dashboard

---

## 📊 Database Backup

### Backup with Supabase

1. Dashboard → Backups
2. Create manual backup
3. Scheduled backups run daily (Free plan)
4. Restore from backup if needed

---

## 🎯 Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to Render
3. ✅ Test payment flow in test mode
4. ✅ Setup email notifications
5. ✅ Create admin account
6. ✅ Configure custom domain
7. ✅ Monitor analytics
8. ✅ Collect user feedback

---

## 📞 Support

For issues or questions:
- Email: admin@cuestories.com
- Phone: 8408068388
- GitHub Issues: Create an issue in repository

---

## 📄 License

© 2024 Cue Stories. All rights reserved.
