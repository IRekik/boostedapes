// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.custom-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `custom-notification custom-notification-${type}`;
  notification.textContent = message;

  // Styling
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    max-width: 300px;
  `;

  // Type-specific styling
  const styles = {
    success: 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;',
    error: 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white;',
    warning: 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;',
    info: 'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;'
  };

  notification.style.cssText += styles[type] || styles.info;

  // Add animation keyframes if not already present
  if (!document.querySelector('#notification-keyframes')) {
    const style = document.createElement('style');
    style.id = 'notification-keyframes';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to DOM
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}