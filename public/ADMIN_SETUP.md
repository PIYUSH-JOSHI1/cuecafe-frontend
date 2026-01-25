# Cue Stories - Admin & User Classification Guide

## 👥 User Types

The system has two user types:

1. **Regular Users** - Can book slots and view their history
2. **Admins** - Can manage bookings, view revenue, manage slots, update pricing

---

## 🏗️ How is it Implemented?

### In Database

The `users` table has a boolean field `is_admin`:

```sql
-- Users table schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,  -- ← This determines if user is admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

**Default**: All new users have `is_admin = false` (regular user)

### In Frontend

The authentication system stores user data in localStorage:

```javascript
// In /js/auth.js
const currentUser = {
  id: "uuid-123",
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  is_admin: false  // ← Check this to determine user type
};

// Stored in browser
localStorage.setItem('cueStories_user', JSON.stringify(currentUser));
```

### In Admin Dashboard

The `/pages/admin.html` checks if user is admin:

```javascript
// Redirect non-admins
if (!authManager.getCurrentUser().is_admin) {
  window.location.href = '/index.html';
  alert('Admin access only!');
}
```

---

## 🔑 Creating an Admin

### Method 1: Via Supabase Dashboard (EASIEST)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project → **Table Editor**
3. Click on **users** table
4. Find the user you want to make admin
5. Click to edit the row
6. Change `is_admin` from `false` to `true`
7. Click **Save**

Done! ✅

### Method 2: Via SQL Query

1. Go to **SQL Editor** in Supabase
2. Run this command:

```sql
-- Make specific user admin
UPDATE users 
SET is_admin = true 
WHERE email = 'owner@cuestories.com';
```

3. Click **Run**

### Method 3: Programmatically

In backend or frontend:

```javascript
// Via Supabase API
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ is_admin: true }),
  }
);
```

---

## 👤 Admin vs User Features

### Regular User Features
- ✅ Sign up / Login
- ✅ Book slots
- ✅ View booking history
- ✅ View available slots
- ✅ Pay via Razorpay
- ✅ Cancel bookings
- ✅ Submit reviews and ratings
- ✅ Upload photos with reviews
- ❌ Cannot view other users' bookings
- ❌ Cannot view revenue
- ❌ Cannot manage slots
- ❌ Cannot update pricing

### Admin Features
- ✅ All user features (can also book)
- ✅ View ALL bookings (not just theirs)
- ✅ View total revenue (daily/weekly/monthly)
- ✅ Manage time slots (block/unblock)
- ✅ Update game pricing
- ✅ View customer details
- ✅ View pending payments
- ✅ Manage venue settings
- ✅ Access admin dashboard
- ✅ View analytics

---

## 🔐 Admin Dashboard Access

### URL: `/pages/admin.html`

### Protection

The page automatically:
1. Checks if user is logged in
2. Checks if user `is_admin = true`
3. Redirects to homepage if not admin

```javascript
// In admin.html
if (!authManager.isLoggedIn()) {
  window.location.href = '/pages/login.html';
}

if (!authManager.getCurrentUser().is_admin) {
  window.location.href = '/index.html';
  alert('Admin access denied!');
}
```

### What Admin Can Do

**View Bookings**
- See all bookings (not just their own)
- Filter by date, status, user
- See payment status

**View Revenue**
- Total revenue (all time)
- Daily revenue
- Weekly revenue
- Monthly revenue
- Pending payments

**Manage Slots**
- Block specific time slots
- Unblock blocked slots
- Reason for blocking

**Manage Pricing**
- Update price for Snooker
- Update price for Foosball
- Set first-booking discount

**View Customers**
- List all users
- View user details
- See their booking history
- Search users

---

## 📊 Admin Dashboard Sections

### 1. Dashboard Overview
```
Total Bookings: 45
Total Revenue: ₹5,625.50
Today's Bookings: 3
Today's Revenue: ₹375.00
Pending Payments: 2
```

### 2. All Bookings Table
Shows:
- User name
- Game
- Date & Time
- Amount
- Payment Status
- Booking Status

### 3. Manage Slots
- Select game
- Select date
- Block/Unblock time slots
- Add reason for blocking

### 4. Update Pricing
- Snooker price: ₹___
- Foosball price: ₹___
- First booking discount: ₹___

### 5. Customer List
- Search by name/email
- View customer details
- See their booking history

### 6. Revenue Report
- Daily revenue chart
- Monthly revenue summary
- Payment method breakdown

---

## 🔑 Setup Owner Admin Account

### Step 1: Create Account

1. Go to [http://localhost:8000](http://localhost:8000)
2. Click **Login**
3. Go to **Sign Up** tab
4. Enter:
   - Name: Cue Stories Owner (or your name)
   - Email: owner@cuestories.com (or your email)
   - Phone: 8408068388
5. Click **Create Account**

### Step 2: Make Account Admin

1. Go to Supabase Dashboard
2. **Table Editor** → **users**
3. Find the user you just created
4. Click to edit
5. Set `is_admin = true`
6. Click **Save**

### Step 3: Test Admin Access

1. Go back to website
2. You should already be logged in
3. Visit [http://localhost:8000/pages/admin.html](http://localhost:8000/pages/admin.html)
4. You should see admin dashboard
5. If redirected to homepage, you're not admin yet

---

## 📱 Multiple Admins

You can create multiple admin accounts:

```sql
-- Make multiple users admin
UPDATE users 
SET is_admin = true 
WHERE email IN (
  'owner1@cuestories.com',
  'owner2@cuestories.com',
  'manager@cuestories.com'
);

