# Cue Stories - Local Development Setup Guide

## 🖥️ Run Locally Before Deployment

This guide helps you run the entire Cue Stories booking system on your local machine.

---

## 📋 Prerequisites

Make sure you have these installed:

1. **Python 3.8+**
   - Download from [python.org](https://www.python.org/downloads/)
   - Verify: `python --version`

2. **Node.js 18+** (optional, for simple server)
   - Download from [nodejs.org](https://nodejs.org)
   - Verify: `node --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com)
   - Verify: `git --version`

4. **Supabase Account** (FREE)
   - Sign up at [supabase.com](https://supabase.com)

5. **Razorpay Account** (for testing)
   - Sign up at [razorpay.com](https://razorpay.com)

6. **Gmail Account**
   - For email notifications

---

## 📁 Step 1: Prepare Your Environment

### Create Project Folder

```bash
# Create project directory
mkdir cue-stories
cd cue-stories

# Clone or download the project files
# If using git:
git clone <your-repo-url> .

# List files to verify structure
ls -la
```

You should see:
```
index.html
pages/
js/
styles/
scripts/
backend/
DEPLOYMENT_GUIDE.md
LOCAL_SETUP.md
```

---

## 🗄️ Step 2: Setup Supabase Database

### Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New project"**
3. Enter:
   - **Name**: `cue-stories`
   - **Password**: Create a strong password (save it!)
   - **Region**: Select your region
4. Click **"Create new project"** (takes ~2 minutes)

### Get Your Credentials

1. After project creation, go to **Settings → API**
2. Copy and save these:

```
SUPABASE_URL = https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (for backend)
```

### Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste content from `/scripts/setup-database.sql`
4. Click **"Run"**
5. Tables created! ✅

### Update Frontend Credentials

Edit `/js/auth.js` (lines 1-2):
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

Edit `/js/booking.js` (lines 1-2):
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

---

## 🌐 Step 3: Setup Frontend Locally

### Option A: Using Python's Built-in Server (EASIEST)

```bash
# Navigate to project root
cd /path/to/cue-stories

# Start server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

### Option B: Using Node.js

```bash
# Install http-server
npm install -g http-server

# Start server
http-server

# Open in browser
# http://localhost:8080
```

### Option C: Using VS Code Live Server

1. Install **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**

### Test Frontend

1. Open [http://localhost:8000](http://localhost:8000)
2. You should see the Cue Stories homepage
3. Try clicking **Login** button
4. You can test signup/login (but no database operations until backend is setup)

---

## 🐍 Step 4: Setup Python Backend

### Create Backend Environment

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

# Verify venv is active (should show (venv) prefix in terminal)
```

### Install Dependencies

```bash
# Make sure you're in backend folder with venv active
pip install -r requirements.txt

# Verify installation
pip list
```

### Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials (see below)
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

---

## 🔑 Step 5: Get API Credentials

### Razorpay Credentials

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Sign up / Login
3. Go to **Settings → API Keys**
4. You'll see:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

For testing, use **Test Keys** (prefixed with `rzp_test_`)

**IMPORTANT**: Never share your Key Secret!

### Gmail App Password

Gmail setup for sending emails:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **"Security"** on left
3. Enable **2-Step Verification** if not already enabled
4. Go to **App passwords**
5. Select:
   - **App**: Mail
   - **Device**: Windows Computer (or your OS)
6. Google will generate a 16-character password
7. Copy it (spaces will be removed when pasting)

---

## 📝 Step 6: Configure .env File

Edit `/backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://dtmjfodtpbjutrebgzzl.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Service Role Key)

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxx

# Email Configuration
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (App password from Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Flask Configuration
FLASK_ENV=development
PORT=5000
```

---

## 🚀 Step 7: Run Backend

```bash
# Make sure you're in /backend folder with venv activated
cd backend

# Activate venv again (if not already)
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Start Flask app
python app.py

# You should see:
# Running on http://127.0.0.1:5000
# WARNING: This is a development server...
```

✅ Backend is now running on `http://localhost:5000`

---

## 🔗 Step 8: Connect Frontend to Backend

Edit `/js/payment.js`:

Find and update the API endpoint (around line 5):

```javascript
// Before:
// const API_BASE_URL = 'YOUR_BACKEND_URL';

// After:
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## ✅ Step 9: Complete Test Flow

### Test User Signup/Login

1. Open [http://localhost:8000](http://localhost:8000)
2. Click **"Login"** button
3. Go to **"Sign Up"** tab
4. Enter:
   - Name: John Doe
   - Email: test@example.com
   - Phone: 9876543210
5. Click **"Create Account"**
6. You should be redirected to booking page
7. Check Supabase: **Authentication → Users** - your user should be there

### Test Booking

1. You're on booking page - select **"Snooker"** game
2. Click **"Next"**
3. Select today's date
4. Select a time slot (e.g., 9:00 AM)
5. Click **"Next"**
6. Review confirmation
7. Click **"Proceed to Payment"**

### Test Payment (Razorpay Test Mode)

1. Click **"Pay with Razorpay"**
2. Razorpay popup opens
3. Use test card:
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVV**: Any 3 digits (e.g., 123)
4. Click **"Pay"**
5. You should see confirmation

### Check Database

1. Go to Supabase Dashboard
2. **Table Editor** → **bookings** table
3. Your booking should appear there
4. Check **payments** table for payment record

### Check Email

1. Check your Gmail inbox
2. You should receive booking confirmation email
3. If not, check spam folder

---

## 📱 Test Admin Dashboard

### Create Admin User

1. Go to Supabase Dashboard
2. **Table Editor** → **users** table
3. Find your user record
4. Click to edit
5. Set `is_admin = true`
6. Save

### Access Admin Panel

1. Open [http://localhost:8000/pages/admin.html](http://localhost:8000/pages/admin.html)
2. You should see admin dashboard
3. View all bookings, revenue, stats

---

## 🔍 Debugging Tips

### Check Console Logs

Open browser developer tools (F12):
- **Console tab**: See JavaScript errors and debug logs (marked with `[v0]`)
- **Network tab**: See all API calls to backend
- **Application tab**: Check localStorage data

### Check Backend Logs

In terminal where backend is running:
```
[v0] Email sent to test@example.com
[v0] Payment verified: pay_xxx
[v0] Error: Database connection failed
```

### Common Issues

**Issue**: "Cannot reach backend"
- ✅ Make sure backend is running (`python app.py`)
- ✅ Backend URL in frontend matches: `http://localhost:5000/api`
- ✅ Check firewall isn't blocking port 5000

**Issue**: "Database connection failed"
- ✅ Check SUPABASE_URL and SUPABASE_KEY are correct
- ✅ Verify internet connection
- ✅ Check Supabase project is active

**Issue**: "Email not sending"
- ✅ Check Gmail app password is correct
- ✅ Verify 2FA is enabled on Gmail
- ✅ Check spam folder
- ✅ Check email address is correct

**Issue**: "Razorpay not working"
- ✅ Verify Key ID and Secret are from Razorpay test account
- ✅ Check backend is running
- ✅ Check network tab for API errors

---

## 📚 File Reference

### Frontend Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage |
| `pages/login.html` | Login/Signup |
| `pages/booking.html` | 4-step booking |
| `pages/admin.html` | Admin dashboard |
| `js/auth.js` | User authentication |
| `js/booking.js` | Booking logic |
| `js/payment.js` | Razorpay integration |
| `js/main.js` | Utilities |

### Backend Files

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask API server |
| `backend/requirements.txt` | Python dependencies |
| `backend/.env` | Environment variables |

### Database Files

| File | Purpose |
|------|---------|
| `scripts/setup-database.sql` | Database schema |

---

## 🛑 Stop Services

### Stop Frontend Server

In terminal:
```bash
# Press Ctrl+C to stop
```

### Stop Backend Server

In terminal:
```bash
# Press Ctrl+C to stop
```

### Stop Virtual Environment

```bash
# Type command:
deactivate
```

---

## 🔄 Restart Services

```bash
# Frontend - Run in root folder
python -m http.server 8000

# Backend - Run in backend folder with venv activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

---

## 📋 Checklist Before Deployment

- [ ] Frontend runs on localhost:8000
- [ ] Backend runs on localhost:5000
- [ ] Can signup/login successfully
- [ ] Can book a slot
- [ ] Razorpay test payment works
- [ ] Confirmation email received
- [ ] Admin dashboard works
- [ ] All console logs are clean (no errors)
- [ ] Database has test data

---

## 🚀 Ready for Production?

Once everything works locally:

1. ✅ Deploy Frontend to Netlify (see DEPLOYMENT_GUIDE.md)
2. ✅ Deploy Backend to Render (see DEPLOYMENT_GUIDE.md)
3. ✅ Update Razorpay to Live Keys
4. ✅ Update Frontend URLs to production
5. ✅ Setup custom domain
6. ✅ Monitor logs

---

## 💡 Tips & Tricks

### Quick Restart Backend

```bash
# Windows:
venv\Scripts\activate && python app.py

# Mac/Linux:
source venv/bin/activate && python app.py
```

### View Database Directly

Go to [supabase.com](https://supabase.com) → Your Project → Table Editor

### Test API Endpoints

Use Postman or curl:
```bash
curl http://localhost:5000/api/health

# Response:
# {"status": "healthy", "timestamp": "2024-01-25T..."}
```

### Reset Database

1. Go to Supabase → SQL Editor
2. Run: `TRUNCATE TABLE bookings CASCADE;`
3. All bookings deleted

---

## 📞 Need Help?

If something doesn't work:

1. Check console (F12) for errors
2. Check backend terminal logs
3. Verify all credentials are correct
4. Restart services
5. Check internet connection
6. Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

---

## ✨ You're All Set!

Congratulations! Your Cue Stories booking system is now running locally. 

Next step: [Deployment Guide](./DEPLOYMENT_GUIDE.md)

Happy coding! 🎉
