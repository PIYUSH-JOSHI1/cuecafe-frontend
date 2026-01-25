# Cue Stories - Online Booking System

A modern, responsive online booking system for Cue Stories, a premium snooker and foosball venue in Akluj. Built with vanilla HTML, CSS, and JavaScript with Supabase backend and Razorpay payment integration.

## Features

### User Features
- **User Authentication**: Email/Phone-based registration and login
- **Booking System**: 
  - Select game (Snooker/Foosball)
  - Choose date and time slot
  - Real-time slot availability
  - 1-hour booking duration
  - Operating hours: 9:00 AM - 11:00 PM
- **Pricing**: 
  - ₹150/hour standard rate
  - ₹25 discount on first booking
  - Transparent pricing breakdown
- **Payment Integration**: Secure Razorpay payment gateway
- **Booking Management**:
  - View booking history
  - Cancel bookings with refund policy
  - Real-time notifications
- **Reviews & Ratings**: 
  - Rate and review completed bookings
  - Upload photos with reviews

### Admin Features
- **Secure Admin Panel**:
  - View all bookings
  - Manage time slots (block/unblock)
  - Set game pricing
  - View revenue reports (daily/monthly)
  - Manage bookings and customer details

### Venue Information
- About page with venue details
- Pricing information
- Cancellation & refund policy
- Club rules and guidelines
- Google Maps location integration
- Contact details

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS, Bootstrap 5
- **Backend**: Supabase (PostgreSQL)
- **Payments**: Razorpay
- **Hosting**: Can be deployed to Vercel, Netlify, or any static host

## Project Structure

```
cue-stories/
├── index.html                 # Home page
├── pages/
│   ├── login.html            # Authentication page
│   ├── booking.html          # Booking flow (4-step)
│   ├── profile.html          # User profile & booking history
│   ├── pricing.html          # Pricing information
│   ├── policies.html         # Terms, cancellation, club rules
│   └── confirmation.html     # Booking confirmation
├── js/
│   ├── auth.js               # Authentication manager
│   ├── booking.js            # Booking manager
│   ├── payment.js            # Razorpay integration
│   └── main.js               # Utility functions
├── styles/
│   └── main.css              # Global styles
├── scripts/
│   └── setup-database.sql    # Database schema
└── images/                   # Venue images
```

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script in `/scripts/setup-database.sql` in Supabase SQL editor
3. Get your Supabase URL and Anon Key from project settings

### 2. Update Configuration

In `js/auth.js`, update:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

In `js/payment.js`, update:
```javascript
this.RAZORPAY_KEY = 'YOUR_RAZORPAY_KEY_ID';
```

### 3. Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your Key ID from Dashboard
3. Create backend endpoints for:
   - `/api/create-order` - Create Razorpay order
   - `/api/verify-payment` - Verify payment signature
   - `/api/refund-payment` - Process refunds

### 4. Backend API Endpoints

You need to create these backend endpoints (Node.js/Express example):

#### Create Order
```javascript
POST /api/create-order
Body: { amount, currency, receipt, notes }
Response: { id, amount, currency }
```

#### Verify Payment
```javascript
POST /api/verify-payment
Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, booking_id }
Response: { success, message }
```

#### Refund Payment
```javascript
POST /api/refund-payment
Body: { payment_id, amount }
Response: { refund_id, status }
```

### 5. Deploy

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
- Connect your Git repository to Netlify
- Set environment variables in Netlify UI

**Option 3: Traditional Hosting**
- Upload files to your server via FTP
- No build process needed (vanilla JS)

## Database Schema

### Tables
- **venues**: Venue information
- **games**: Available games (Snooker, Foosball)
- **users**: User accounts and authentication
- **bookings**: Slot bookings with pricing
- **payments**: Payment transaction history
- **reviews**: User reviews and ratings
- **notifications**: User notifications
- **blocked_slots**: Admin-blocked time slots

## Booking Flow

1. **Login/Register** → User authentication
2. **Select Game** → Choose Snooker or Foosball
3. **Select Date & Time** → Pick available slot
4. **Confirm Booking** → Review pricing and details
5. **Payment** → Razorpay payment processing
6. **Confirmation** → Booking confirmed with details

## Pricing Details

- **Base Rate**: ₹150 per hour
- **First Booking Discount**: ₹25 OFF
- **Cancellation within 24 hours**: 10% fee
- **No-show**: Full amount forfeited

## Key Features

### Real-time Slot Availability
- Automatically fetches booked slots from database
- Prevents double-booking
- Shows available slots for selected date

### First-time User Discount
- Automatically applies ₹25 discount
- Verified by checking user's booking history

### Automatic Notifications
- Booking confirmations
- Payment success/failure alerts
- Cancellation confirmations
- Real-time slot updates

### Responsive Design
- Mobile-first approach
- Works on all device sizes
- Touch-friendly interface

## Security Features

- Secure password handling (bcrypt on backend)
- SQL injection prevention (parameterized queries)
- CSRF protection
- PCI compliance via Razorpay
- Secure session management
- Row-level security (RLS) in Supabase

## Customization

### Colors
Edit `/styles/main.css`:
```css
:root {
  --primary-color: #ffc107;      /* Change primary color */
  --dark-bg: #1a1a1a;            /* Background */
  --text-primary: #ffffff;       /* Text color */
}
```

### Operating Hours
Edit the time generation in `booking.js`:
```javascript
const startHour = 9;
const endHour = 23;
```

### Game Pricing
Update in Supabase games table or in booking manager

## Troubleshooting

### Payment Integration
- Verify Razorpay credentials
- Check CORS settings if using hosted backend
- Test with Razorpay test mode first

### Slot Availability
- Ensure database has correct timezone
- Check booking status is "confirmed"
- Verify date format is ISO (YYYY-MM-DD)

### Authentication Issues
- Clear browser localStorage
- Check Supabase connection credentials
- Verify email/phone format

## Future Enhancements

- Admin dashboard with analytics
- Multi-language support
- Loyalty points system
- Group booking discounts
- Recurring bookings
- Email/SMS reminders
- Social media sharing
- Table reservations with photos

## Support

**Contact Information**:
- Phone: 8408068388
- Email: info@cuestories.com
- Instagram: @cue_stories
- Location: Akluj
- Maps: https://maps.app.goo.gl/rJGG52ER3f17T9tQ9

## License

This project is proprietary to Cue Stories. All rights reserved.

## Notes

- All prices are in INR (Indian Rupees)
- Operating in Akluj, Maharashtra, India
- Business hours: 9:00 AM - 11:00 PM daily
- Non-marking shoes are compulsory
- No outside food and beverages allowed