-- View all admins
SELECT id, name, email, is_admin FROM users WHERE is_admin = true;
```

---

## 🔒 Remove Admin Privileges

If you want to demote an admin:

```sql
-- Remove admin from user
UPDATE users 
SET is_admin = false 
WHERE email = 'user@example.com';
```

---

## 📋 Default Admin Credentials

For testing, you can use:

**Email**: owner@cuestories.com
**Phone**: 8408068388
**Name**: Cue Stories Owner
**is_admin**: true

After creating this account, make sure to:
1. Update `is_admin` to `true` in database
2. Use email/phone to login
3. Access `/pages/admin.html`

---

## 🔍 Query Examples

### Check Who is Admin
```sql
SELECT id, name, email, is_admin FROM users WHERE is_admin = true;
```

### Count Admin Users
```sql
SELECT COUNT(*) as admin_count FROM users WHERE is_admin = true;
```

### List All Users with Their Role
```sql
SELECT 
  id, 
  name, 
  email, 
  CASE WHEN is_admin THEN 'Admin' ELSE 'User' END as role,
  created_at
FROM users
ORDER BY is_admin DESC, created_at DESC;
```

### Get User's Booking Count
```sql
SELECT 
  u.id,
  u.name, 
  u.email,
  COUNT(b.id) as booking_count
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
GROUP BY u.id
ORDER BY booking_count DESC;
```

---

## 🛡️ Security Considerations

1. **Share Admin Access Carefully**
   - Only trusted staff should be admins
   - Each admin should have their own account

2. **Audit Admin Actions**
   - Log who makes changes
   - Review admin activity regularly

3. **Secure Credentials**
   - Don't share admin passwords
   - Use strong passwords
   - Enable 2FA if available

4. **Review Regularly**
   - Check who has admin access
   - Remove access when staff leaves
   - Update permissions as needed

---

## 🚨 Troubleshooting

### Issue: Can't access admin dashboard

**Solution 1**: Check if logged in
```
1. Click Login/Signup
2. Enter your credentials
3. Try admin page again
```

**Solution 2**: Check if admin
```
1. Go to Supabase
2. Find your user in users table
3. Check is_admin = true
4. If false, update to true
5. Refresh page
```

**Solution 3**: Clear browser cache
```
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete)
2. Clear browser data
3. Log out and log in again
```

### Issue: Redirected to homepage from admin

**Solution**: You're not marked as admin
```
1. Go to Supabase Dashboard
2. Table Editor → users
3. Find your email
4. Set is_admin = true
5. Save
6. Refresh browser
```

### Issue: Other user can access admin

**Solution**: They're marked as admin but shouldn't be
```
1. Go to Supabase Dashboard
2. Find their user record
3. Set is_admin = false
4. Save
5. They'll be locked out of admin on next login
```

---

## 📊 Admin Analytics Features

In admin dashboard, you can:

1. **View Revenue**
   - Total all-time revenue
   - Daily breakdown
   - Monthly trends
   - Payment method analysis

2. **Track Bookings**
   - Total bookings
   - Completed vs cancelled
   - Busy times
   - Popular games

3. **Manage Slots**
   - Block time slots for maintenance
   - Set operating hours
   - Special event slots

4. **Monitor Payments**
   - Pending payments
   - Failed transactions
   - Refunds processed
   - Payment success rate

---

## 🎯 Best Practices

1. **Create separate admin account** - Don't use personal account for admin
2. **Keep records** - Note when you make admin changes
3. **Review regularly** - Check admin list monthly
4. **Update pricing carefully** - Notify customers of price changes
5. **Backup data** - Regular Supabase backups
6. **Monitor revenue** - Check daily to spot issues

---

## 📞 Admin Support

If you need help:

1. Check console logs (F12)
2. Check backend logs
3. Verify Supabase connection
4. Contact support: admin@cuestories.com

---

## ✅ Admin Checklist

- [ ] Created owner account
- [ ] Marked account as admin
- [ ] Can access admin dashboard
- [ ] Can view all bookings
- [ ] Can see revenue
- [ ] Can manage slots
- [ ] Can update pricing
- [ ] Created backup admin account
- [ ] Tested all admin features

---

Congratulations! You're now set up as an admin for Cue Stories! 🎉
