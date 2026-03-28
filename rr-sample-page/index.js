// API-Daten laden und Setup initialisieren
function loadSetup() {
  const username = getUsername();
  
  if (!username) {
    document.getElementById('welcome-message').textContent = 
      'No username set. Please add the parameter ?u=YourName to the URL to load your setup.';
    return;
  }
  
  // API-Daten mit zentral er Funktion laden
  loadApiData((setupData, error) => {
    if (error) {
      document.getElementById('welcome-message').textContent = error;
      return;
    }
    
    if (setupData) {
      showWelcomeMessage(setupData);
    }
  });
}

// Willkommensnachricht anzeigen
function showWelcomeMessage(setupData) {
  const messageElement = document.getElementById('welcome-message');
  if (messageElement) {
    const name = setupData.Firstname || 'User';
    const eventId = setupData.IdEvent || 'N/A';
    messageElement.innerHTML = `
      <p>Setup loaded successfully for <strong>${name}</strong>!</p>
      <p style="display: inline;">Event ID: <strong>${eventId}</strong></p>
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
