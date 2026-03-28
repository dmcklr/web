// Zentrale API-Loader Funktion
const API_URL = 'https://api.raceresult.com/390351/YDXQ614X0VBQSI53DT2GIBJC2YN9IMTQ';

// Cache für API-Daten (nur im RAM, wird beim Seitenwechsel geleert)
let apiDataCache = null;
let apiLoadingPromise = null;

// Username aus URL-Parameter setzen oder aus Session Storage holen
function getUsername() {
    const urlParams = new URLSearchParams(window.location.search);
    const firstnameParam = urlParams.get('u');
    
    // Wenn u Parameter vorhanden, Username im Session Storage speichern und Cache leeren
    if (firstnameParam) {
        const oldUsername = sessionStorage.getItem('Username');
        sessionStorage.setItem('Username', firstnameParam);
        
        // Cache leeren wenn sich der Username geändert hat
        if (oldUsername !== firstnameParam) {
            apiDataCache = null;
            apiLoadingPromise = null;
            console.log('Cache cleared - Username changed to:', firstnameParam);
        }
        
        return firstnameParam;
    }
    
    // Sonst aus Session Storage holen
    return sessionStorage.getItem('Username');
}

// API-Daten für aktuellen Username laden (mit Caching)
function loadApiData(callback) {
    const username = getUsername();
    
    if (!username) {
        callback(null, 'No username set. Please add parameter ?u=YourName to the URL.');
        return;
    }
    
    // Wenn Daten bereits im Cache sind und der Username passt, diese verwenden
    if (apiDataCache && apiDataCache.username === username) {
        console.log('Using cached API data for:', username);
        callback(apiDataCache.data, null);
        return;
    }
    
    // Wenn bereits ein API-Call läuft, darauf warten
    if (apiLoadingPromise) {
        console.log('Waiting for ongoing API call...');
        apiLoadingPromise.then(() => {
            if (apiDataCache && apiDataCache.username === username) {
                callback(apiDataCache.data, null);
            } else {
                callback(null, 'Error loading data from cache.');
            }
        });
        return;
    }
    
    // Neuer API-Call
    console.log('Loading API data from server for:', username);
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
                console.log('API data loaded and cached for:', username);
                callback(matchingEntry, null);
            } else {
                callback(null, `No data found for "${username}".`);
            }
            apiLoadingPromise = null;
        })
        .catch(error => {
            console.error('Error loading API:', error);
            callback(null, 'Error loading data from API. Please try again later.');
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
