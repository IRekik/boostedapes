document.addEventListener('DOMContentLoaded', function() {
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
        const response = await fetch('/api/get_champion_rotation/');
        const data = await response.json();

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
