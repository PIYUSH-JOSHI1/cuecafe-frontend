// Supabase Configuration
const SUPABASE_URL = 'https://dtmjfodtpbjutrebgzzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bWpmb2R0cGJqdXRyZWJnenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzQ3MzcsImV4cCI6MjA4NDkxMDczN30.r5NooTQnkfDa5kj4NSsNzgUZlTdyxnaY2bH9CaegyK0';

class AuthManager {
  constructor() {
    this.currentUser = this.loadFromLocalStorage();
    this.initializeUI();
  }

  loadFromLocalStorage() {
    const stored = localStorage.getItem('cue_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('[v0] Error parsing stored user:', e);
        return null;
      }
    }
    return null;
  }

  initializeUI() {
    const authLink = document.getElementById('authLink');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (this.currentUser) {
      if (authLink) {
        authLink.innerHTML = `<i class="fas fa-user-circle"></i> ${this.currentUser.name}`;
        authLink.href = 'pages/profile.html';
        authLink.onclick = null;
      }

      if (userMenuBtn && userMenuDropdown) {
        userMenuBtn.style.display = 'inline-block';
        userMenuDropdown.innerHTML = `
          <a class="dropdown-item" href="pages/profile.html">
            <i class="fas fa-user"></i> My Profile
          </a>
          <a class="dropdown-item" href="pages/booking.html">
            <i class="fas fa-calendar-alt"></i> Book Now
          </a>
          ${this.currentUser.is_admin ? `<a class="dropdown-item" href="pages/admin.html"><i class="fas fa-chart-bar"></i> Admin Panel</a>` : ''}
          <hr class="dropdown-divider">
          <a class="dropdown-item text-danger" href="#" onclick="authManager.logout(); return false;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        `;
      }
    } else {
      if (authLink) {
        authLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        authLink.href = 'pages/login.html';
      }
      if (userMenuBtn) userMenuBtn.style.display = 'none';
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }

  requireAdmin() {
    if (!this.isLoggedIn() || !this.currentUser.is_admin) {
      alert('Access denied. Admin privileges required.');
      window.location.href = '/index.html';
      return false;
    }
    return true;
  }

  // Hash password using SHA-256
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'cue_stories_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async signup(email, phone, name, password) {
    console.log('[v0] Signup attempt for:', email);

    if (!email || !phone || !name || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    try {
      const checkResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash the password
      const passwordHash = await this.hashPassword(password);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          email,
          phone,
          name,
          password_hash: passwordHash,
          is_admin: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[v0] Signup error:', error);
        return { success: false, error: error.message || 'Signup failed' };
      }

      const newUser = await response.json();
      const user = Array.isArray(newUser) ? newUser[0] : newUser;

      console.log('[v0] Signup successful:', user);

      const userData = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        is_admin: user.is_admin,
        created_at: user.created_at,
      };

      localStorage.setItem('cue_user', JSON.stringify(userData));
      this.currentUser = userData;
      this.initializeUI();

      return { success: true, user: userData };
    } catch (error) {
      console.error('[v0] Signup error:', error);
      return { success: false, error: error.message };
    }
  }

  async login(email, password) {
    console.log('[v0] Login attempt for:', email);

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
        }
      );

      const users = await response.json();

      if (!Array.isArray(users) || users.length === 0) {
        console.log('[v0] User not found:', email);
        return { success: false, error: 'Invalid email or password' };
      }

      const user = users[0];
      console.log('[v0] User found:', user.email);

      // Verify password
      const passwordHash = await this.hashPassword(password);
      if (user.password_hash && user.password_hash !== passwordHash) {
        console.log('[v0] Password mismatch');
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last_login
      await fetch(
        `${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ last_login: new Date().toISOString() }),
        }
      );

      const userData = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        is_admin: user.is_admin,
        created_at: user.created_at,
      };

      localStorage.setItem('cue_user', JSON.stringify(userData));
      this.currentUser = userData;
      this.initializeUI();

      console.log('[v0] Login successful:', userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('[v0] Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(name, phone) {
    if (!this.isLoggedIn()) {
      return { success: false, error: 'Not logged in' };
    }

    console.log('[v0] Updating profile for user:', this.currentUser.id);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/users?id=eq.${this.currentUser.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({ name, phone }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('[v0] Update error:', error);
        return { success: false, error: error.message };
      }

      const updatedUser = await response.json();
      const user = Array.isArray(updatedUser) ? updatedUser[0] : updatedUser;

      this.currentUser.name = user.name;
      this.currentUser.phone = user.phone;
      localStorage.setItem('cue_user', JSON.stringify(this.currentUser));

      console.log('[v0] Profile updated successfully');
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('[v0] Update error:', error);
      return { success: false, error: error.message };
    }
  }

  logout() {
    console.log('[v0] User logging out');
    localStorage.removeItem('cue_user');
    this.currentUser = null;
    this.initializeUI();
    window.location.href = '/index.html';
  }

  showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      <i class="fas fa-check-circle me-2"></i> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('main') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
  }
}

const authManager = new AuthManager();
