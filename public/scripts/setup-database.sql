-- Create venue table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  google_maps_url TEXT,
  instagram_url TEXT,
  about TEXT,
  rules TEXT,
  operating_hours_start TIME DEFAULT '09:00',
  operating_hours_end TIME DEFAULT '23:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_per_hour INTEGER NOT NULL,
  first_booking_discount INTEGER DEFAULT 25,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  discount_applied INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  order_id TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(venue_id, game_id, booking_date, start_time)
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create time slot blocking table (for admin to block slots)
CREATE TABLE blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Cue Stories venue
INSERT INTO venues (name, email, phone, location, google_maps_url, instagram_url, about, rules)
VALUES (
  'Cue Stories',
  'info@cuestories.com',
  '8408068388',
  'Akluj',
  'https://maps.app.goo.gl/rJGG52ER3f17T9tQ9',
  'https://www.instagram.com/cue_stories/',
  'Where every shot tells a story. Cue Stories Café | Pool • Snooker • Chill. Good vibes. Great shots.',
  'Non-marking shoes are compulsory. Be respectful to other players. No outside food and beverages.'
);

-- Insert games for Cue Stories
INSERT INTO games (venue_id, name, description, price_per_hour, first_booking_discount)
SELECT id, 'Snooker', 'Premium snooker tables with professional equipment', 150, 25
FROM venues WHERE name = 'Cue Stories';

INSERT INTO games (venue_id, name, description, price_per_hour, first_booking_discount)
SELECT id, 'Foosball', 'High-quality foosball tables for fun and competition', 150, 25
FROM venues WHERE name = 'Cue Stories';

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX idx_bookings_game_id ON bookings(game_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_blocked_slots_venue_date ON blocked_slots(venue_id, blocked_date);
