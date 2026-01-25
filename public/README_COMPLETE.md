# 🎱 Cue Stories - Premium Snooker & Foosball Booking System

> A complete, production-ready online booking platform for Cue Stories venue with integrated payments, notifications, and admin dashboard.

---

## 📑 Table of Contents

1. [Quick Overview](#quick-overview)
2. [What's Included](#whats-included)
3. [Getting Started](#getting-started)
4. [Documentation](#documentation)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [Deployment](#deployment)

---

## 🎯 Quick Overview

**Cue Stories Booking System** is a complete web application that allows:
- ✅ Users to book snooker and foosball slots online
- ✅ Online payment processing via Razorpay
- ✅ Email notifications for confirmations
- ✅ Admin dashboard for revenue and slot management
- ✅ User reviews and ratings with photos
- ✅ Real-time slot availability

**Frontend**: HTML/CSS/JavaScript (Deploy on Netlify)
**Backend**: Python Flask (Deploy on Render)
**Database**: Supabase PostgreSQL

---

## 📦 What's Included

### Frontend Pages (7 files)
```
├── index.html               # Homepage & venue info
├── pages/login.html        # User authentication
├── pages/booking.html      # 4-step booking wizard
├── pages/profile.html      # User dashboard & history
├── pages/pricing.html      # Pricing & FAQs
├── pages/policies.html     # Cancellation & policies
└── pages/admin.html        # Admin control panel
```

### JavaScript Modules (4 files)
```
├── js/auth.js              # User authentication logic
├── js/booking.js           # Slot management & availability
├── js/payment.js           # Razorpay integration
└── js/main.js              # Utility functions
```

### Backend (Python)
```
├── backend/app.py          # Flask API server (200+ lines)
├── backend/requirements.txt # Dependencies
└── backend/.env.example    # Environment template
```

### Database
```
└── scripts/setup-database.sql  # Complete schema (8 tables)
```

### Documentation (6 files)
```
├── DEPLOYMENT_GUIDE.md     # Production deployment steps
├── LOCAL_SETUP.md          # Local development setup
├── API_REFERENCE.md        # Complete API documentation
├── ADMIN_SETUP.md          # Admin user classification
├── README_COMPLETE.md      # This file
└── README.md               # Original README
```

---

## 🚀 Getting Started

### For Local Development (5 minutes)

```bash
# 1. Clone repository
git clone <repo-url>
cd cue-stories

# 2. Start frontend server
python -m http.server 8000

# 3. In another terminal, start backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

# 4. Open browser
# http://localhost:8000
```

**Next Step**: [Read LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed instructions

---

### For Production Deployment

#### Frontend to Netlify
1. Push code to GitHub
2. Connect repo to Netlify
3. Automatic deployment on git push
4. Custom domain setup (optional)

#### Backend to Render
1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Add environment variables
4. Automatic deployment

**Next Step**: [Read DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [LOCAL_SETUP.md](./LOCAL_SETUP.md) | ⭐ Start here - Run locally first |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Deploy to Netlify & Render |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation |
| [ADMIN_SETUP.md](./ADMIN_SETUP.md) | Admin vs User classification |

---

## ✨ Features

### User Features
- 📝 Sign up with email/phone
- 🎮 Select from 2 games (Snooker & Foosball)
- 📅 Pick date and available time slots
- 💳 Secure Razorpay payment
- 📧 Email confirmation
- 📜 View booking history
- ⭐ Submit reviews with photos
- 🔔 Real-time notifications
- 📱 Fully responsive design

### Admin Features
- 📊 View all bookings (not just own)
- 💰 Track revenue (daily/monthly/yearly)
- 🔒 Manage time slots (block/unblock)
- 💲 Update game pricing
- 👥 Manage customer details
- 📈 Analytics & reports
- ⚙️ Venue settings management

### System Features
- ✅ Real-time slot availability
- ✅ Automatic slot conflict prevention
- ✅ First-booking discount (₹25)
- ✅ Cancellation policy (10% fee if <24hrs)
- ✅ Email notifications via Gmail
- ✅ Secure payment processing
- ✅ Database backups (Supabase)

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Tailwind + Bootstrap 5
- **JavaScript (Vanilla)** - No frameworks
- **Razorpay SDK** - Payment processing
- **Supabase JS** - REST API calls

### Backend
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **Supabase** - Database & auth
- **Razorpay** - Payment gateway
- **Gmail SMTP** - Email notifications

### Database
- **PostgreSQL** (Supabase) - Relational database
- **Row Level Security** - Data protection
- **Automated backups** - Data safety

### Deployment
- **Netlify** - Frontend hosting
- **Render.com** - Backend hosting
- **Supabase** - Database hosting

---

## 🔑 Key Credentials Needed

### Supabase
```
SUPABASE_URL = https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Razorpay
```
RAZORPAY_KEY_ID = rzp_test_xxxxxx
RAZORPAY_KEY_SECRET = xxxxxxxx
```

### Gmail
```
EMAIL_SENDER = your_email@gmail.com
EMAIL_PASSWORD = xxxx xxxx xxxx xxxx  (App password)
```

Get all credentials from respective dashboards (see [LOCAL_SETUP.md](./LOCAL_SETUP.md))

---

## 📋 Project Structure

```
cue-stories/
├── index.html                   # Homepage
├── pages/                       # 6 user pages + admin
├── js/                          # 4 JavaScript modules
├── styles/                      # CSS styling
├── scripts/                     # Database schema
├── backend/                     # Python backend
│   ├── app.py                  # Flask API
│   ├── requirements.txt        # Dependencies
│   └── .env.example           # Config template
├── DEPLOYMENT_GUIDE.md         # Production guide
├── LOCAL_SETUP.md             # Development guide
├── API_REFERENCE.md           # API documentation
├── ADMIN_SETUP.md             # Admin guide
└── README_COMPLETE.md         # This file
```

---

## 🔐 Admin vs User Classification

### How It Works

**In Database**: Each user has `is_admin` boolean field
```sql
-- Regular user
UPDATE users SET is_admin = false WHERE email = 'user@example.com';

-- Admin user
UPDATE users SET is_admin = true WHERE email = 'owner@cuestories.com';
```

**In Frontend**: Checked during page load
```javascript
if (!user.is_admin) {
  redirect_to_home();
}
```

### Admin Setup

1. Create account normally via signup
2. Go to Supabase → Table Editor → Users
3. Find your user and set `is_admin = true`
4. Visit `/pages/admin.html`

**Detailed Guide**: [Read ADMIN_SETUP.md](./ADMIN_SETUP.md)

---

## 💳 Payment Flow

```
1. User selects game, date, time
   ↓
2. Backend creates Razorpay order
   ↓
3. Razorpay payment popup opens
   ↓
4. User pays (test card: 4111 1111 1111 1111)
   ↓
5. Backend verifies signature
   ↓
6. Booking confirmed in database
   ↓
7. Email notification sent to user
   ↓
8. User redirected to profile
```

---

## 📧 Email Notifications

Sent for:
- ✅ Booking confirmation
- ✅ Booking cancellation
- ✅ Payment success/failure

Uses Gmail SMTP (requires app password)

---

## 🧪 Testing Checklist

### Local Development
- [ ] Frontend loads on localhost:8000
- [ ] Can signup/login
- [ ] Can select game
- [ ] Can pick date & time slot
- [ ] Payment popup opens
- [ ] Can test payment with card 4111 1111 1111 1111
- [ ] Booking appears in profile
- [ ] Confirmation email received
- [ ] Admin dashboard accessible
- [ ] All console logs clean

### Before Production
- [ ] All environment variables set
- [ ] Razorpay switched to Live Keys
- [ ] Email notifications working
- [ ] Database has test data
- [ ] Admin account created
- [ ] Custom domain configured
- [ ] SSL certificate active

---

## 🚀 Deployment Steps (Quick Reference)

### Frontend to Netlify
1. Push to GitHub
2. Connect repo to Netlify
3. Done! Auto-deploys on push

### Backend to Render
1. Push backend folder to GitHub
2. Create Web Service on Render
3. Add environment variables
4. Done! Auto-deploys on push

**Detailed Steps**: [Read DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🐛 Common Issues & Solutions

### "Can't login"
- ✅ Check Supabase credentials in `/js/auth.js`
- ✅ Verify user exists in Supabase users table
- ✅ Check browser console for errors

### "Payment not working"
- ✅ Verify backend is running
- ✅ Check Razorpay credentials
- ✅ Check network tab for API errors

### "Email not sending"
- ✅ Check Gmail app password is correct
- ✅ Verify 2FA enabled on Gmail
- ✅ Check email in spam folder

### "Admin page redirects to home"
- ✅ Verify `is_admin = true` in Supabase
- ✅ Refresh page after changing in database
- ✅ Clear browser cache

---

## 📞 Support Resources

| Resource | Link |
|----------|------|
| Supabase Docs | https://supabase.com/docs |
| Razorpay Docs | https://razorpay.com/docs |
| Bootstrap Docs | https://getbootstrap.com/docs |
| Netlify Docs | https://docs.netlify.com |
| Render Docs | https://render.com/docs |

---

## 🎯 Next Steps

### 1. Local Testing (First)
```bash
# Read LOCAL_SETUP.md and run everything locally
# Make sure everything works before deploying
```

### 2. Get Credentials
```bash
# Create accounts and get:
# - Supabase (database)
# - Razorpay (payments)
# - Gmail App Password (emails)
```

### 3. Deploy Frontend
```bash
# Push to GitHub
# Connect to Netlify
# Get live URL
```

### 4. Deploy Backend
```bash
# Push backend folder
# Create Render service
# Set environment variables
# Get API URL
```

### 5. Update Credentials
```bash
# Update frontend with production backend URL
# Switch Razorpay to Live Keys
# Test complete flow
```

---

## 📊 System Stats

- **7 Frontend Pages**
- **4 JavaScript Modules**
- **8 Database Tables**
- **200+ Lines Backend Code**
- **1000+ Lines Documentation**
- **15+ API Endpoints**
- **2 User Types** (Admin & User)
- **100% Responsive** (Mobile & Desktop)

---

## ✅ Completion Checklist

- [ ] Reviewed all documentation
- [ ] Setup Supabase project
- [ ] Setup Razorpay account
- [ ] Setup Gmail app password
- [ ] Ran locally successfully
- [ ] Created admin account
- [ ] Tested booking flow
- [ ] Tested payment (test mode)
- [ ] Received confirmation email
- [ ] Deployed frontend to Netlify
- [ ] Deployed backend to Render
- [ ] Switched Razorpay to Live mode
- [ ] Tested in production
- [ ] Setup custom domain
- [ ] Shared with team

---

## 🎉 You're All Set!

Congratulations! You now have a complete, production-ready booking system for Cue Stories.

### Quick Links
- 📖 [Start with LOCAL_SETUP.md](./LOCAL_SETUP.md)
- 🚀 [Then read DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🔑 [Setup admin with ADMIN_SETUP.md](./ADMIN_SETUP.md)
- 📚 [API docs in API_REFERENCE.md](./API_REFERENCE.md)

---

## 📄 License

© 2024 Cue Stories. All rights reserved.

For support or issues: admin@cuestories.com | Phone: 8408068388

---

**Happy Booking! 🎱✨**
