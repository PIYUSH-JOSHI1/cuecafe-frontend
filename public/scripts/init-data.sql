-- Initialize Cue Stories Venue and Games Data
-- Run this AFTER setup-database.sql

-- Insert Cue Stories Venue
INSERT INTO venues (name, email, phone, location, google_maps_url, instagram_url, about, rules, operating_hours_start, operating_hours_end)
VALUES (
  'Cue Stories',
  'info@cuestories.com',
  '8408068388',
  'Akluj, Maharashtra, India',
  'https://maps.app.goo.gl/rJGG52ER3f17T9tQ9',
  'https://www.instagram.com/cue_stories/',
  'Where every shot tells a story. Cue Stories Café offers premium snooker and foosball tables in a relaxed, welcoming atmosphere. Perfect for casual hangouts, friendly competitions, or serious gaming.',
  'Non-marking shoes are compulsory. Respect fellow players. No outside food allowed. Keep tables clean.',
  '09:00',
  '23:00'
);

-- Get the venue ID (we'll use a subquery)
DO $$ 
DECLARE
  venue_id UUID;
BEGIN
  -- Get the venue ID
  SELECT id INTO venue_id FROM venues WHERE name = 'Cue Stories' LIMIT 1;
  
  -- Insert Snooker game
  INSERT INTO games (venue_id, name, description, price_per_hour, first_booking_discount)
  VALUES (
    venue_id,
    'Snooker',
    'Professional snooker tables for premium gaming experience. Perfect for serious players and casual fun.',
    150,
    25
  );
  
  -- Insert Foosball game
  INSERT INTO games (venue_id, name, description, price_per_hour, first_booking_discount)
  VALUES (
    venue_id,
    'Foosball',
    'High-quality foosball tables for exciting multiplayer fun. Great for groups and tournaments.',
    150,
    25
  );
END $$;

-- Create admin user (optional - uncomment to use)
-- INSERT INTO users (email, phone, name, is_admin)
-- VALUES ('admin@cuestories.com', '8408068388', 'Admin', TRUE);

-- Verify data was inserted
SELECT 'Venue Created:' as status, COUNT(*) as venue_count FROM venues WHERE name = 'Cue Stories';
SELECT 'Games Created:' as status, COUNT(*) as game_count FROM games WHERE venue_id = (SELECT id FROM venues WHERE name = 'Cue Stories');
