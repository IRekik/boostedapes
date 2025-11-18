document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const fetchLongestGameWeekBtn = document.getElementById('btn_fetch_longest_game_of_the_week');
  const longestGameWeekBox = document.getElementById('longest_game_of_the_week_box');

  const fetchUserGamesBtn = document.getElementById('fetch_user_games_btn');
  const usernameInput = document.getElementById('username');
  const tagInput = document.getElementById('tag');
  const userGamesBox = document.getElementById('user_games_box');

  // Manual Fetch Test
  if (fetchLongestGameWeekBtn && longestGameWeekBox) {
    fetchLongestGameWeekBtn.addEventListener('click', async function() {
      // Update button state
      const originalText = fetchLongestGameWeekBtn.textContent;
      fetchLongestGameWeekBtn.disabled = true;
      fetchLongestGameWeekBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
      
      // Update output
      longestGameWeekBox.textContent = 'Fetching data...';
      longestGameWeekBox.classList.remove('text-success', 'text-danger');
      longestGameWeekBox.classList.add('text-warning');

      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/get_champion_rotation/');
        const data = await response.json();

        // Display success
        longestGameWeekBox.textContent = JSON.stringify(data, null, 2);
        longestGameWeekBox.classList.remove('text-warning', 'text-danger');
        longestGameWeekBox.classList.add('text-success');
        
        // Show success notification
        showNotification('Data fetched successfully!', 'success');
      } catch (error) {
        // Display error
        longestGameWeekBox.textContent = `Error: ${error.message}`;
        longestGameWeekBox.classList.remove('text-warning', 'text-success');
        longestGameWeekBox.classList.add('text-danger');
        
        // Show error notification
        showNotification('Failed to fetch data', 'error');
      } finally {
        // Reset button
        fetchLongestGameWeekBtn.disabled = false;
        fetchLongestGameWeekBtn.textContent = originalText;
      }
    });
  }

  // Fetch Games by Player
  if (fetchUserGamesBtn && usernameInput && tagInput && userGamesBox) {
    fetchUserGamesBtn.addEventListener('click', async function() {
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
      const originalText = fetchUserGamesBtn.textContent;
      fetchUserGamesBtn.disabled = true;
      fetchUserGamesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Searching...';
      
      // Update output
      userGamesBox.textContent = `Fetching match history for ${username}#${tag}...`;
      userGamesBox.classList.remove('text-info', 'text-danger');
      userGamesBox.classList.add('text-warning');

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/games/?username=${encodeURIComponent(username)}&tag=${encodeURIComponent(tag)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format and display games
        if (data) {
          userGamesBox.textContent = JSON.stringify(data, null, 2);
          userGamesBox.classList.remove('text-warning', 'text-danger');
          userGamesBox.classList.add('text-info');
          showNotification(`Found ${data.length} games!`, 'success');
        } else {
          userGamesBox.textContent = 'No games found for this player.';
          userGamesBox.classList.remove('text-warning', 'text-danger');
          userGamesBox.classList.add('text-info');
          showNotification('No games found', 'info');
        }
      } catch (error) {
        // Display error
        userGamesBox.textContent = `Error: ${error.message}\n\nPlease check:\n- Summoner name and tag are correct\n- API endpoint is configured\n- Server is running`;
        userGamesBox.classList.remove('text-warning', 'text-info');
        userGamesBox.classList.add('text-danger');
        
        showNotification('Failed to fetch games', 'error');
      } finally {
        // Reset button
        fetchUserGamesBtn.disabled = false;
        fetchUserGamesBtn.textContent = originalText;
      }
    });

    // Allow Enter key to submit
    [usernameInput, tagInput].forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          fetchUserGamesBtn.click();
        }
      });
    });
  }
});
