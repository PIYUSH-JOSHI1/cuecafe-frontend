# ⚡ Cue Stories - Quick Start Guide (5 Minutes)

> Get up and running in 5 minutes or less!

---

## 📱 What You Get

A complete online booking system with:
- User signup/login
- Game booking with real-time slots
- Razorpay payments
- Admin dashboard
- Email notifications
- Mobile-responsive design

---

## 🎯 The 3-Step Process

### Step 1️⃣: Local Setup (2 minutes)

```bash
# Terminal 1: Frontend
cd cue-stories
python -m http.server 8000

# Terminal 2: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
# OR: venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

✅ Open http://localhost:8000 in browser

### Step 2️⃣: Get Credentials (2 minutes)

Create free accounts and get credentials:

1. **Supabase** (Database)
   - Go to [supabase.com](https://supabase.com)
   - Create project
   - Copy: Project URL + Anon Key

2. **Razorpay** (Payments)
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up
   - Go to Settings → API Keys
   - Copy: Key ID + Key Secret (Test Keys)

3. **Gmail** (Emails)
   - Enable 2FA on your Gmail
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select Mail + Computer
   - Copy the 16-char password

### Step 3️⃣: Configure & Test (1 minute)

#### Update Frontend
Edit `/js/auth.js` line 1-2:
```javascript
const SUPABASE_URL = 'your_supabase_url';
const SUPABASE_ANON_KEY = 'your_anon_key';
```

Edit `/js/booking.js` line 1-2 (same values)

#### Setup Backend
In `/backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxx
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

#### Create Database
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Copy entire content from `/scripts/setup-database.sql`
4. Click Run

#### Test the App
1. Open http://localhost:8000
2. Click Login → Sign Up
3. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
4. Select Snooker game
5. Pick date & time
6. Pay with test card: `4111 1111 1111 1111` + any future date + any 3 digits for CVV
7. ✅ See confirmation!

---

## 👤 Create Admin User

1. Go to [app.supabase.com](https://app.supabase.com)
2. Your Project → Table Editor → **users**
3. Find your test user
4. Click to edit
5. Set `is_admin = true`
6. Save
7. Visit http://localhost:8000/pages/admin.html
8. ✅ See admin dashboard!

---

## 🚀 Deploy to Production (Optional)

### Frontend to Netlify (2 minutes)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repo
5. Deploy!
6. ✅ Live at https://your-site.netlify.app

### Backend to Render (2 minutes)
1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Select GitHub repo (backend folder)
4. Add Environment Variables (from .env)
5. Deploy!
6. ✅ Live at https://your-api.onrender.com

### Update Frontend URL
In `/js/payment.js` line 7:
```javascript
const API_BASE_URL = 'https://your-api.onrender.com/api';
```

---

## 📋 File Reference

### Read These First
| File | Purpose | Read Time |
|------|---------|-----------|
| **LOCAL_SETUP.md** | Detailed local setup | 10 min |
| **ADMIN_SETUP.md** | Admin vs User guide | 5 min |
| **DEPLOYMENT_GUIDE.md** | Production deployment | 10 min |

### API Reference
- **API_REFERENCE.md** - Complete API endpoints

### Documentation
- **README_COMPLETE.md** - Full project overview
- **README.md** - Original readme

---

## 🎮 Test Scenarios

### Scenario 1: User Books a Slot
```
1. Open http://localhost:8000
2. Login (or signup first)
3. Click Booking
4. Select "Snooker"
5. Pick "Today"
6. Pick "9:00 AM"
7. Review booking
8. Pay with: 4111 1111 1111 1111
9. ✅ See confirmation!
```

### Scenario 2: Admin Views Revenue
```
1. Make yourself admin (see "Create Admin User" above)
2. Go to http://localhost:8000/pages/admin.html
3. ✅ See all bookings & revenue
```

### Scenario 3: Cancel Booking
```
1. Go to Profile (after login)
2. Click "Cancel" on a booking
3. ✅ Booking cancelled, refund calculated
```

---

## ✅ Quick Checklist

- [ ] Frontend running on localhost:8000
- [ ] Backend running on localhost:5000
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Can signup/login
- [ ] Can book a slot
- [ ] Can pay with test card
- [ ] Email received
- [ ] Admin account created
- [ ] Admin dashboard works

---

## 🔑 Important Credentials (Save These!)

```
SUPABASE_URL: https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_ANON_KEY: [Your Key]
SUPABASE_SERVICE_ROLE_KEY: [Your Key]

RAZORPAY_KEY_ID: rzp_test_xxxxxx
RAZORPAY_KEY_SECRET: [Your Key]

EMAIL: your_email@gmail.com
EMAIL_PASSWORD: [Your 16-char app password]
```

---

## 🆘 Stuck?

### "Can't login"
→ Check Supabase credentials in `/js/auth.js`

### "Payment not working"
→ Backend not running? Check backend/app.py is running

### "Email not sending"
→ Gmail app password wrong? Regenerate it

### "Admin page blank"
→ Did you set `is_admin = true` in Supabase?

### "Can't find database tables"
→ Did you run `/scripts/setup-database.sql`?

---

## 📞 Need Help?

1. Check **LOCAL_SETUP.md** - Troubleshooting section
2. Check **DEPLOYMENT_GUIDE.md** - FAQ section
3. Check browser console (F12) for errors
4. Check backend terminal for logs

---

## 🎯 What's Next?

### After Testing Locally
1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to Render
3. ✅ Update Razorpay to Live Keys
4. ✅ Setup custom domain
5. ✅ Monitor in production

---

## 📚 Full Documentation

**Start with these in order:**

1. 📖 [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Run locally first
2. 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Then deploy
3. 🔑 [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Create admin users
4. 📚 [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints

---

## 🎉 You're Ready!

You now have a complete booking system.

**Next Step**: Open [LOCAL_SETUP.md](./LOCAL_SETUP.md) and follow the detailed guide.

---

Happy Booking! 🎱✨

Questions? Check the full docs above or email: admin@cuestories.com
