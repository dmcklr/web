// Header-Menü erstellen und einfügen
function createHeader() {
  const username = getUsername();
  
  if (!username) {
    // Kein Username gesetzt - einfaches Menü
    renderSimpleHeader();
    return;
  }
  
  // API-Daten laden für das Menü
  loadApiData((setupData, error) => {
    if (error || !setupData) {
      renderSimpleHeader();
      return;
    }
    
    renderHeaderWithData(setupData);
  });
}

// Einfaches Header ohne Menüpunkte
function renderSimpleHeader() {
  const header = document.createElement('header');
  header.id = 'main-header';
  
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  
  const ul = document.createElement('ul');
  ul.className = 'nav-menu';
  
  // Home Link
  const homeItem = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = 'Home';
  homeItem.appendChild(homeLink);
  ul.appendChild(homeItem);
  
  nav.appendChild(ul);
  header.appendChild(nav);
  
  // Header am Anfang des Body einfügen
  document.body.insertBefore(header, document.body.firstChild);
}

// Header mit Daten rendern
function renderHeaderWithData(setupData) {
  const header = document.createElement('header');
  header.id = 'main-header';
  
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  
  const ul = document.createElement('ul');
  ul.className = 'nav-menu';
  
  // Home Link
  const homeItem = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = 'Home';
  homeItem.appendChild(homeLink);
  ul.appendChild(homeItem);
  
  // Registration Dropdown
  const registrations = getAvailableItems(setupData, 'Registration');
  if (registrations.length > 0) {
    const regItem = createDropdown('Registrations', registrations);
    ul.appendChild(regItem);
  }
  
  // List Dropdown
  const lists = getAvailableItems(setupData, 'List');
  if (lists.length > 0) {
    const listItem = createDropdown('Lists', lists);
    ul.appendChild(listItem);
  }
  
  // Links zu Presenter & Kiosk (als einfacher Link zur Unterseite)
  const presenters = getAvailableItems(setupData, 'Presenter');
  const kiosks = getAvailableItems(setupData, 'Kiosk');
  if (presenters.length > 0 || kiosks.length > 0) {
    const linksItem = document.createElement('li');
    const linksLink = document.createElement('a');
    linksLink.href = 'links.html';
    linksLink.textContent = 'Links';
    linksItem.appendChild(linksLink);
    ul.appendChild(linksItem);
  }
  
  nav.appendChild(ul);
  header.appendChild(nav);
  
  // Header am Anfang des Body einfügen
  document.body.insertBefore(header, document.body.firstChild);
}

// Verfügbare Items für einen Typ finden
function getAvailableItems(setupData, type) {
  const items = [];
  Object.keys(setupData).forEach(key => {
    if (key.startsWith(type) && setupData[key]) {
      items.push({
        key: key,
        label: key.replace(type, type + ' '),
        filename: key.toLowerCase() + '.html'
      });
    }
  });
  return items;
}

// Dropdown-Menü erstellen
function createDropdown(title, items) {
  const dropdownItem = document.createElement('li');
  dropdownItem.className = 'dropdown';
  
  const toggle = document.createElement('span');
  toggle.className = 'dropdown-toggle';
  toggle.textContent = title;
  dropdownItem.appendChild(toggle);
  
  const dropdownMenu = document.createElement('ul');
  dropdownMenu.className = 'dropdown-menu';
  
  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.filename;
    a.textContent = item.label;
    li.appendChild(a);
    dropdownMenu.appendChild(li);
  });
  
  dropdownItem.appendChild(dropdownMenu);
  return dropdownItem;
}

// Header beim Laden der Seite erstellen
document.addEventListener('DOMContentLoaded', createHeader);
