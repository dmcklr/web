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

// Hilfsfunktion: Aktuelle Seite ermitteln
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  return filename.toLowerCase();
}

// Hilfsfunktion: Prüfen ob ein Menü-Item aktiv ist
function isPageInCategory(currentPage, items) {
  return items.some(item => item.filename === currentPage);
}

// Einfaches Header ohne Menüpunkte
function renderSimpleHeader() {
  const header = document.createElement('header');
  header.id = 'main-header';
  header.className = 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg sticky top-0 z-50';
  
  const nav = document.createElement('nav');
  nav.className = 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8';
  
  // Container für Burger und Menü
  const navContainer = document.createElement('div');
  navContainer.className = 'flex items-center justify-between';
  
  // Logo/Home Link (immer sichtbar)
  const logoLink = document.createElement('a');
  logoLink.href = 'index.html';
  logoLink.textContent = 'Sample Event';
  logoLink.className = 'text-white font-bold text-xl py-4';
  navContainer.appendChild(logoLink);
  
  // Burger Button (nur mobil sichtbar)
  const burgerBtn = document.createElement('button');
  burgerBtn.id = 'burger-menu';
  burgerBtn.className = 'md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all';
  burgerBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>`;
  navContainer.appendChild(burgerBtn);
  
  // Desktop Menü (versteckt auf mobil)
  const ul = document.createElement('ul');
  ul.className = 'hidden md:flex items-center space-x-1';
  
  navContainer.appendChild(ul);
  
  // Mobiles Menü (ausklappbar)
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mobile-menu';
  mobileMenu.className = 'hidden md:hidden bg-gradient-to-r from-blue-700 to-purple-700 border-t border-white/10';
  
  const mobileUl = document.createElement('ul');
  mobileUl.className = 'py-2';
  
  mobileMenu.appendChild(mobileUl);
  
  nav.appendChild(navContainer);
  nav.appendChild(mobileMenu);
  header.appendChild(nav);
  
  // Header am Anfang des Body einfügen
  document.body.insertBefore(header, document.body.firstChild);
  
  // Burger Menu Toggle
  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Header mit Daten rendern
function renderHeaderWithData(setupData) {
  const header = document.createElement('header');
  header.id = 'main-header';
  header.className = 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg sticky top-0 z-50';
  
  const nav = document.createElement('nav');
  nav.className = 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8';
  
  // Container für Burger und Menü
  const navContainer = document.createElement('div');
  navContainer.className = 'flex items-center justify-between';
  
  // Logo/Home Link (immer sichtbar)
  const logoLink = document.createElement('a');
  logoLink.href = 'index.html';
  logoLink.textContent = 'Sample Event';
  logoLink.className = 'text-white font-bold text-xl py-4';
  navContainer.appendChild(logoLink);
  
  // Burger Button (nur mobil sichtbar)
  const burgerBtn = document.createElement('button');
  burgerBtn.id = 'burger-menu';
  burgerBtn.className = 'md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all';
  burgerBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>`;
  navContainer.appendChild(burgerBtn);
  
  // Desktop Menü (versteckt auf mobil)
  const ul = document.createElement('ul');
  ul.className = 'hidden md:flex items-center space-x-1';
  
  const currentPage = getCurrentPage();
  
  // Registration Dropdown
  const registrations = getAvailableItems(setupData, 'Registration');
  if (registrations.length > 0) {
    const isActive = isPageInCategory(currentPage, registrations);
    const regItem = createDropdown('Registrations', registrations, isActive);
    ul.appendChild(regItem);
  }
  
  // List Dropdown
  const lists = getAvailableItems(setupData, 'List');
  if (lists.length > 0) {
    const isActive = isPageInCategory(currentPage, lists);
    const listItem = createDropdown('Lists', lists, isActive);
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
    const isLinksActive = currentPage === 'links.html';
    linksLink.className = isLinksActive 
      ? 'block px-4 py-4 text-white font-medium bg-white/20 border-b-2 border-white transition-all duration-200 rounded-t-lg'
      : 'block px-4 py-4 text-white font-medium hover:bg-white/10 transition-all duration-200 rounded-lg';
    linksItem.appendChild(linksLink);
    ul.appendChild(linksItem);
  }
  
  navContainer.appendChild(ul);
  
  // Mobiles Menü (ausklappbar)
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mobile-menu';
  mobileMenu.className = 'hidden md:hidden bg-gradient-to-r from-blue-700 to-purple-700 border-t border-white/10';
  
  const mobileUl = document.createElement('ul');
  mobileUl.className = 'py-2';
  
  // Mobile Registration Items (als Accordion)
  if (registrations.length > 0) {
    const isActive = isPageInCategory(currentPage, registrations);
    const regMobileItem = createMobileAccordion('Registrations', registrations, isActive);
    mobileUl.appendChild(regMobileItem);
  }
  
  // Mobile List Items (als Accordion)
  if (lists.length > 0) {
    const isActive = isPageInCategory(currentPage, lists);
    const listMobileItem = createMobileAccordion('Lists', lists, isActive);
    mobileUl.appendChild(listMobileItem);
  }
  
  // Mobile Links
  if (presenters.length > 0 || kiosks.length > 0) {
    const mobileLinksItem = document.createElement('li');
    const mobileLinksLink = document.createElement('a');
    mobileLinksLink.href = 'links.html';
    mobileLinksLink.textContent = 'Links';
    const isLinksActive = currentPage === 'links.html';
    mobileLinksLink.className = isLinksActive
      ? 'block px-4 py-3 text-white font-bold bg-white/20 border-l-4 border-white transition-all'
      : 'block px-4 py-3 text-white font-medium hover:bg-white/10 transition-all';
    mobileLinksItem.appendChild(mobileLinksLink);
    mobileUl.appendChild(mobileLinksItem);
  }
  
  mobileMenu.appendChild(mobileUl);
  
  nav.appendChild(navContainer);
  nav.appendChild(mobileMenu);
  header.appendChild(nav);
  
  // Header am Anfang des Body einfügen
  document.body.insertBefore(header, document.body.firstChild);
  
  // Burger Menu Toggle
  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
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
function createDropdown(title, items, isActive = false) {
  const dropdownItem = document.createElement('li');
  dropdownItem.className = 'relative group';
  
  const currentPage = getCurrentPage();
  
  const toggle = document.createElement('span');
  // Aktive Hervorhebung: Unterstrich und hellerer Hintergrund
  toggle.className = isActive
    ? 'block px-4 py-4 text-white font-medium bg-white/20 border-b-2 border-white hover:bg-white/10 transition-all duration-200 cursor-pointer rounded-t-lg'
    : 'block px-4 py-4 text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer rounded-lg';
  toggle.textContent = title;
  dropdownItem.appendChild(toggle);
  
  const dropdownMenu = document.createElement('ul');
  dropdownMenu.className = 'absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2';
  
  items.forEach((item, index) => {
    const li = document.createElement('li');
    if (index === 0) {
      li.className = 'first:rounded-t-lg';
    } else if (index === items.length - 1) {
      li.className = 'last:rounded-b-lg';
    }
    
    const isCurrentPage = item.filename === currentPage;
    
    const a = document.createElement('a');
    a.href = item.filename;
    a.textContent = item.label;
    // Aktuelle Seite im Dropdown hervorheben
    a.className = isCurrentPage
      ? 'block px-4 py-3 text-blue-600 bg-blue-50 font-bold transition-colors duration-150'
      : 'block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 font-medium';
    
    li.appendChild(a);
    dropdownMenu.appendChild(li);
  });
  
  dropdownItem.appendChild(dropdownMenu);
  return dropdownItem;
}

// Mobile Accordion-Menü erstellen (für Registrations/Lists im mobilen Menü)
function createMobileAccordion(title, items, isActive = false) {
  const accordionItem = document.createElement('li');
  
  const currentPage = getCurrentPage();
  
  const toggle = document.createElement('button');
  // Aktive Hervorhebung: Border und hellerer Hintergrund
  toggle.className = isActive
    ? 'w-full text-left px-4 py-3 text-white font-bold bg-white/20 border-l-4 border-white hover:bg-white/10 transition-all flex items-center justify-between'
    : 'w-full text-left px-4 py-3 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-between';
  toggle.innerHTML = `
    <span>${title}</span>
    <svg class="w-4 h-4 transform transition-transform accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  `;
  
  const submenu = document.createElement('ul');
  submenu.className = 'hidden bg-white/5 py-1';
  
  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.filename;
    a.textContent = item.label;
    
    const isCurrentPage = item.filename === currentPage;
    // Aktuelle Seite im Mobile-Submenu hervorheben
    a.className = isCurrentPage
      ? 'block px-8 py-2 text-white font-bold bg-white/20 text-sm transition-all'
      : 'block px-8 py-2 text-white/90 text-sm hover:bg-white/10 transition-all';
    
    li.appendChild(a);
    submenu.appendChild(li);
  });
  
  // Toggle Funktionalität
  toggle.addEventListener('click', () => {
    submenu.classList.toggle('hidden');
    const icon = toggle.querySelector('.accordion-icon');
    icon.classList.toggle('rotate-180');
  });
  
  // Wenn die Kategorie aktiv ist, öffne das Accordion automatisch
  if (isActive) {
    submenu.classList.remove('hidden');
    const icon = toggle.querySelector('.accordion-icon');
    icon.classList.add('rotate-180');
  }
  
  accordionItem.appendChild(toggle);
  accordionItem.appendChild(submenu);
  return accordionItem;
}

// Header beim Laden der Seite erstellen
document.addEventListener('DOMContentLoaded', createHeader);
