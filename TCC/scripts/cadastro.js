
// ===== INICIALIZAÇÃO DO i18next =====
// Configura o sistema de tradução com suporte a Português, Inglês e Espanhol
i18next.init({
    lng: 'pt', // idioma padrão é português
    debug: false,
    resources: {
        // Traduções em Português
        pt: {
            translation: {
                "cadastro-title": "Crie sua conta",
                "nome-completo": "Nome completo",
                "email": "E-mail",
                "usuario": "Usuário",
                "senha": "Senha",
                "cadastrar": "Cadastrar",
                "social-text": "Ou cadastre-se com:",
                "tem-conta": "Já tem uma conta?",
                "entrar": "Entrar",
                "voltar-inicio": "Voltar para a página inicial"
            }
        },
        // Traduções em Inglês
        en: {
            translation: {
                "cadastro-title": "Create Your Account",
                "nome-completo": "Full Name",
                "email": "Email",
                "usuario": "Username",
                "senha": "Password",
                "cadastrar": "Sign Up",
                "social-text": "Or sign up with:",
                "tem-conta": "Already have an account?",
                "entrar": "Sign In",
                "voltar-inicio": "Back to homepage"
            }
        },
        // Traduções em Espanhol
        es: {
            translation: {
                "cadastro-title": "Crea tu cuenta",
                "nome-completo": "Nombre Completo",
                "email": "Correo Electrónico",
                "usuario": "Nombre de Usuario",
                "senha": "Contraseña",
                "cadastrar": "Registrarse",
                "social-text": "O regístrate con:",
                "tem-conta": "¿Ya tienes cuenta?",
                "entrar": "Inicia Sesión",
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