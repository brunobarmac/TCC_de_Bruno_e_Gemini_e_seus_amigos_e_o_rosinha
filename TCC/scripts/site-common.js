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
    
    // 3. Remove headers/footers duplicados
    removeDuplicates();
    
    // 4. Setup do seletor de idioma
    setupLanguageSelector();
    
    // 5. Sincroniza i18next
    setupI18nextSync();
    
    console.log('[site-common] Inicialização concluída');
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
          
          <button class="site-back-btn" id="site-back-btn" title="Voltar para página anterior">
            <span class="site-arrow-left">←</span> <span data-i18n="voltar">Voltar</span>
          </button>
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
  function setupLanguageSelector() {
    const langToggle = document.getElementById('site-lang-toggle');
    const langMenu = document.getElementById('site-lang-menu');
    const currentLangSpan = document.getElementById('site-current-lang');
    const langOptions = document.querySelectorAll('.site-lang-option');

    if (!langToggle || !langMenu) return;

    // Recupera idioma salvo
    const savedLang = localStorage.getItem('i18nextLng') || 'pt';
    currentLangSpan.textContent = savedLang.toUpperCase();

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
        
        // Salva no localStorage (principal objetivo)
        localStorage.setItem('i18nextLng', lang);
        localStorage.setItem('selectedLanguage', lang); // compatibilidade
        
        // Atualiza indicador
        currentLangSpan.textContent = lang.toUpperCase();
        
        // Fecha menu
        langMenu.classList.remove('show');
        const arrow = langToggle.querySelector('.site-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';

        // Tenta alterar idioma no i18next (com segurança)
        if (window.i18next && typeof window.i18next.changeLanguage === 'function') {
          try {
            window.i18next.changeLanguage(lang).then(() => {
              applyTranslations();
              console.log('[site-common] Idioma alterado para:', lang);
            }).catch(() => {
              // Silenciosamente falha (sem recursos carregados)
              console.log('[site-common] i18next não mudou (sem recursos)');
            });
          } catch (err) {
            console.log('[site-common] i18next indisponível para mudança de idioma');
          }
        } else {
          // i18next não disponível - apenas reload da página para aplicar novo idioma
          console.log('[site-common] Recarregando página com novo idioma:', lang);
          window.location.reload();
        }
      });
    });
  }

  /**
   * Sincroniza i18next com localStorage
   */
  function setupI18nextSync() {
    const savedLang = localStorage.getItem('i18nextLng') || 'pt';

    // Aguarda i18next ficar disponível (cada página inicializa seu próprio)
    setTimeout(() => {
      try {
        if (window.i18next && typeof window.i18next.changeLanguage === 'function') {
          window.i18next.changeLanguage(savedLang).then(() => {
            // Re-aplica traduções
            applyTranslations();
            console.log('[site-common] Idioma sincronizado:', savedLang);
          }).catch((err) => {
            console.log('[site-common] Não foi possível sincronizar idioma (sem recursos)');
            applyTranslations();
          });
        }
      } catch (err) {
        console.warn('[site-common] Erro ao sincronizar i18next:', err.message);
      }
    }, 100);
  }

  /**
   * Aplica traduções dos atributos data-i18n
   */
  function applyTranslations() {
    if (!window.i18next) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (window.i18next.exists(key)) {
        el.textContent = window.i18next.t(key);
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
    const path = window.location.pathname;
    
    if (path.includes('/html/')) {
      // Está em /html/, precisa subir um nível
      return '../' + filePath;
    } else if (path.includes('/questoes/')) {
      // Está em /questoes/
      return '../' + filePath;
    } else if (path.includes('/videos/')) {
      // Está em /videos/
      return '../' + filePath;
    } else if (path.includes('/IA/')) {
      // Está em /IA/
      return '../' + filePath;
    } else {
      // Está na raiz
      return filePath;
    }
  }

  // Fallback: aponta applyTranslations globalmente para uso manual
  window.__applyTranslations = applyTranslations;

})();
