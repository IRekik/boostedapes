document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("btn").onclick = async () => {
    const r = await fetch("/api/hello/");
    const j = await r.json();
    document.getElementById("out").textContent = JSON.stringify(j, null, 2);
  };

  document.getElementById("fetch_games_btn").addEventListener('click', async () => {
    const username = document.getElementById("username").value;
    const tag = document.getElementById("tag").value;
    const r = await fetch(`/api/games/?username=${username}&tag=${tag}`);
    const j = await r.json();

    document.getElementById("out2").textContent = JSON.stringify(j, null, 2);
  })

  // Enhanced JavaScript for LoL Insights

  // Elements
  const fetchBtn = document.getElementById('btn');
  const output = document.getElementById('out');
  const fetchGamesBtn = document.getElementById('fetch_games_btn');
  const usernameInput = document.getElementById('username');
  const tagInput = document.getElementById('tag');
  const gamesOutput = document.getElementById('out2');

  // Manual Fetch Test
  if (fetchBtn && output) {
    fetchBtn.addEventListener('click', async function() {
      // Update button state
      const originalText = fetchBtn.textContent;
      fetchBtn.disabled = true;
      fetchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
      
      // Update output
      output.textContent = 'Fetching data...';
      output.classList.remove('text-success', 'text-danger');
      output.classList.add('text-warning');

      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/hello/');
        const data = await response.json();
        console.log(data);
        
        // Display success
        output.textContent = JSON.stringify(data, null, 2);
        output.classList.remove('text-warning', 'text-danger');
        output.classList.add('text-success');
        
        // Show success notification
        showNotification('Data fetched successfully!', 'success');
      } catch (error) {
        // Display error
        output.textContent = `Error: ${error.message}`;
        output.classList.remove('text-warning', 'text-success');
        output.classList.add('text-danger');
        
        // Show error notification
        showNotification('Failed to fetch data', 'error');
      } finally {
        // Reset button
        fetchBtn.disabled = false;
        fetchBtn.textContent = originalText;
      }
    });
  }

  // Fetch Games by Player
  if (fetchGamesBtn && usernameInput && tagInput && gamesOutput) {
    fetchGamesBtn.addEventListener('click', async function() {
      const username = usernameInput.value.trim();
      const tag = tagInput.value.trim();

      // Validation
      if (!username) {
        showNotification('Please enter a summoner name', 'warning');
        usernameInput.focus();
        return;
      }

      if (!tag) {
        showNotification('Please enter a tag', 'warning');
        tagInput.focus();
        return;
      }

      // Update button state
      const originalText = fetchGamesBtn.textContent;
      fetchGamesBtn.disabled = true;
      fetchGamesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Searching...';
      
      // Update output
      gamesOutput.textContent = `Fetching match history for ${username}#${tag}...`;
      gamesOutput.classList.remove('text-info', 'text-danger');
      gamesOutput.classList.add('text-warning');

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/games/?username=${encodeURIComponent(username)}&tag=${encodeURIComponent(tag)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format and display games
        if (data.games && data.games.length > 0) {
          gamesOutput.textContent = JSON.stringify(data, null, 2);
          gamesOutput.classList.remove('text-warning', 'text-danger');
          gamesOutput.classList.add('text-info');
          showNotification(`Found ${data.games.length} games!`, 'success');
        } else {
          gamesOutput.textContent = 'No games found for this player.';
          gamesOutput.classList.remove('text-warning', 'text-danger');
          gamesOutput.classList.add('text-info');
          showNotification('No games found', 'info');
        }
      } catch (error) {
        // Display error
        gamesOutput.textContent = `Error: ${error.message}\n\nPlease check:\n- Summoner name and tag are correct\n- API endpoint is configured\n- Server is running`;
        gamesOutput.classList.remove('text-warning', 'text-info');
        gamesOutput.classList.add('text-danger');
        
        showNotification('Failed to fetch games', 'error');
      } finally {
        // Reset button
        fetchGamesBtn.disabled = false;
        fetchGamesBtn.textContent = originalText;
      }
    });

    // Allow Enter key to submit
    [usernameInput, tagInput].forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          fetchGamesBtn.click();
        }
      });
    });
  }
});

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