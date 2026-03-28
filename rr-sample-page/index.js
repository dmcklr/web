// API-Daten laden und Setup initialisieren
function loadSetup() {
  const username = getUsername();
  console.log('Loading setup for username:', username);
  
  // API-Daten mit zentraler Funktion laden
  loadApiData((setupData, error) => {
    if (error) {
      document.getElementById('welcome-message').textContent = error;
      return;
    }
    
    if (setupData) {
      showWelcomeMessage(setupData, username);
    }
  });
}

// Willkommensnachricht anzeigen
function showWelcomeMessage(setupData, username) {
  const messageElement = document.getElementById('welcome-message');
  if (messageElement) {
    const name = setupData.Firstname || 'User';
    const eventId = setupData.IdEvent || 'N/A';
    
    // Hinweis wenn "default" User verwendet wird
    const userInfo = username === 'default' 
      ? '<p style="color: #666; font-size: 0.9em;">You are viewing the default configuration. Add <code>?u=YourName</code> to the URL to load your personal setup.</p>'
      : '';
    
    messageElement.innerHTML = `
      <p>Setup loaded successfully for <strong>${name}</strong>!</p>
      <p>Event ID: <strong>${eventId}</strong></p>
      ${userInfo}
      <p>Use the navigation menu above to access:</p>
      <ul style="text-align: left; display: inline-block; margin-top: 10px;">
        <li>Registration forms</li>
        <li>Participant lists</li>
        <li>External links (Presenters & Kiosks)</li>
      </ul>
    `;
  }
}

// Setup beim Laden der Seite initialisieren
document.addEventListener('DOMContentLoaded', loadSetup);
