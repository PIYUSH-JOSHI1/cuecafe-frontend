// Booking Manager - Fixed Version
const SUPABASE_URL = 'https://dtmjfodtpbjutrebgzzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bWpmb2R0cGJqdXRyZWJnenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzQ3MzcsImV4cCI6MjA4NDkxMDczN30.r5NooTQnkfDa5kj4NSsNzgUZlTdyxnaY2bH9CaegyK0';
const BACKEND_API = 'https://cue-cafe.onrender.com';

// Note: authManager is defined in auth.js and must be loaded first

class BookingManager {
  constructor() {
    this.selectedGame = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.bookingCart = [];
    this.availableSlots = [];
    console.log('[v0] BookingManager initialized');
  }

  async getVenue() {
    try {
      console.log('[v0] Fetching Cue Stories venue');
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/venues?name=eq.Cue%20Stories`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const venues = await response.json();
      if (venues.length === 0) {
        console.error('[v0] Cue Stories venue not found');
        return null;
      }

      console.log('[v0] Venue found:', venues[0]);
      return venues[0];
    } catch (error) {
      console.error('[v0] Error fetching venue:', error);
      return null;
    }
  }

  async getAllGames() {
    try {
      console.log('[v0] Fetching all games');
      
      // Fetch all games directly (no venue filter to ensure games are shown)
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/games?select=*`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[v0] Error response:', errorText);
        return [];
      }

      const games = await response.json();
      console.log('[v0] Games fetched:', games);
      return games || [];
    } catch (error) {
      console.error('[v0] Error fetching games:', error);
      return [];
    }
  }

  async getAvailableSlots(gameId, date) {
    try {
      console.log(`[v0] Fetching slots for game ${gameId}, date ${date}`);

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?game_id=eq.${gameId}&booking_date=eq.${date}&status=eq.confirmed`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const bookings = await response.json();
      console.log('[v0] Booked slots:', bookings);

      const bookedTimes = new Set();
      bookings.forEach((booking) => {
        bookedTimes.add(`${booking.start_time}-${booking.end_time}`);
      });

      this.availableSlots = this.generateTimeSlots(bookedTimes);
      console.log('[v0] Available slots:', this.availableSlots);
      return this.availableSlots;
    } catch (error) {
      console.error('[v0] Error fetching slots:', error);
      return [];
    }
  }

  generateTimeSlots(bookedTimes) {
    const slots = [];
    const startHour = 9;
    const endHour = 23;

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
      const timeKey = `${startTime}-${endTime}`;

      slots.push({
        startTime,
        endTime,
        available: !bookedTimes.has(timeKey),
        timeKey,
      });
    }

    return slots;
  }

  async createBooking(gameId, date, startTime, endTime) {
    try {
      console.log('[v0] Creating booking');

      // Check if user is logged in
      if (!authManager.isLoggedIn()) {
        console.error('[v0] User not logged in');
        authManager.showNotification('Please login first', 'error');
        authManager.requireLogin();
        return null;
      }

      const user = authManager.getCurrentUser();
      const venue = await this.getVenue();

      if (!venue) {
        authManager.showNotification('Venue not found', 'error');
        return null;
      }

      // Fetch game details for pricing
      const gamesResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/games?id=eq.${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const games = await gamesResponse.json();
      if (games.length === 0) {
        authManager.showNotification('Game not found', 'error');
        return null;
      }

      const game = games[0];
      const basePrice = game.price_per_hour;
      const discount = game.first_booking_discount;
      const totalPrice = basePrice - discount;

      console.log('[v0] Booking details:', { user: user.id, venue: venue.id, game: gameId, price: totalPrice });

      // Create booking in Supabase
      const bookingResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            user_id: user.id,
            venue_id: venue.id,
            game_id: gameId,
            booking_date: date,
            start_time: startTime,
            end_time: endTime,
            total_price: totalPrice,
            discount_applied: discount,
            payment_status: 'pending',
            status: 'pending',
          }),
        }
      );

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        console.error('[v0] Booking creation error:', error);
        authManager.showNotification('Failed to create booking', 'error');
        return null;
      }

      const bookingData = await bookingResponse.json();
      const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

      console.log('[v0] Booking created:', booking);

      return {
        id: booking.id,
        price: totalPrice,
        game: game.name,
        date,
        time: `${startTime} - ${endTime}`,
      };
    } catch (error) {
      console.error('[v0] Error creating booking:', error);
      authManager.showNotification('Booking creation failed', 'error');
      return null;
    }
  }

  async getUserBookings(userId) {
    try {
      console.log('[v0] Fetching bookings for user:', userId);

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?user_id=eq.${userId}&order=booking_date.desc`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const bookings = await response.json();
      console.log('[v0] User bookings:', bookings);
      return bookings || [];
    } catch (error) {
      console.error('[v0] Error fetching user bookings:', error);
      return [];
    }
  }

  async cancelBooking(bookingId) {
    try {
      console.log('[v0] Canceling booking:', bookingId);

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'cancelled' }),
        }
      );

      if (response.ok) {
        console.log('[v0] Booking cancelled successfully');
        authManager.showNotification('Booking cancelled', 'success');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[v0] Error canceling booking:', error);
      authManager.showNotification('Cancellation failed', 'error');
      return false;
    }
  }
}

const bookingManager = new BookingManager();
