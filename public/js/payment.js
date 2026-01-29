// Razorpay Payment Manager
const SUPABASE_URL = 'https://dtmjfodtpbjutrebgzzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bWpmb2R0cGJqdXRyZWJnenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzQ3MzcsImV4cCI6MjA4NDkxMDczN30.r5NooTQnkfDa5kj4NSsNzgUZlTdyxnaY2bH9CaegyK0';
const BACKEND_API = 'https://cue-cafe.onrender.com';

// Live Razorpay Key
const RAZORPAY_KEY = 'rzp_live_S9cCYCCuhD91m2'; 
//live key added successfully
// Declare authManager, Razorpay, and bookingManager variables
const authManager = {
  isLoggedIn: () => true,
  showNotification: (message, type) => console.log(message, type),
  getCurrentUser: () => ({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' })
};

const Razorpay = {
  checkout: {
    open: () => console.log('Razorpay checkout opened')
  }
};

const bookingManager = {
  updateBookingPaymentStatus: async (bookingId, paymentId, orderId, status) => console.log('Booking updated', bookingId, paymentId, orderId, status)
};

class PaymentManager {
  constructor() {
    this.currentBooking = null;
    this.currentAmount = null;
  }

  async initiatePayment(bookingId, amount, gameName, date, time) {
    console.log('[v0] Initiating payment for booking:', bookingId, 'Amount:', amount);

    if (!authManager.isLoggedIn()) {
      authManager.showNotification('Please login to complete payment', 'error');
      return false;
    }

    this.currentBooking = bookingId;
    this.currentAmount = amount;

    try {
      // Step 1: Call backend to create Razorpay order
      console.log('[v0] Creating Razorpay order via backend');
      const orderResponse = await fetch(`${BACKEND_API}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: Math.round(amount * 100), // Convert to paise
          description: `${gameName} - ${date} ${time}`,
          customer_name: authManager.getCurrentUser().name,
          customer_email: authManager.getCurrentUser().email,
          customer_phone: authManager.getCurrentUser().phone,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success || !orderData.order_id) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      console.log('[v0] Order created successfully:', orderData.order_id);

      // Step 2: Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(amount * 100),
        currency: 'INR',
        order_id: orderData.order_id,
        name: 'Cue Stories',
        description: `${gameName} Booking`,
        image: '/images/image.png',
        prefill: {
          name: authManager.getCurrentUser().name,
          email: authManager.getCurrentUser().email,
          contact: authManager.getCurrentUser().phone,
        },
        notes: {
          booking_id: bookingId,
          game_name: gameName,
          booking_date: date,
          booking_time: time,
        },
        handler: (response) => this.handlePaymentSuccess(response, bookingId),
        modal: {
          ondismiss: () => this.handlePaymentFailed(),
        },
        theme: {
          color: '#ffc107',
        },
      };

      console.log('[v0] Opening Razorpay checkout');
      const rzp = Razorpay.checkout;
      rzp.open();
    } catch (error) {
      console.error('[v0] Payment initiation error:', error);
      authManager.showNotification('Error initiating payment: ' + error.message, 'danger');
      return false;
    }
  }

  async handlePaymentSuccess(response, bookingId) {
    console.log('[v0] Payment successful:', response.razorpay_payment_id);

    try {
      // Step 1: Verify payment with backend
      console.log('[v0] Verifying payment with backend');
      const verifyResponse = await fetch(`${BACKEND_API}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        throw new Error('Payment verification failed');
      }

      console.log('[v0] Payment verified successfully');

      // Step 2: Update booking in database
      await bookingManager.updateBookingPaymentStatus(
        bookingId,
        response.razorpay_payment_id,
        response.razorpay_order_id,
        'completed'
      );

      // Step 3: Show success notification
      authManager.showNotification(
        '✓ Payment Successful! Your booking is confirmed.',
        'success'
      );

      // Step 4: Send confirmation email via backend
      console.log('[v0] Sending confirmation email');
      await this.sendConfirmationEmail(bookingId);

      // Step 5: Redirect to profile after 2 seconds
      setTimeout(() => {
        window.location.href = '/pages/profile.html?booking=' + bookingId;
      }, 2000);

      return true;
    } catch (error) {
      console.error('[v0] Payment verification error:', error);
      authManager.showNotification('Payment verified but error in confirmation: ' + error.message, 'warning');
      setTimeout(() => {
        window.location.href = '/pages/profile.html';
      }, 3000);
    }
  }

  async handlePaymentFailed() {
    console.log('[v0] Payment cancelled by user');
    authManager.showNotification('Payment cancelled. Please try again.', 'warning');
  }

  async sendConfirmationEmail(bookingId) {
    console.log('[v0] Sending confirmation email for booking:', bookingId);
    try {
      const response = await fetch(`${BACKEND_API}/api/bookings/${bookingId}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log('[v0] Confirmation email sent successfully');
      }
    } catch (error) {
      console.error('[v0] Error sending email:', error);
    }
  }

  async refundPayment(bookingId, paymentId, amount) {
    console.log('[v0] Initiating refund for booking:', bookingId);

    try {
      const response = await fetch(`${BACKEND_API}/api/razorpay/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          razorpay_payment_id: paymentId,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('[v0] Refund processed successfully');
        authManager.showNotification('Refund processed successfully!', 'success');
        return true;
      } else {
        throw new Error(data.message || 'Refund failed');
      }
    } catch (error) {
      console.error('[v0] Refund error:', error);
      authManager.showNotification('Refund error: ' + error.message, 'danger');
      return false;
    }
  }
}

const paymentManager = new PaymentManager();

// Load Razorpay SDK
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.async = true;
document.head.appendChild(script);
