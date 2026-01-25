// Utility Functions
class Utils {
  static formatDateTime(dateString, timeString) {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const dateName = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const yearName = date.toLocaleDateString('en-IN', { year: 'numeric' });
    return `${dayName}, ${dateName} ${yearName} ${timeString}`;
  }

  static getNextSevenDays() {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: i === 0,
      });
    }

    return days;
  }

  static getMonthDates(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: i,
        dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        isToday: i === new Date().getDate() && month === new Date().getMonth(),
      });
    }

    return dates;
  }

  static getMonthName(month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }

  static showLoading(element) {
    element.innerHTML = '<div class="spinner"></div>';
  }

  static hideLoading(element) {
    element.innerHTML = '';
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[^\d]/g, ''));
  }

  static formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = new window.bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  static scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  static copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      window.authManager.showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
      window.authManager.showNotification('Failed to copy', 'error');
    });
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  static getTimeFromNow(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN');
  }

  static createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static showAlert(message, type = 'info', duration = 3000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.alerts-container') || document.body;
    container.insertBefore(alert, container.firstChild);

    if (duration > 0) {
      setTimeout(() => alert.remove(), duration);
    }
  }

  static async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(`cueStories_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  static getLocalStorage(key) {
    try {
      const item = localStorage.getItem(`cueStories_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Local storage error:', error);
      return null;
    }
  }

  static removeLocalStorage(key) {
    try {
      localStorage.removeItem(`cueStories_${key}`);
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  static getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  static setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, document.title, url);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('[v0] Cue Stories app initialized');
});

// Handle network changes
window.addEventListener('online', () => {
  window.authManager.showNotification('You are back online', 'success');
});

window.addEventListener('offline', () => {
  window.authManager.showNotification('You are offline. Some features may not work.', 'info');
});
