/**
 * PORTAL MULTIVERSO - RICK & MORTY SYSTEM
 * Pure Javascript SPA (Single Page Application)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ================= STATE MANAGEMENT =================
  const state = {
    activeSession: null, // { email, name }
    currentTab: 'characters', // 'characters' | 'episodes' | 'profile'
    theme: 'dark', // 'light' | 'dark'
    
    // Caches loaded from localStorage
    characters: [],
    episodes: [],
    
    // Featured Character of the Day
    featuredCharacter: null,
    
    // Filters & Sorting state
    characterFilters: {
      search: '',
      status: '',
      gender: '',
      sortBy: 'id',
      sortDir: 'asc' // 'asc' | 'desc'
    },
    episodeFilters: {
      search: '',
      sortBy: 'id',
      sortDir: 'asc' // 'asc' | 'desc'
    },
    
    // Drawer state
    activeDrawerItem: null, // character or episode object
    activeDrawerType: 'character', // 'character' | 'episode'
    isEditingDrawer: false
  };

  // Mock User Database in LocalStorage
  const DEFAULT_USERS = [
    { email: 'admin@ucab.com', name: 'Rick Sanchez', password: 'password123' },
    { email: 'morty@smith.com', name: 'Morty Smith', password: 'password123' }
  ];

  // Pre-load default users if not set
  if (!localStorage.getItem('ram_users')) {
    localStorage.setItem('ram_users', JSON.stringify(DEFAULT_USERS));
  }

  // ================= DOM ELEMENT REFERENCES =================
  const DOM = {
    // Auth elements
    authContainer: document.getElementById('auth-container'),
    loginCard: document.getElementById('login-card'),
    registerCard: document.getElementById('register-card'),
    recoverCard: document.getElementById('recover-card'),
    
    // Forms
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    recoverForm: document.getElementById('recover-form'),
    changePasswordForm: document.getElementById('change-password-form'),
    
    // Form buttons/toggles
    goRegisterBtn: document.getElementById('go-register-btn'),
    goLoginBtn: document.getElementById('go-login-btn'),
    goRecoverBtn: document.getElementById('go-recover-btn'),
    recoverBackToLogin: document.getElementById('recover-back-to-login'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Dashboard elements
    dashboardContainer: document.getElementById('dashboard-container'),
    offlineBanner: document.getElementById('offline-banner'),
    connBadge: document.getElementById('conn-badge'),
    themeToggle: document.getElementById('theme-toggle'),
    themeSunIcon: document.getElementById('theme-sun-icon'),
    themeMoonIcon: document.getElementById('theme-moon-icon'),
    
    // Navigation Tabs
    tabCharactersBtn: document.getElementById('tab-characters-btn'),
    tabEpisodesBtn: document.getElementById('tab-episodes-btn'),
    navProfileBtn: document.getElementById('nav-profile-btn'),
    navProfileName: document.getElementById('nav-profile-name'),
    navProfileAvatar: document.getElementById('nav-profile-avatar'),
    
    // Main Content Sections
    featuredSection: document.getElementById('featured-section'),
    charactersSection: document.getElementById('characters-section'),
    episodesSection: document.getElementById('episodes-section'),
    profileSection: document.getElementById('profile-section'),
    
    // Featured UI details
    featuredImg: document.getElementById('featured-img'),
    featuredName: document.getElementById('featured-name'),
    featuredSpecies: document.getElementById('featured-species'),
    featuredGender: document.getElementById('featured-gender'),
    featuredStatusPill: document.getElementById('featured-status-pill'),
    featuredOrigin: document.getElementById('featured-origin'),
    featuredDetailsBtn: document.getElementById('featured-details-btn'),
    
    // Characters Filter controls
    characterSearch: document.getElementById('character-search'),
    characterStatusFilter: document.getElementById('character-status-filter'),
    characterGenderFilter: document.getElementById('character-gender-filter'),
    characterSortBy: document.getElementById('character-sort-by'),
    characterSortDirBtn: document.getElementById('character-sort-dir-btn'),
    sortAscIcon: document.getElementById('sort-asc-icon'),
    sortDescIcon: document.getElementById('sort-desc-icon'),
    charactersGrid: document.getElementById('characters-grid'),
    charactersFeedback: document.getElementById('characters-feedback'),
    
    // Episodes Filter controls
    episodeSearch: document.getElementById('episode-search'),
    episodeSortBy: document.getElementById('episode-sort-by'),
    episodeSortDirBtn: document.getElementById('episode-sort-dir-btn'),
    epSortAscIcon: document.getElementById('ep-sort-asc-icon'),
    epSortDescIcon: document.getElementById('ep-sort-desc-icon'),
    episodesTableBody: document.getElementById('episodes-table-body'),
    episodesFeedback: document.getElementById('episodes-feedback'),
    
    // Profile UI details
    profileBigAvatar: document.getElementById('profile-big-avatar'),
    profileDisplayName: document.getElementById('profile-display-name'),
    profileDisplayEmail: document.getElementById('profile-display-email'),
    
    // Drawer elements
    detailDrawer: document.getElementById('detail-drawer'),
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    drawerPanel: document.getElementById('drawer-panel'),
    drawerTitle: document.getElementById('drawer-title'),
    drawerCloseBtn: document.getElementById('drawer-close-btn'),
    drawerToggleEditBtn: document.getElementById('drawer-toggle-edit-btn'),
    
    // Drawer Detail elements
    drawerViewMode: document.getElementById('drawer-view-mode'),
    drawerDetailImgContainer: document.getElementById('drawer-detail-img-container'),
    drawerDetailImg: document.getElementById('drawer-detail-img'),
    drawerDetailName: document.getElementById('drawer-detail-name'),
    drawerDetailStatusWrapper: document.getElementById('drawer-detail-status-wrapper'),
    drawerSpecificationsGrid: document.getElementById('drawer-specifications-grid'),
    drawerListTitle: document.getElementById('drawer-list-title'),
    drawerListContent: document.getElementById('drawer-list-content'),
    
    // Drawer Edit elements
    drawerEditForm: document.getElementById('drawer-edit-form'),
    drawerEditInputs: document.getElementById('drawer-edit-inputs'),
    drawerCancelEditBtn: document.getElementById('drawer-cancel-edit-btn'),
    
    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // ================= THEME ENGINE =================
  function initTheme() {
    const savedTheme = localStorage.getItem('ram_theme') || 'dark';
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('ram_theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      DOM.themeSunIcon.classList.remove('hidden');
      DOM.themeMoonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      DOM.themeSunIcon.classList.add('hidden');
      DOM.themeMoonIcon.classList.remove('hidden');
    }
  }

  DOM.themeToggle.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // ================= TOAST NOTIFICATION SYSTEM =================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    let borderClass = 'info-border';
    if (type === 'success') borderClass = 'success-border';
    else if (type === 'error') borderClass = 'error-border';

    toast.className = `toast-alert-card ${borderClass}`;
    
    // Toast icon based on type
    let icon = '';
    if (type === 'success') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>`;
    } else if (type === 'error') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>`;
    } else {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>`;
    }

    toast.innerHTML = `
      <div class="toast-message-body">
        <div class="toast-icon-wrapper">${icon}</div>
        <span class="toast-alert-text">${message}</span>
      </div>
      <button class="toast-close-action-btn" aria-label="Cerrar notificación">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    DOM.toastContainer.appendChild(toast);
    
    // Trigger transition
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto close
    setTimeout(() => {
      removeToast(toast);
    }, 4000);
  }

  function removeToast(toast) {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // ================= MOCK USER AUTHENTICATION =================
  function loadSession() {
    const session = localStorage.getItem('ram_active_session');
    if (session) {
      state.activeSession = JSON.parse(session);
      return true;
    }
    return false;
  }

  function saveSession(user) {
    state.activeSession = { email: user.email, name: user.name };
    localStorage.setItem('ram_active_session', JSON.stringify(state.activeSession));
  }

  function clearSession() {
    state.activeSession = null;
    localStorage.removeItem('ram_active_session');
  }

  function updateRouter() {
    if (state.activeSession) {
      DOM.authContainer.classList.add('hidden');
      DOM.dashboardContainer.classList.remove('hidden');
      
      // Update User Panel info
      DOM.navProfileName.textContent = state.activeSession.name;
      DOM.navProfileAvatar.textContent = state.activeSession.name.charAt(0).toUpperCase();
      DOM.profileBigAvatar.textContent = state.activeSession.name.charAt(0).toUpperCase();
      DOM.profileDisplayName.textContent = state.activeSession.name;
      DOM.profileDisplayEmail.textContent = state.activeSession.email;
      
      // Render Content view
      renderDashboardView();
    } else {
      DOM.authContainer.classList.remove('hidden');
      DOM.dashboardContainer.classList.add('hidden');
      showCard('login');
    }
  }

  function showCard(cardName) {
    DOM.loginCard.classList.add('hidden');
    DOM.registerCard.classList.add('hidden');
    DOM.recoverCard.classList.add('hidden');
    
    if (cardName === 'login') DOM.loginCard.classList.remove('hidden');
    else if (cardName === 'register') DOM.registerCard.classList.remove('hidden');
    else if (cardName === 'recover') DOM.recoverCard.classList.remove('hidden');
  }

  // Navigation Links
  DOM.goRegisterBtn.addEventListener('click', () => showCard('register'));
  DOM.goLoginBtn.addEventListener('click', () => showCard('login'));
  DOM.goRecoverBtn.addEventListener('click', () => showCard('recover'));
  DOM.recoverBackToLogin.addEventListener('click', () => showCard('login'));

  // Form Validations & Submissions
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showInputError(inputEl, message) {
    const errorContainer = inputEl.nextElementSibling;
    if (errorContainer && errorContainer.classList.contains('error-msg')) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('hidden');
      inputEl.classList.add('border-red-500', 'focus:border-red-500');
    }
  }

  function clearInputErrors(formEl) {
    const errors = formEl.querySelectorAll('.error-msg');
    errors.forEach(err => err.classList.add('hidden'));
    const inputs = formEl.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('border-red-500', 'focus:border-red-500'));
  }

  // Submit Login
  DOM.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInputErrors(DOM.loginForm);
    
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    let valid = true;

    if (!email) {
      showInputError(document.getElementById('login-email'), 'El correo es obligatorio');
      valid = false;
    } else if (!validateEmail(email)) {
      showInputError(document.getElementById('login-email'), 'El formato del correo es inválido');
      valid = false;
    }

    if (!pass) {
      showInputError(document.getElementById('login-password'), 'La contraseña es obligatoria');
      valid = false;
    }

    if (!valid) return;

    // Check credentials
    const users = JSON.parse(localStorage.getItem('ram_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (user) {
      saveSession(user);
      updateRouter();
      showToast(`¡Bienvenido de vuelta, ${user.name}!`, 'success');
      DOM.loginForm.reset();
    } else {
      showToast('Credenciales incorrectas. Intenta de nuevo.', 'error');
    }
  });

  // Submit Register
  DOM.registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInputErrors(DOM.registerForm);

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const pass = document.getElementById('register-password').value;
    const confirmPass = document.getElementById('register-confirm-password').value;
    let valid = true;

    if (!name || name.length < 3) {
      showInputError(document.getElementById('register-name'), 'Nombre de usuario mínimo 3 caracteres');
      valid = false;
    }

    if (!email) {
      showInputError(document.getElementById('register-email'), 'El correo es obligatorio');
      valid = false;
    } else if (!validateEmail(email)) {
      showInputError(document.getElementById('register-email'), 'El formato del correo es inválido');
      valid = false;
    }

    if (!pass || pass.length < 6) {
      showInputError(document.getElementById('register-password'), 'Contraseña mínimo de 6 caracteres');
      valid = false;
    }

    if (pass !== confirmPass) {
      showInputError(document.getElementById('register-confirm-password'), 'Las contraseñas no coinciden');
      valid = false;
    }

    if (!valid) return;

    const users = JSON.parse(localStorage.getItem('ram_users') || '[]');
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      showToast('Este correo ya está registrado.', 'error');
      showInputError(document.getElementById('register-email'), 'El correo ya se encuentra en uso');
      return;
    }

    // Register User
    users.push({ email, name, password: pass });
    localStorage.setItem('ram_users', JSON.stringify(users));
    
    showToast('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
    DOM.registerForm.reset();
    showCard('login');
  });

  // Submit Password Recovery
  DOM.recoverForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInputErrors(DOM.recoverForm);

    const email = document.getElementById('recover-email').value.trim();
    if (!email) {
      showInputError(document.getElementById('recover-email'), 'El correo es obligatorio');
      return;
    } else if (!validateEmail(email)) {
      showInputError(document.getElementById('recover-email'), 'El formato del correo es inválido');
      return;
    }

    // Simulate recovery coordinates dispatch
    showToast(`Se han enviado las coordenadas de reinicio al correo: ${email}`, 'success');
    DOM.recoverForm.reset();
    showCard('login');
  });

  // Submit Password Change (Profile Section)
  DOM.changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInputErrors(DOM.changePasswordForm);

    const currPass = document.getElementById('change-password-curr').value;
    const newPass = document.getElementById('change-password-new').value;
    const confirmNewPass = document.getElementById('change-password-confirm').value;
    let valid = true;

    if (!currPass) {
      showInputError(document.getElementById('change-password-curr'), 'Contraseña actual obligatoria');
      valid = false;
    }

    if (!newPass || newPass.length < 6) {
      showInputError(document.getElementById('change-password-new'), 'Nueva contraseña mínimo de 6 caracteres');
      valid = false;
    }

    if (newPass !== confirmNewPass) {
      showInputError(document.getElementById('change-password-confirm'), 'Las contraseñas no coinciden');
      valid = false;
    }

    if (!valid) return;

    const users = JSON.parse(localStorage.getItem('ram_users') || '[]');
    const userIdx = users.findIndex(u => u.email.toLowerCase() === state.activeSession.email.toLowerCase());

    if (userIdx !== -1 && users[userIdx].password === currPass) {
      users[userIdx].password = newPass;
      localStorage.setItem('ram_users', JSON.stringify(users));
      showToast('¡Contraseña cambiada con éxito!', 'success');
      DOM.changePasswordForm.reset();
    } else {
      showToast('La contraseña actual es incorrecta.', 'error');
      showInputError(document.getElementById('change-password-curr'), 'Contraseña incorrecta');
    }
  });

  // Logout Button
  DOM.logoutBtn.addEventListener('click', () => {
    clearSession();
    updateRouter();
    showToast('Sesión cerrada correctamente.', 'info');
  });


  // ================= CLIENT DATA & OFFLINE ENGINE =================
  const STATIC_CHARACTERS = [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', type: 'Super Scientist', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg', origin: { name: 'Earth (C-137)' }, location: { name: 'Citadel of Ricks' }, episode: ['https://rickandmortyapi.com/api/episode/1'] },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male', type: '', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg', origin: { name: 'unknown' }, location: { name: 'Citadel of Ricks' }, episode: ['https://rickandmortyapi.com/api/episode/1'] },
    { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human', gender: 'Female', type: '', image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg', origin: { name: 'Earth (Replacement Dimension)' }, location: { name: 'Earth (Replacement Dimension)' }, episode: ['https://rickandmortyapi.com/api/episode/6'] },
    { id: 4, name: 'Beth Smith', status: 'Alive', species: 'Human', gender: 'Female', type: '', image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg', origin: { name: 'Earth (Replacement Dimension)' }, location: { name: 'Earth (Replacement Dimension)' }, episode: ['https://rickandmortyapi.com/api/episode/6'] },
    { id: 5, name: 'Jerry Smith', status: 'Alive', species: 'Human', gender: 'Male', type: '', image: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg', origin: { name: 'Earth (Replacement Dimension)' }, location: { name: 'Earth (Replacement Dimension)' }, episode: ['https://rickandmortyapi.com/api/episode/6'] }
  ];

  const STATIC_EPISODES = [
    { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] },
    { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] },
    { id: 3, name: 'Anatomy Park', air_date: 'December 16, 2013', episode: 'S01E03', characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] },
    { id: 4, name: 'M. Night Shaym-Aliens!', air_date: 'January 13, 2014', episode: 'S01E04', characters: ['https://rickandmortyapi.com/api/character/1'] }
  ];

  // Connection Event Listeners
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);

  function updateConnectionStatus() {
    if (navigator.onLine) {
      DOM.connBadge.className = "connection-badge online glass-container";
      DOM.connBadge.innerHTML = `<span class="dot animate-pulse"></span>Online`;
      DOM.offlineBanner.classList.add('hidden');
      showToast('Conexión reestablecida.', 'success');
      syncWithAPI();
    } else {
      DOM.connBadge.className = "connection-badge offline glass-container";
      DOM.connBadge.innerHTML = `<span class="dot animate-pulse"></span>Offline`;
      DOM.offlineBanner.classList.remove('hidden');
      showToast('Estás operando sin conexión a Internet.', 'error');
    }

    // Dynamically toggle drawer badge if editing
    if (state.isEditingDrawer) {
      setupEditFormInputs();
    }
  }

  async function loadInitialData() {
    // 1. Try to fetch from the API first if online
    if (navigator.onLine) {
      try {
        showToast('Sincronizando con la API del multiverso...', 'info');
        await syncWithAPI();
        return;
      } catch (err) {
        console.warn('API Sync fallida, cargando desde cache local:', err);
      }
    }

    // 2. Load from cache if offline or fetch failed
    const cachedChars = localStorage.getItem('ram_characters_cache');
    const cachedEps = localStorage.getItem('ram_episodes_cache');

    if (cachedChars && cachedEps) {
      state.characters = JSON.parse(cachedChars);
      state.episodes = JSON.parse(cachedEps);
      
      // Patch custom local edits on top of cache, just in case they were not merged
      const localCharEdits = JSON.parse(localStorage.getItem('ram_custom_characters') || '[]');
      const localEpEdits = JSON.parse(localStorage.getItem('ram_custom_episodes') || '[]');

      state.characters = state.characters.map(cachedChar => {
        const localEdit = localCharEdits.find(e => e.id === cachedChar.id);
        return localEdit ? { ...cachedChar, ...localEdit } : cachedChar;
      });

      state.episodes = state.episodes.map(cachedEp => {
        const localEdit = localEpEdits.find(e => e.id === cachedEp.id);
        return localEdit ? { ...cachedEp, ...localEdit } : cachedEp;
      });

      setFeaturedCharacter();
      showToast('Cargado desde el cache local.', 'success');
      return;
    }

    // 3. Fallback to static if offline and no cache
    state.characters = STATIC_CHARACTERS;
    state.episodes = STATIC_EPISODES;
    localStorage.setItem('ram_characters_cache', JSON.stringify(STATIC_CHARACTERS));
    localStorage.setItem('ram_episodes_cache', JSON.stringify(STATIC_EPISODES));
    setFeaturedCharacter();
    showToast('Operando con catálogo de respaldo offline.', 'warning');
  }

  async function syncWithAPI() {
    try {
      // Fetch characters pages 1 and 2 to get 40 characters
      const charRes1 = await fetch('https://rickandmortyapi.com/api/character');
      const charData1 = await charRes1.json();
      
      const charRes2 = await fetch('https://rickandmortyapi.com/api/character?page=2');
      const charData2 = await charRes2.json();
      
      let characters = [...charData1.results, ...charData2.results];

      // Fetch episodes page 1 (20 episodes)
      const epRes = await fetch('https://rickandmortyapi.com/api/episode');
      const epData = await epRes.json();
      let episodes = epData.results;

      // Merge existing local edits if any
      const localCharEdits = JSON.parse(localStorage.getItem('ram_custom_characters') || '[]');
      const localEpEdits = JSON.parse(localStorage.getItem('ram_custom_episodes') || '[]');

      characters = characters.map(apiChar => {
        const localEdit = localCharEdits.find(e => e.id === apiChar.id);
        return localEdit ? { ...apiChar, ...localEdit } : apiChar;
      });

      episodes = episodes.map(apiEp => {
        const localEdit = localEpEdits.find(e => e.id === apiEp.id);
        return localEdit ? { ...apiEp, ...localEdit } : apiEp;
      });

      state.characters = characters;
      state.episodes = episodes;

      localStorage.setItem('ram_characters_cache', JSON.stringify(characters));
      localStorage.setItem('ram_episodes_cache', JSON.stringify(episodes));
      
      setFeaturedCharacter();
      renderDashboardView();
      showToast('Base de datos sincronizada correctamente.', 'success');
    } catch (err) {
      console.error('API Fetching failed, falling back to local copies: ', err);
      // Fallback
      if (!state.characters.length) {
        state.characters = STATIC_CHARACTERS;
        state.episodes = STATIC_EPISODES;
        setFeaturedCharacter();
      }
      throw err; // Rethrow to propagate error to loadInitialData
    }
  }

  function setFeaturedCharacter() {
    if (state.characters && state.characters.length > 0) {
      // Pick random character
      const idx = Math.floor(Math.random() * state.characters.length);
      state.featuredCharacter = state.characters[idx];
      renderFeaturedCharacter();
    }
  }

  // ================= ROUTING & RENDER CONTROLLERS =================
  
  // Tab triggers
  DOM.tabCharactersBtn.addEventListener('click', () => switchTab('characters'));
  DOM.tabEpisodesBtn.addEventListener('click', () => switchTab('episodes'));
  DOM.navProfileBtn.addEventListener('click', () => switchTab('profile'));
  
  function switchTab(tab) {
    state.currentTab = tab;
    
    // Style tabs
    DOM.tabCharactersBtn.className = 'tab-nav-btn' + (tab === 'characters' ? ' active-tab' : '');
    DOM.tabEpisodesBtn.className = 'tab-nav-btn' + (tab === 'episodes' ? ' active-tab' : '');
    DOM.navProfileBtn.className = 'nav-profile-trigger' + (tab === 'profile' ? ' active-profile' : '');

    renderDashboardView();
  }

  function renderDashboardView() {
    DOM.charactersSection.classList.add('hidden');
    DOM.episodesSection.classList.add('hidden');
    DOM.profileSection.classList.add('hidden');
    DOM.featuredSection.classList.add('hidden');

    if (state.currentTab === 'characters') {
      DOM.featuredSection.classList.remove('hidden');
      DOM.charactersSection.classList.remove('hidden');
      renderCharactersList();
    } else if (state.currentTab === 'episodes') {
      DOM.episodesSection.classList.remove('hidden');
      renderEpisodesList();
    } else if (state.currentTab === 'profile') {
      DOM.profileSection.classList.remove('hidden');
    }
  }

  // ================= VIEW: FEATURED CHARACTER =================
  function renderFeaturedCharacter() {
    const char = state.featuredCharacter;
    if (!char) return;

    DOM.featuredImg.src = char.image;
    DOM.featuredName.textContent = char.name;
    DOM.featuredSpecies.textContent = char.species || 'N/A';
    DOM.featuredGender.textContent = char.gender || 'N/A';
    DOM.featuredOrigin.textContent = `Origen: ${char.origin?.name || 'Unknown'}`;

    // Status styling
    const stat = char.status.toLowerCase();
    DOM.featuredStatusPill.className = `hero-status-tag ${stat}`;
    DOM.featuredStatusPill.innerHTML = `
      <span class="status-dot"></span>
      ${char.status}
    `;
  }

  DOM.featuredDetailsBtn.addEventListener('click', () => {
    if (state.featuredCharacter) {
      openDrawer(state.featuredCharacter, 'character');
    }
  });


  // ================= VIEW: CHARACTERS CATALOG =================
  
  // Real-time search/filters event binding
  DOM.characterSearch.addEventListener('input', () => {
    state.characterFilters.search = DOM.characterSearch.value.trim().toLowerCase();
    renderCharactersList();
  });
  
  DOM.characterStatusFilter.addEventListener('change', () => {
    state.characterFilters.status = DOM.characterStatusFilter.value;
    renderCharactersList();
  });

  DOM.characterGenderFilter.addEventListener('change', () => {
    state.characterFilters.gender = DOM.characterGenderFilter.value;
    renderCharactersList();
  });

  DOM.characterSortBy.addEventListener('change', () => {
    state.characterFilters.sortBy = DOM.characterSortBy.value;
    renderCharactersList();
  });

  DOM.characterSortDirBtn.addEventListener('click', () => {
    const dir = state.characterFilters.sortDir === 'asc' ? 'desc' : 'asc';
    state.characterFilters.sortDir = dir;
    
    if (dir === 'asc') {
      DOM.sortAscIcon.classList.remove('hidden');
      DOM.sortDescIcon.classList.add('hidden');
    } else {
      DOM.sortAscIcon.classList.add('hidden');
      DOM.sortDescIcon.classList.remove('hidden');
    }
    renderCharactersList();
  });

  function renderCharactersList() {
    DOM.charactersGrid.innerHTML = '';
    
    // Filter
    let items = state.characters.filter(char => {
      const nameMatch = char.name.toLowerCase().includes(state.characterFilters.search);
      const statusMatch = state.characterFilters.status === '' || char.status.toLowerCase() === state.characterFilters.status;
      const genderMatch = state.characterFilters.gender === '' || char.gender.toLowerCase() === state.characterFilters.gender;
      return nameMatch && statusMatch && genderMatch;
    });

    // Sort
    const sortField = state.characterFilters.sortBy;
    const sortDir = state.characterFilters.sortDir;

    items.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      // Numeric or string comparisons
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Toggle Feedbacks
    if (items.length === 0) {
      DOM.charactersFeedback.classList.remove('hidden');
    } else {
      DOM.charactersFeedback.classList.add('hidden');
    }

    // Render Cards
    items.forEach(char => {
      const card = document.createElement('div');
      const stat = char.status.toLowerCase();
      card.className = `character-card-container ${stat}`;

      card.innerHTML = `
        <div class="card-image-aspect-wrapper">
          <img src="${char.image}" alt="${char.name}" class="card-image-media">
          <span class="card-id-overlay-badge">
            #${String(char.id).padStart(3, '0')}
          </span>
        </div>
        
        <div class="card-body-content">
          <div class="card-title-and-specs">
            <h3 class="card-title-heading truncate" title="${char.name}">${char.name}</h3>
            <div class="card-meta-specifications">
              <span>${char.species}</span>
              <span class="meta-status-pill-badge ${stat}">
                <span class="dot"></span>
                ${char.status}
              </span>
            </div>
          </div>
          
          <button class="card-detail-action-btn btn-view-detail" data-id="${char.id}">
            Ver Detalle
          </button>
        </div>
      `;

      card.querySelector('.btn-view-detail').addEventListener('click', () => {
        openDrawer(char, 'character');
      });

      DOM.charactersGrid.appendChild(card);
    });
  }


  // ================= VIEW: EPISODES CATALOG =================
  
  DOM.episodeSearch.addEventListener('input', () => {
    state.episodeFilters.search = DOM.episodeSearch.value.trim().toLowerCase();
    renderEpisodesList();
  });

  DOM.episodeSortBy.addEventListener('change', () => {
    state.episodeFilters.sortBy = DOM.episodeSortBy.value;
    renderEpisodesList();
  });

  DOM.episodeSortDirBtn.addEventListener('click', () => {
    const dir = state.episodeFilters.sortDir === 'asc' ? 'desc' : 'asc';
    state.episodeFilters.sortDir = dir;

    if (dir === 'asc') {
      DOM.epSortAscIcon.classList.remove('hidden');
      DOM.epSortDescIcon.classList.add('hidden');
    } else {
      DOM.epSortAscIcon.classList.add('hidden');
      DOM.epSortDescIcon.classList.remove('hidden');
    }
    renderEpisodesList();
  });

  // Table header clicks sorting
  const tableHeaders = document.querySelectorAll('th[data-col]');
  tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      
      if (state.episodeFilters.sortBy === col) {
        state.episodeFilters.sortDir = state.episodeFilters.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.episodeFilters.sortBy = col;
        state.episodeFilters.sortDir = 'asc';
      }

      // Update dropdown selection
      DOM.episodeSortBy.value = col;
      
      // Update icons
      if (state.episodeFilters.sortDir === 'asc') {
        DOM.epSortAscIcon.classList.remove('hidden');
        DOM.epSortDescIcon.classList.add('hidden');
      } else {
        DOM.epSortAscIcon.classList.add('hidden');
        DOM.epSortDescIcon.classList.remove('hidden');
      }

      renderEpisodesList();
    });
  });

  function renderEpisodesList() {
    DOM.episodesTableBody.innerHTML = '';
    
    // Filter
    let items = state.episodes.filter(ep => {
      return ep.name.toLowerCase().includes(state.episodeFilters.search);
    });

    // Sort
    const sortField = state.episodeFilters.sortBy;
    const sortDir = state.episodeFilters.sortDir;

    items.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'id') {
        return sortDir === 'asc' ? a.id - b.id : b.id - a.id;
      }
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    if (items.length === 0) {
      DOM.episodesFeedback.classList.remove('hidden');
    } else {
      DOM.episodesFeedback.classList.add('hidden');
    }

    items.forEach(ep => {
      const tr = document.createElement('tr');
      tr.className = 'table-data-row';
      
      tr.innerHTML = `
        <td class="table-data-cell id-col">#${String(ep.id).padStart(3, '0')}</td>
        <td class="table-data-cell title-col">${ep.name}</td>
        <td class="table-data-cell text-secondary">${ep.air_date}</td>
        <td class="table-data-cell code-col">${ep.episode}</td>
        <td class="table-data-cell table-action-button-cell">
          <button class="table-row-ficha-btn btn-ep-ficha" data-id="${ep.id}">
            Ficha
          </button>
        </td>
      `;

      tr.querySelector('.btn-ep-ficha').addEventListener('click', () => {
        openDrawer(ep, 'episode');
      });

      DOM.episodesTableBody.appendChild(tr);
    });
  }


  // ================= DETAIL DRAWER & EDIT FORM =================
  function openDrawer(item, type) {
    // Check local custom edits storage first before using API data
    if (type === 'character') {
      const localCharEdits = JSON.parse(localStorage.getItem('ram_custom_characters') || '[]');
      const localEdit = localCharEdits.find(e => e.id === item.id);
      if (localEdit) {
        item = { ...item, ...localEdit };
      }
    } else if (type === 'episode') {
      const localEpEdits = JSON.parse(localStorage.getItem('ram_custom_episodes') || '[]');
      const localEdit = localEpEdits.find(e => e.id === item.id);
      if (localEdit) {
        item = { ...item, ...localEdit };
      }
    }

    state.activeDrawerItem = item;
    state.activeDrawerType = type;
    state.isEditingDrawer = false;
    
    DOM.drawerTitle.textContent = type === 'character' ? 'Ficha de Personaje' : 'Ficha de Episodio';
    
    // Toggle view components
    DOM.drawerViewMode.classList.remove('hidden');
    DOM.drawerEditForm.classList.add('hidden');
    DOM.drawerToggleEditBtn.textContent = 'Editar Información';
    
    // Fill data
    if (type === 'character') {
      DOM.drawerDetailImgContainer.classList.remove('hidden');
      DOM.drawerDetailImg.src = item.image;
      DOM.drawerDetailName.textContent = item.name;
      
      // Status styling
      const stat = item.status.toLowerCase();
      DOM.drawerDetailStatusWrapper.className = `hero-status-tag ${stat}`;
      DOM.drawerDetailStatusWrapper.innerHTML = `
        <span class="status-dot"></span>
        ${item.status}
      `;
      
      // Grid specs
      DOM.drawerSpecificationsGrid.innerHTML = `
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">Especie</span>
          <span class="spec-item-value-text">${item.species || 'N/A'}</span>
        </div>
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">Género</span>
          <span class="spec-item-value-text">${item.gender || 'N/A'}</span>
        </div>
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">Tipo / Subtipo</span>
          <span class="spec-item-value-text truncate" title="${item.type || 'Standard'}">${item.type || 'Standard'}</span>
        </div>
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">ID de Portal</span>
          <span class="spec-item-value-text">#${String(item.id).padStart(3, '0')}</span>
        </div>
        <div class="spec-item-group-block full-width-col">
          <span class="spec-item-label-small-text">Ubicación Origen</span>
          <span class="spec-item-value-text">${item.origin?.name || 'Unknown'}</span>
        </div>
        <div class="spec-item-group-block full-width-col">
          <span class="spec-item-label-small-text">Ubicación Actual</span>
          <span class="spec-item-value-text">${item.location?.name || 'Unknown'}</span>
        </div>
      `;

      // Episode appearances
      DOM.drawerListTitle.textContent = 'Apariciones en Episodios';
      const epCounts = item.episode ? item.episode.length : 0;
      if (epCounts > 0) {
        // Extract episode codes or numbers from links
        const listText = item.episode.map(link => {
          const id = link.split('/').pop();
          const epObj = state.episodes.find(e => e.id == id);
          return epObj ? `${epObj.episode} - ${epObj.name}` : `Episodio #${id}`;
        }).join('<br>');
        DOM.drawerListContent.innerHTML = `<div class="space-y-1">${listText}</div>`;
      } else {
        DOM.drawerListContent.innerHTML = '<span class="text-sub-light dark:text-sub-dark italic">Ningún episodio registrado.</span>';
      }
      
    } else {
      // Episode mode
      DOM.drawerDetailImgContainer.classList.add('hidden');
      DOM.drawerDetailName.textContent = item.name;
      DOM.drawerDetailStatusWrapper.className = 'hero-status-tag episode';
      DOM.drawerDetailStatusWrapper.innerHTML = `Código: ${item.episode}`;

      // Specs
      DOM.drawerSpecificationsGrid.innerHTML = `
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">ID de Portal</span>
          <span class="spec-item-value-text">#${String(item.id).padStart(3, '0')}</span>
        </div>
        <div class="spec-item-group-block">
          <span class="spec-item-label-small-text">Fecha Emisión</span>
          <span class="spec-item-value-text">${item.air_date}</span>
        </div>
        <div class="spec-item-group-block full-width-col">
          <span class="spec-item-label-small-text">Reparto Registrado</span>
          <span class="spec-item-value-text">${item.characters ? item.characters.length : 0} personajes</span>
        </div>
      `;

      // Cast list
      DOM.drawerListTitle.textContent = 'Personajes Participantes';
      const castCount = item.characters ? item.characters.length : 0;
      if (castCount > 0) {
        const listText = item.characters.slice(0, 15).map(link => {
          const id = link.split('/').pop();
          const charObj = state.characters.find(c => c.id == id);
          return charObj ? charObj.name : `Personaje #${id}`;
        }).join(', ');
        const suffix = castCount > 15 ? ` y ${castCount - 15} más...` : '';
        DOM.drawerListContent.innerHTML = `<span class="text-text-light dark:text-text-dark">${listText}${suffix}</span>`;
      } else {
        DOM.drawerListContent.innerHTML = '<span class="text-sub-light dark:text-sub-dark italic">Ningún personaje listado.</span>';
      }
    }

    // Toggle animations
    DOM.detailDrawer.classList.remove('invisible');
    setTimeout(() => {
      DOM.drawerBackdrop.classList.add('opacity-100');
      DOM.drawerPanel.classList.remove('translate-x-full');
    }, 10);
  }

  function closeDrawer() {
    DOM.drawerBackdrop.classList.remove('opacity-100');
    DOM.drawerPanel.classList.add('translate-x-full');
    setTimeout(() => {
      DOM.detailDrawer.classList.add('invisible');
      state.activeDrawerItem = null;
      state.isEditingDrawer = false;
    }, 300);
  }

  DOM.drawerCloseBtn.addEventListener('click', closeDrawer);
  DOM.drawerBackdrop.addEventListener('click', closeDrawer);

  // Toggle Edit Mode Form
  DOM.drawerToggleEditBtn.addEventListener('click', () => {
    if (state.isEditingDrawer) {
      // Switch back to view mode
      DOM.drawerViewMode.classList.remove('hidden');
      DOM.drawerEditForm.classList.add('hidden');
      DOM.drawerToggleEditBtn.textContent = 'Editar Información';
      state.isEditingDrawer = false;
    } else {
      // Switch to edit mode
      DOM.drawerViewMode.classList.add('hidden');
      DOM.drawerEditForm.classList.remove('hidden');
      DOM.drawerToggleEditBtn.textContent = 'Volver a Detalles';
      state.isEditingDrawer = true;
      
      setupEditFormInputs();
    }
  });

  DOM.drawerCancelEditBtn.addEventListener('click', () => {
    DOM.drawerViewMode.classList.remove('hidden');
    DOM.drawerEditForm.classList.add('hidden');
    DOM.drawerToggleEditBtn.textContent = 'Editar Información';
    state.isEditingDrawer = false;
  });

  function setupEditFormInputs() {
    DOM.drawerEditInputs.innerHTML = '';
    const item = state.activeDrawerItem;
    
    if (state.activeDrawerType === 'character') {
      DOM.drawerEditInputs.innerHTML = `
        <div class="form-group">
          <label for="edit-name" class="form-label">Nombre del Personaje</label>
          <input type="text" id="edit-name" required value="${item.name}" class="input-field">
          <span class="error-msg hidden"></span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem;">
          <div class="form-group">
            <label for="edit-status" class="form-label">Estado</label>
            <select id="edit-status" class="toolbar-select-dropdown" style="width: 100%; min-width: 0;">
              <option value="Alive" ${item.status === 'Alive' ? 'selected' : ''}>Alive</option>
              <option value="Dead" ${item.status === 'Dead' ? 'selected' : ''}>Dead</option>
              <option value="unknown" ${item.status === 'unknown' ? 'selected' : ''}>Unknown</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="edit-gender" class="form-label">Género</label>
            <select id="edit-gender" class="toolbar-select-dropdown" style="width: 100%; min-width: 0;">
              <option value="Male" ${item.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${item.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Genderless" ${item.gender === 'Genderless' ? 'selected' : ''}>Genderless</option>
              <option value="unknown" ${item.gender === 'unknown' ? 'selected' : ''}>Unknown</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="edit-species" class="form-label">Especie</label>
          <input type="text" id="edit-species" required value="${item.species || ''}" class="input-field">
          <span class="error-msg hidden"></span>
        </div>

        <div class="form-group">
          <label for="edit-type" class="form-label">Tipo / Subtipo</label>
          <input type="text" id="edit-type" value="${item.type || ''}" class="input-field" placeholder="Standard">
        </div>

        <div class="form-group">
          <label for="edit-origin" class="form-label">Ubicación de Origen</label>
          <input type="text" id="edit-origin" value="${item.origin?.name || 'unknown'}" class="input-field">
        </div>

        <div class="form-group">
          <label for="edit-location" class="form-label">Ubicación Actual</label>
          <input type="text" id="edit-location" value="${item.location?.name || 'unknown'}" class="input-field">
        </div>
      `;
    } else {
      DOM.drawerEditInputs.innerHTML = `
        <div class="form-group">
          <label for="edit-ep-name" class="form-label">Nombre del Episodio</label>
          <input type="text" id="edit-ep-name" required value="${item.name}" class="input-field">
          <span class="error-msg hidden"></span>
        </div>

        <div class="form-group">
          <label for="edit-ep-date" class="form-label">Fecha de Emisión</label>
          <input type="text" id="edit-ep-date" required value="${item.air_date}" class="input-field">
          <span class="error-msg hidden"></span>
        </div>

        <div class="form-group">
          <label for="edit-ep-code" class="form-label">Código de Episodio</label>
          <input type="text" id="edit-ep-code" required value="${item.episode}" class="input-field">
          <span class="error-msg hidden"></span>
        </div>
      `;
    }

    // Add visual offline badge if network is down
    if (!navigator.onLine) {
      const badge = document.createElement('div');
      badge.className = 'p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold text-center font-mono animate-pulse mt-4';
      badge.innerHTML = '⚠️ Modo Offline - Cambios locales';
      DOM.drawerEditInputs.appendChild(badge);
    }
  }

  // Handle Edit Submit
  DOM.drawerEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearInputErrors(DOM.drawerEditForm);
    
    const item = state.activeDrawerItem;
    const type = state.activeDrawerType;
    let valid = true;

    if (type === 'character') {
      const name = document.getElementById('edit-name').value.trim();
      const status = document.getElementById('edit-status').value;
      const gender = document.getElementById('edit-gender').value;
      const species = document.getElementById('edit-species').value.trim();
      const subtype = document.getElementById('edit-type').value.trim();
      const originName = document.getElementById('edit-origin').value.trim();
      const locationName = document.getElementById('edit-location').value.trim();

      if (!name) {
        showInputError(document.getElementById('edit-name'), 'El nombre es obligatorio');
        valid = false;
      }
      if (!species) {
        showInputError(document.getElementById('edit-species'), 'La especie es obligatoria');
        valid = false;
      }

      if (!valid) return;

      // Update item edits
      const updatedItem = {
        ...item,
        name,
        status,
        gender,
        species,
        type: subtype,
        origin: { ...item.origin, name: originName },
        location: { ...item.location, name: locationName }
      };

      // Persist to custom edits store
      const charEdits = JSON.parse(localStorage.getItem('ram_custom_characters') || '[]');
      const editIdx = charEdits.findIndex(e => e.id === item.id);
      if (editIdx !== -1) charEdits[editIdx] = { id: item.id, ...updatedItem };
      else charEdits.push({ id: item.id, ...updatedItem });
      localStorage.setItem('ram_custom_characters', JSON.stringify(charEdits));

      // Update active in-memory list
      const idx = state.characters.findIndex(c => c.id === item.id);
      if (idx !== -1) {
        state.characters[idx] = updatedItem;
      }
      localStorage.setItem('ram_characters_cache', JSON.stringify(state.characters));

      // Update Featured if it's the edited character
      if (state.featuredCharacter && state.featuredCharacter.id === item.id) {
        state.featuredCharacter = updatedItem;
        renderFeaturedCharacter();
      }

      // Refresh listings and details
      openDrawer(updatedItem, 'character');
      renderCharactersList();
      showToast('¡Ficha del personaje guardada con éxito!', 'success');

    } else {
      // Episode edit saving
      const name = document.getElementById('edit-ep-name').value.trim();
      const air_date = document.getElementById('edit-ep-date').value.trim();
      const episode = document.getElementById('edit-ep-code').value.trim();

      if (!name) {
        showInputError(document.getElementById('edit-ep-name'), 'El nombre es obligatorio');
        valid = false;
      }
      if (!air_date) {
        showInputError(document.getElementById('edit-ep-date'), 'La fecha de emisión es obligatoria');
        valid = false;
      }
      if (!episode) {
        showInputError(document.getElementById('edit-ep-code'), 'El código es obligatorio');
        valid = false;
      }

      if (!valid) return;

      const updatedItem = {
        ...item,
        name,
        air_date,
        episode
      };

      // Persist to custom edits store
      const epEdits = JSON.parse(localStorage.getItem('ram_custom_episodes') || '[]');
      const editIdx = epEdits.findIndex(e => e.id === item.id);
      if (editIdx !== -1) epEdits[editIdx] = { id: item.id, ...updatedItem };
      else epEdits.push({ id: item.id, ...updatedItem });
      localStorage.setItem('ram_custom_episodes', JSON.stringify(epEdits));

      // Update in memory cache
      const idx = state.episodes.findIndex(e => e.id === item.id);
      if (idx !== -1) {
        state.episodes[idx] = updatedItem;
      }
      localStorage.setItem('ram_episodes_cache', JSON.stringify(state.episodes));

      // Refresh listings and details
      openDrawer(updatedItem, 'episode');
      renderEpisodesList();
      showToast('¡Ficha de episodio guardada con éxito!', 'success');
    }
  });


  // ================= APP INITIALIZATION =================
  async function initApp() {
    initTheme();
    loadSession();
    updateRouter();
    
    // Check initial connection status on load (runs the style setups)
    if (!navigator.onLine) {
      DOM.connBadge.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-container text-amber-500 border-amber-500/25";
      DOM.connBadge.innerHTML = `<span class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>Offline`;
      DOM.offlineBanner.classList.remove('hidden');
    }

    // Load API data / Cache
    await loadInitialData();
  }

  // Launch!
  initApp();

});
