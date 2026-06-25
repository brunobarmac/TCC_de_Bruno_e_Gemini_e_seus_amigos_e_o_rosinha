/**
 * SITE-COMMON.JS
 * 
 * Auto-injeta header, footer e gerencia traduções globais
 * para todas as páginas do StudyPro
 * 
 * Funcionalidades:
 * - Injeta header padronizado com logo, navegação, seletor de idioma e botão voltar
 * - Injeta footer padronizado com links de privacidade e termos
 * - Remove headers/footers duplicados que possam estar nas páginas
 * - Sincroniza preferência de idioma (i18next) entre todas as páginas
 * - Implementação segura: não quebra se elementos já existem
 */

(function() {
  // Verifica se já foi executado (evita re-aplicação)
  if (window.__siteCommonApplied) {
    console.log('[site-common] Já foi aplicado nesta página');
    return;
  }
  window.__siteCommonApplied = true;

  // Espera pelo DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteCommon);
  } else {
    initSiteCommon();
  }

  function initSiteCommon() {
    console.log('[site-common] Inicializando...');
    
    // 1. Injeta header padronizado
    injectHeader();
    
    // 2. Injeta footer padronizado
    injectFooter();
    
    // 3. Adiciona botão global da IA, exceto em login/cadastro
    injectIAButton();
    
    // 4. Remove headers/footers duplicados
    removeDuplicates();
    
    // 5. Setup do seletor de idioma
    setupLanguageSelector();
    
    // 6. Sincroniza i18next
    setupI18nextSync();
  }

  function getSavedLanguage() {
    return localStorage.getItem('studyPro_lang')
      || localStorage.getItem('i18nextLng')
      || localStorage.getItem('selectedLanguage')
      || 'pt';
  }

  function setSavedLanguage(lang) {
    localStorage.setItem('i18nextLng', lang);
    localStorage.setItem('studyPro_lang', lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  function ensureI18nextLibraryLoaded(callback) {
    if (window.i18next) {
      callback();
      return;
    }
    const existingScript = document.querySelector('script[src*="i18next.min.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', callback);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/i18next@23.15.1/dist/umd/i18next.min.js';
    script.async = false;
    script.addEventListener('load', callback);
    script.addEventListener('error', () => console.warn('[site-common] Falha ao carregar i18next')); 
    document.head.appendChild(script);
  }

  function getSharedI18nextResources() {
    return {
      pt: { translation: {
        'questoes': 'Questões',
        'questoes-favoritas': 'Questões Favoritas',
        'videos': 'Vídeos',
        'desempenho': 'Desempenho',
        'sala-trofeus': 'Sala de Troféus',
        'tutorial-ia': 'Tutorial IA',
        'privacidade': 'Política de Privacidade',
        'termos-uso': 'Termos de Uso',
        'configuracoes': 'Configurações',
        'voltar': 'Voltar',
        'privacy': 'Política de Privacidade',
        'terms': 'Termos de Uso',
        'contact': 'Contato',
        'videos-page-title': 'Vídeos para Estudo',
        'videos-card-brasil-title': 'Brasil Colonial',
        'videos-card-brasil-desc': 'Colonização e Economia',
        'videos-card-expansao-title': 'Expansão Marítima',
        'videos-card-expansao-desc': 'Navegações e Comércio',
        'videos-card-idade-title': 'Idade Média',
        'videos-card-idade-desc': 'Feudalismo e Sociedade',
        'videos-card-revolucao-title': 'Revolução Francesa',
        'videos-card-revolucao-desc': 'Política e Cidadania',
        'questoes-page-title': 'Exercícios de Estudo',
        'questoes-card-questionario-title': 'Questionário',
        'questoes-card-questionario-desc': 'Conteúdo geral',
        'questoes-card-colonial-title': 'Brasil Colonial',
        'questoes-card-colonial-desc': 'Colonização e Economia',
        'questoes-card-expansao-title': 'Expansão Marítima',
        'questoes-card-expansao-desc': 'Navegações e Comércio',
        'questoes-card-idade-title': 'Idade Média',
        'questoes-card-idade-desc': 'Feudalismo e Sociedade',
        'questoes-card-revolucao-title': 'Revolução Francesa',
        'questoes-card-revolucao-desc': 'Política e Cidadania',
        'favoritas-title': '⭐ Suas Questões Favoritas',
        'favoritas-description': 'Clique em qualquer lugar da questão para retornar à página original e responder na fonte da pergunta.',
        'favoritas-empty': 'Você ainda não favoritou nenhuma questão.',
        'favoritas-page-title': 'Questões Favoritas - StudyPro'
      }},
      en: { translation: {
        'questoes': 'Questions',
        'questoes-favoritas': 'Favorite Questions',
        'videos': 'Videos',
        'desempenho': 'Performance',
        'sala-trofeus': 'Trophy Room',
        'tutorial-ia': 'AI Tutorial',
        'privacidade': 'Privacy Policy',
        'termos-uso': 'Terms of Use',
        'configuracoes': 'Settings',
        'voltar': 'Back',
        'privacy': 'Privacy Policy',
        'terms': 'Terms of Use',
        'contact': 'Contact',
        'videos-page-title': 'Study Videos',
        'videos-card-brasil-title': 'Colonial Brazil',
        'videos-card-brasil-desc': 'Colonization and Economy',
        'videos-card-expansao-title': 'Maritime Expansion',
        'videos-card-expansao-desc': 'Navigation and Trade',
        'videos-card-idade-title': 'Middle Ages',
        'videos-card-idade-desc': 'Feudalism and Society',
        'videos-card-revolucao-title': 'French Revolution',
        'videos-card-revolucao-desc': 'Politics and Citizenship',
        'questoes-page-title': 'Study Exercises',
        'questoes-card-questionario-title': 'Questionnaire',
        'questoes-card-questionario-desc': 'General content',
        'questoes-card-colonial-title': 'Colonial Brazil',
        'questoes-card-colonial-desc': 'Colonization and Economy',
        'questoes-card-expansao-title': 'Maritime Expansion',
        'questoes-card-expansao-desc': 'Navigation and Trade',
        'questoes-card-idade-title': 'Middle Ages',
        'questoes-card-idade-desc': 'Feudalism and Society',
        'questoes-card-revolucao-title': 'French Revolution',
        'questoes-card-revolucao-desc': 'Politics and Citizenship',
        'favoritas-title': '⭐ Your Favorite Questions',
        'favoritas-description': 'Click anywhere on a question to return to the original page and answer it there.',
        'favoritas-empty': 'You have not favorited any question yet.',
        'favoritas-open-quiz': 'Click to open in the general quiz.',
        'favoritas-open-source': 'Click to open in {{source}}.',
        'remove-favorite': '❌ Remove from Favorites',
        'favoritas-page-title': 'Favorite Questions - StudyPro'
      }},
      es: { translation: {
        'questoes': 'Preguntas',
        'questoes-favoritas': 'Preguntas Favoritas',
        'videos': 'Vídeos',
        'desempenho': 'Rendimiento',
        'sala-trofeus': 'Sala de Trofeos',
        'tutorial-ia': 'Tutorial IA',
        'privacidade': 'Política de Privacidad',
        'termos-uso': 'Términos de Uso',
        'configuracoes': 'Configuración',
        'voltar': 'Volver',
        'privacy': 'Política de Privacidad',
        'terms': 'Términos de Uso',
        'contact': 'Contacto',
        'videos-page-title': 'Vídeos para Estudiar',
        'videos-card-brasil-title': 'Brasil Colonial',
        'videos-card-brasil-desc': 'Colonización y Economía',
        'videos-card-expansao-title': 'Expansión Marítima',
        'videos-card-expansao-desc': 'Navegación y Comercio',
        'videos-card-idade-title': 'Edad Media',
        'videos-card-idade-desc': 'Feudalismo y Sociedad',
        'videos-card-revolucao-title': 'Revolución Francesa',
        'videos-card-revolucao-desc': 'Política y Ciudadanía',
        'questoes-page-title': 'Ejercicios de Estudio',
        'questoes-card-questionario-title': 'Cuestionario',
        'questoes-card-questionario-desc': 'Contenido general',
        'questoes-card-colonial-title': 'Brasil Colonial',
        'questoes-card-colonial-desc': 'Colonización y Economía',
        'questoes-card-expansao-title': 'Expansión Marítima',
        'questoes-card-expansao-desc': 'Navegación y Comercio',
        'questoes-card-idade-title': 'Edad Media',
        'questoes-card-idade-desc': 'Feudalismo y Sociedad',
        'questoes-card-revolucao-title': 'Revolución Francesa',
        'questoes-card-revolucao-desc': 'Política y Ciudadanía',
        'favoritas-title': '⭐ Tus Preguntas Favoritas',
        'favoritas-description': 'Haz clic en cualquier pregunta para volver a la página original y responder en la fuente.',
        'favoritas-empty': 'Aún no has marcado ninguna pregunta como favorita.',
        'favoritas-open-quiz': 'Haz clic para abrir en el cuestionario general.',
        'favoritas-open-source': 'Haz clic para abrir en {{source}}.',
        'remove-favorite': '❌ Quitar de favoritos',
        'favoritas-page-title': 'Preguntas Favoritas - StudyPro'
      }}
    };
  }

  function addSharedI18nextResources(resources) {
    if (!window.i18next || typeof window.i18next.addResourceBundle !== 'function') return;

    Object.keys(resources).forEach(lang => {
      try {
        window.i18next.addResourceBundle(lang, 'translation', resources[lang].translation, true, true);
      } catch (err) {
        console.warn('[site-common] Falha ao adicionar bundle i18next para', lang, err);
      }
    });
  }

  function initSharedI18next() {
    if (!window.i18next) return;
    const savedLang = getSavedLanguage();
    const sharedResources = getSharedI18nextResources();

    if (window.i18next.isInitialized) {
      addSharedI18nextResources(sharedResources);
      const finishInit = () => {
        applyTranslations();
        document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: window.i18next.language } }));
      };

      if (window.i18next.language !== savedLang && typeof window.i18next.changeLanguage === 'function') {
        window.i18next.changeLanguage(savedLang).then(() => {
          finishInit();
        }).catch(() => {
          finishInit();
        });
      } else {
        finishInit();
      }
      return;
    }

    window.i18next.init({
      lng: savedLang,
      debug: false,
      resources: sharedResources
    }, function(err) {
      if (err) console.warn('[site-common] Erro ao inicializar i18next compartilhado', err);
      applyTranslations();
      document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: savedLang } }));
    });
  }

  function injectIAButton() {
    if (!isIAButtonAllowed()) return;
    if (document.querySelector('.site-ia-launcher')) return;

    const href = getRelativePath('IA/pequeno_rosa.html');
    const wrapper = document.createElement('div');
    wrapper.className = 'site-ia-launcher';
    wrapper.innerHTML = `
      <a href="${href}" class="btn-pequeno-rosa" aria-label="Pequeno Rosa">
        Pequeno Rosa
      </a>
    `;

    document.body.appendChild(wrapper);
    injectIAStyles();
  }

  function isIAButtonAllowed() {
    const path = window.location.pathname.toLowerCase();
    const excluded = ['login.html', 'comlogin.html', 'otp.html', 'cadastro', 'signup', 'register', 'pequeno_rosa.html'];
    return !excluded.some(segment => path.includes(segment));
  }

  function injectIAStyles() {
    if (document.getElementById('site-common-ia-style')) return;
    const style = document.createElement('style');
    style.id = 'site-common-ia-style';
    style.textContent = `
      .site-ia-launcher {
        position: fixed;
        bottom: 100px;
        right: 50px;
        z-index: 9999;
      }
      .btn-pequeno-rosa {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110px;
        height: 110px;
        border-radius: 50px;
        background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
        color: white;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border: none;
        cursor: pointer;
        flex-wrap: wrap;
        padding: 10px;
      }
      .btn-pequeno-rosa:hover {
        transform: translateY(-5px) scale(1.1);
        box-shadow: 0 12px 35px rgba(255, 105, 180, 0.6);
        background: linear-gradient(135deg, #ff1493 0%, #ff69b4 100%);
      }
      .btn-pequeno-rosa:active {
        transform: translateY(-2px) scale(1.05);
      }
    `;
    document.head.appendChild(style);
  }

  function isHomePage() {
    const path = window.location.pathname.toLowerCase();
    return path.endsWith('/index.html') || path.endsWith('/index.htm') || path.endsWith('/') || path.endsWith('index.html') || path.endsWith('index.htm');
  }

  /**
   * Injeta header padronizado no topo da página
   */
  function injectHeader() {
    // Verifica se já existe um site-header
    if (document.querySelector('header.site-header')) {
      console.log('[site-common] Header já existe');
      return;
    }

    const header = document.createElement('header');
    header.className = 'site-header';
    const backButtonHtml = isHomePage() ? '' : `
          <button class="site-back-btn" id="site-back-btn" title="Voltar para página anterior">
            <span class="site-arrow-left">←</span> <span data-i18n="voltar">Voltar</span>
          </button>
    `;
    header.innerHTML = `
      <div class="site-header-content">
        <div class="site-logo">
          <a href="${getHomeUrl()}" title="Voltar para home">
            <span class="site-brain">🧠</span> StudyPro
          </a>
        </div>
        
        <nav class="site-nav" aria-label="Navegação principal">
          <a href="${getRelativePath('questoes/questoes.html')}" class="nav-link" data-i18n="questoes">Questões</a>
          <a href="${getRelativePath('html/questoes_favoritas.html')}" class="nav-link" data-i18n="questoes-favoritas">Questões Favoritas</a>
          <a href="${getRelativePath('videos/videos.html')}" class="nav-link" data-i18n="videos">Vídeos</a>
          <a href="${getRelativePath('html/sala-trofeus.html')}" class="nav-link" data-i18n="sala-trofeus">Sala de Troféus</a>
          <a href="${getRelativePath('html/tutorial-ia.html')}" class="nav-link" data-i18n="tutorial-ia">Tutorial IA</a>
        </nav>

        <div class="site-controls">
          <div class="site-language-dropdown">
            <button class="site-lang-btn" id="site-lang-toggle" aria-label="Seletor de idioma">
              <span id="site-current-lang">PT</span>
              <span class="site-arrow">▶</span>
            </button>
            <ul class="site-lang-menu" id="site-lang-menu">
              <li><button class="site-lang-option" data-lang="pt">🇧🇷 PT</button></li>
              <li><button class="site-lang-option" data-lang="en">🇺🇸 EN</button></li>
              <li><button class="site-lang-option" data-lang="es">🇪🇸 ES</button></li>
            </ul>
          </div>
          ${backButtonHtml}
        </div>
      </div>
    `;

    // Injeta no início do body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Setup do botão voltar
    setupBackButton();
    
    console.log('[site-common] Header injetado');
  }

  /**
   * Injeta footer padronizado no fim da página
   */
  function injectFooter() {
    // Verifica se já existe um site-footer
    if (document.querySelector('footer.site-footer')) {
      console.log('[site-common] Footer já existe');
      return;
    }

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="site-footer-content">
        <p>&copy; <span id="site-year">${new Date().getFullYear()}</span> StudyPro. Todos os direitos reservados.</p>
        <nav class="site-footer-links">
          <a href="${getRelativePath('html/privacidade.html')}" data-i18n="privacidade">Política de Privacidade</a>
          <span>|</span>
          <a href="${getRelativePath('html/termos-de-uso.html')}" data-i18n="termos-uso">Termos de Uso</a>
          <span>|</span>
          <a href="${getRelativePath('html/configuracoes.html')}" data-i18n="configuracoes">Configurações</a>
        </nav>
      </div>
    `;

    // Injeta no fim do body
    document.body.appendChild(footer);
    
    console.log('[site-common] Footer injetado');
  }

  /**
   * Remove headers e footers duplicados (que não sejam site-header/site-footer)
   */
  function removeDuplicates() {
    // Remove todos os headers que não sejam site-header
    const headers = document.querySelectorAll('header:not(.site-header)');
    headers.forEach(h => {
      console.log('[site-common] Removendo header duplicado');
      h.remove();
    });

    // Remove todos os footers que não sejam site-footer
    const footers = document.querySelectorAll('footer:not(.site-footer)');
    footers.forEach(f => {
      console.log('[site-common] Removendo footer duplicado');
      f.remove();
    });
  }

  /**
   * Setup do botão voltar
   */
  function setupBackButton() {
    const backBtn = document.getElementById('site-back-btn');
    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
      // Se há histórico, volta
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Se não há histórico, vai para home
        window.location.href = getHomeUrl();
      }
    });
  }

  /**
   * Setup do seletor de idioma
   */
  let currentLangSpanGlobal = null;

  function setupLanguageSelector() {
    const langToggle = document.getElementById('site-lang-toggle');
    const langMenu = document.getElementById('site-lang-menu');
    currentLangSpanGlobal = document.getElementById('site-current-lang');
    const langOptions = document.querySelectorAll('.site-lang-option');

    if (!langToggle || !langMenu) return;

    // Recupera idioma salvo
    const savedLang = getSavedLanguage();
    updateLanguageButton(savedLang);

    // Abre/fecha dropdown
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('show');
      const arrow = langToggle.querySelector('.site-arrow');
      if (arrow) {
        arrow.style.transform = langMenu.classList.contains('show') ? 'rotate(90deg)' : 'rotate(0deg)';
      }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', () => {
      if (langMenu.classList.contains('show')) {
        langMenu.classList.remove('show');
        const arrow = langToggle.querySelector('.site-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });

    // Muda idioma
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        if (!lang) return;

        // Salva no localStorage (principal objetivo)
        setSavedLanguage(lang);

        // Incrementa contador de trocas de idioma e verifica troféus
        if (typeof window.incrementarTrocasIdioma === 'function') {
          window.incrementarTrocasIdioma().catch((err) => console.error('[site-common] Erro ao atualizar trocasIdioma:', err));
        }

        langMenu.classList.remove('show');
        const arrow = langToggle.querySelector('.site-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';

        updateLanguageButton(lang);
        attemptChangeLanguage(lang);
      });
    });
  }

  function updateLanguageButton(lang) {
    if (!currentLangSpanGlobal) return;
    currentLangSpanGlobal.textContent = (lang || 'pt').toUpperCase();
  }

  function attemptChangeLanguage(lang, attempts = 0) {
    if (window.i18next && typeof window.i18next.changeLanguage === 'function') {
      try {
        window.i18next.changeLanguage(lang).then(() => {
          applyTranslations();
          console.log('[site-common] Idioma alterado para:', lang);
          document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang } }));
        }).catch(() => {
          console.log('[site-common] i18next não mudou (sem recursos carregados)');
        });
      } catch (err) {
        console.log('[site-common] i18next indisponível para mudança de idioma');
      }
      return;
    }

    if (attempts < 10) {
      setTimeout(() => attemptChangeLanguage(lang, attempts + 1), 100);
    } else {
      console.warn('[site-common] não foi possível mudar idioma porque i18next não carregou');
    }
  }

  /**
   * Sincroniza i18next com localStorage
   */
  function patchI18nextInit() {
    if (!window.i18next || typeof window.i18next.init !== 'function' || window.__siteCommonI18nextInitPatched) {
      return;
    }

    const originalInit = window.i18next.init.bind(window.i18next);
    const sharedResources = getSharedI18nextResources();

    window.i18next.init = function(options, callback) {
      let opts = options || {};
      let cb = callback;

      if (typeof opts === 'function') {
        cb = opts;
        opts = {};
      }

      opts = Object.assign({}, opts);
      opts.resources = opts.resources || {};

      Object.keys(sharedResources).forEach(lang => {
        opts.resources[lang] = opts.resources[lang] || { translation: {} };
        opts.resources[lang].translation = Object.assign({}, sharedResources[lang].translation, opts.resources[lang].translation);
      });

      const wrappedCallback = function(err, t) {
        if (cb) cb(err, t);
        addSharedI18nextResources(sharedResources);
        if (window.i18next) {
          applyTranslations();
          document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: window.i18next.language } }));
        }
      };

      return originalInit(opts, wrappedCallback);
    };

    window.__siteCommonI18nextInitPatched = true;
  }

  function setupI18nextSync() {
    const savedLang = getSavedLanguage();

    ensureI18nextLibraryLoaded(() => {
      if (!window.i18next) {
        console.warn('[site-common] i18next não foi carregado');
        return;
      }

      patchI18nextInit();
      initSharedI18next();
      setupI18nextLanguageChangedListener();

      const maxAttempts = 20;
      let attempts = 0;

      function trySync() {
        attempts += 1;
        try {
          if (typeof window.i18next.changeLanguage === 'function') {
            window.i18next.changeLanguage(savedLang).then(() => {
              applyTranslations();
              console.log('[site-common] Idioma sincronizado:', savedLang);
            }).catch((err) => {
              console.log('[site-common] Não foi possível sincronizar idioma (sem recursos)');
              applyTranslations();
            });
            return;
          }
        } catch (err) {
          console.warn('[site-common] Erro ao sincronizar i18next:', err.message);
        }

        if (attempts < maxAttempts) {
          setTimeout(trySync, 100);
        } else {
          console.warn('[site-common] i18next não disponível após várias tentativas');
        }
      }

      trySync();
    });
  }

  function setupI18nextLanguageChangedListener() {
    if (!window.i18next || typeof window.i18next.on !== 'function' || window.__siteCommonLangListenerAttached) {
      return;
    }

    window.i18next.on('languageChanged', (lang) => {
      setSavedLanguage(lang);
      updateLanguageButton(lang);
      applyTranslations();
      document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang } }));
      console.log('[site-common] i18next languageChanged capturado:', lang);
    });

    window.__siteCommonLangListenerAttached = true;
  }

  /**
   * Aplica traduções dos atributos data-i18n
   */
  function applyTranslations() {
    if (!window.i18next) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && window.i18next.exists(key)) {
        el.innerHTML = window.i18next.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && window.i18next.exists(key)) {
        el.setAttribute('placeholder', window.i18next.t(key));
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key && window.i18next.exists(key)) {
        if (el.tagName.toLowerCase() === 'title') {
          document.title = window.i18next.t(key);
          el.textContent = document.title;
        } else {
          el.setAttribute('title', window.i18next.t(key));
        }
      }
    });

    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (key && window.i18next.exists(key)) {
        el.value = window.i18next.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (key && window.i18next.exists(key)) {
        el.setAttribute('alt', window.i18next.t(key));
      }
    });
  }

  /**
   * Calcula path relativo para home baseado na profundidade atual
   */
  function getHomeUrl() {
    const path = window.location.pathname;
    if (path.includes('/html/') || path.includes('/questoes/') || path.includes('/videos/') || path.includes('/IA/')) {
      return '../index.html';
    }
    return 'index.html';
  }

  /**
   * Calcula path relativo correto para um arquivo
   */
  function getRelativePath(filePath) {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const normalizedFilePath = filePath.replace(/\\/g, '/');

    if (path.includes('/html/')) {
      // Página dentro de /html/ precisa usar caminhos relativos ao mesmo diretório
      if (normalizedFilePath.startsWith('html/')) {
        return normalizedFilePath.replace(/^html\//, '');
      }
      return '../' + normalizedFilePath;
    } else if (path.includes('/questoes/')) {
      if (normalizedFilePath.startsWith('questoes/')) {
        return normalizedFilePath.replace(/^questoes\//, '');
      }
      return '../' + normalizedFilePath;
    } else if (path.includes('/videos/')) {
      if (normalizedFilePath.startsWith('videos/')) {
        return normalizedFilePath.replace(/^videos\//, '');
      }
      return '../' + normalizedFilePath;
    } else if (path.includes('/ia/')) {
      if (normalizedFilePath.toLowerCase().startsWith('ia/')) {
        return normalizedFilePath.replace(/^ia\//i, '');
      }
      return '../' + normalizedFilePath;
    } else {
      return normalizedFilePath;
    }
  }

  // Fallback: aponta applyTranslations globalmente para uso manual
  window.__applyTranslations = applyTranslations;

})();
