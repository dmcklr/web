// Zentrale API-Loader Funktion
const API_URL = 'https://api.raceresult.com/390351/YDXQ614X0VBQSI53DT2GIBJC2YN9IMTQ';
const DEFAULT_USERNAME = 'default';

// Cache für API-Daten (nur im RAM, wird beim Seitenwechsel geleert)
let apiDataCache = null;
let apiLoadingPromise = null;
let pendingCallbacks = [];

// Username aus URL-Parameter setzen oder aus localStorage holen
function getUsername() {
    const urlParams = new URLSearchParams(window.location.search);
    const firstnameParam = urlParams.get('u');
    
    // 1) URL-Parameter prüfen
    if (firstnameParam) {
        const oldUsername = localStorage.getItem('Username');
        localStorage.setItem('Username', firstnameParam);
        
        // Cache leeren wenn sich der Username geändert hat
        if (oldUsername !== firstnameParam) {
            apiDataCache = null;
            apiLoadingPromise = null;
            pendingCallbacks = [];
            console.log('Cache cleared - Username changed to:', firstnameParam);
        }
        
        console.log('Username from URL parameter:', firstnameParam);
        return firstnameParam;
    }
    
    // 2) localStorage prüfen
    const storedUsername = localStorage.getItem('Username');
    if (storedUsername) {
        console.log('Username from localStorage:', storedUsername);
        return storedUsername;
    }
    
    // 3) Fallback auf "default" User
    console.log('No username found, using default user');
    localStorage.setItem('Username', DEFAULT_USERNAME);
    return DEFAULT_USERNAME;
}

// API-Daten für aktuellen Username laden (mit Caching und Callback-Queue)
function loadApiData(callback) {
    const username = getUsername();
    
    // Wenn Daten bereits im Cache sind und der Username passt, diese verwenden
    if (apiDataCache && apiDataCache.username === username) {
        console.log('Using cached API data for:', username);
        callback(apiDataCache.data, null);
        return;
    }
    
    // Wenn bereits ein API-Call läuft, Callback zur Warteschlange hinzufügen
    if (apiLoadingPromise) {
        console.log('Adding callback to queue (API call already in progress)');
        pendingCallbacks.push(callback);
        return;
    }
    
    // Ersten Callback zur Warteschlange hinzufügen
    pendingCallbacks.push(callback);
    
    // Neuer API-Call
    console.log('Starting new API call for:', username);
    apiLoadingPromise = fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const matchingEntry = Array.isArray(data) 
                ? data.find(entry => entry.Firstname === username)
                : (data.Firstname === username ? data : null);
            
            if (matchingEntry) {
                // Daten im Cache speichern
                apiDataCache = {
                    username: username,
                    data: matchingEntry,
                    timestamp: Date.now()
                };
                console.log('API data loaded and cached for:', username, '- notifying', pendingCallbacks.length, 'callback(s)');
                
                // Alle wartenden Callbacks benachrichtigen
                const callbacks = [...pendingCallbacks];
                pendingCallbacks = [];
                callbacks.forEach(cb => cb(matchingEntry, null));
            } else {
                console.log('No data found for:', username);
                const callbacks = [...pendingCallbacks];
                pendingCallbacks = [];
                callbacks.forEach(cb => cb(null, `No data found for "${username}".`));
            }
            
            apiLoadingPromise = null;
        })
        .catch(error => {
            console.error('Error loading API:', error);
            
            // Alle wartenden Callbacks über Fehler benachrichtigen
            const callbacks = [...pendingCallbacks];
            pendingCallbacks = [];
            callbacks.forEach(cb => cb(null, 'Error loading data from API. Please try again later.'));
            
            apiLoadingPromise = null;
        });
}

// List-Widget rendern
function renderListWidget(setupData, listKey, containerId) {
    const container = document.getElementById(containerId);
    
    if (!setupData[listKey] || !setupData.IdEvent) {
        container.innerHTML = `<p>No ${listKey} data available for this user.</p>`;
        return;
    }
    
    const listCode = setupData[listKey];
    const eventId = setupData.IdEvent;
    
    // Code anpassen: EventID ersetzen
    const adjustedCode = listCode.replace(/\b\d{6}\b/g, eventId);
    
    // Code ausführen
    setTimeout(() => {
        try {
            eval(adjustedCode);
            // Optional: ShowTimerLogo und ShowInfoText hinzufügen
            if (typeof rrp !== 'undefined') {
                rrp.ShowTimerLogo = true;
                rrp.ShowInfoText = false;
            }
            console.log(`${listKey} loaded with EventID:`, eventId);
        } catch (error) {
            console.error(`Error loading ${listKey}:`, error);
        }
    }, 100);
}

// Registration-Widget rendern
function renderRegistrationWidget(setupData, registrationKey, containerId) {
    const container = document.getElementById(containerId);
    
    if (!setupData[registrationKey]) {
        container.innerHTML = `<p>No ${registrationKey} data available for this user.</p>`;
        return;
    }
    
    // Script-Tag für die Variablen erstellen
    const varsScript = document.createElement('script');
    varsScript.type = 'text/javascript';
    varsScript.innerHTML = '<!--\n' + setupData[registrationKey] + '\n-->';
    container.appendChild(varsScript);
    
    // init.js Script laden
    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.src = 'https://events2.raceresult.com/registrations/init.js?lang=en-us';
    container.appendChild(initScript);
    
    console.log(`${registrationKey} loaded`);
}
