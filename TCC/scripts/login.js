// ===== INICIALIZAÇÃO DO i18next =====
// Configura o sistema de tradução com suporte a Português, Inglês e Espanhol
i18next.init({
    lng: 'pt', // idioma padrão é português
    debug: false,
    resources: {
        // Traduções em Português
        pt: {
            translation: {
                "login-title": "Bem-vindo ao StudyPro",
                "user-email": "Usuário ou E-mail",
                "password": "Senha",
                "entrar": "Entrar",
                "social-text": "Ou entre com:",
                "no-account": "Não tem uma conta?",
                "cadastrese": "Cadastre-se",
                "voltar-inicio": "Voltar para a página inicial"
            }
        },
        // Traduções em Inglês
        en: {
            translation: {
                "login-title": "Welcome to StudyPro",
                "user-email": "Username or Email",
                "password": "Password",
                "entrar": "Sign In",
                "social-text": "Or sign in with:",
                "no-account": "Don't have an account?",
                "cadastrese": "Sign Up",
                "voltar-inicio": "Back to homepage"
            }
        },
        // Traduções em Espanhol
        es: {
            translation: {
                "login-title": "Bienvenido a StudyPro",
                "user-email": "Usuario o Correo Electrónico",
                "password": "Contraseña",
                "entrar": "Iniciar Sesión",
                "social-text": "O inicia sesión con:",
                "no-account": "¿No tienes una cuenta?",
                "cadastrese": "Regístrate",
                "voltar-inicio": "Volver a la página de inicio"
            }
        }
    }
}, function (err, t) {
    updateContent();
});

// ===== FUNÇÃO: Atualizar Conteúdo da Página =====
function updateContent() {
    // Atualiza textos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });

    // Atualiza placeholders com data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18next.t(key);
    });
}

// ===== CONTROLE DO DROPDOWN DE IDIOMA =====
const langToggle = document.getElementById('lang-toggle');
const langMenu = document.getElementById('lang-menu');
const currentLang = document.getElementById('current-lang');
const arrow = langToggle.querySelector('.arrow');

// Clique no botão de idioma: abre/fecha menu
langToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    langMenu.classList.toggle('show');
    langToggle.classList.toggle('active');
    if (langToggle.classList.contains('active')) {
        arrow.style.transform = 'rotate(90deg)';
    } else {
        arrow.style.transform = 'rotate(0deg)';
    }
});

// Clique em uma opção de idioma
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function () {
        const newLang = this.getAttribute('data-lang');
        currentLang.textContent = newLang.toUpperCase();
        i18next.changeLanguage(newLang, function () {
            updateContent();
        });
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
    });
});

// Clique fora fecha o dropdown
document.addEventListener('click', function (e) {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
    }
});