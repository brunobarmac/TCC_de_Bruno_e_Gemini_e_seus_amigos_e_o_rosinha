/*
    ================================================================================
    SEÇÃO: JAVASCRIPT - FUNCIONALIDADES DINÂMICAS
    Sistema de internacionalização, controles interativos e funcionalidades específicas
    ================================================================================
    */
/*
===== CONFIGURAÇÃO DO SISTEMA DE TRADUÇÃO (i18next) =====
Inicializa biblioteca i18next com suporte completo a três idiomas
Recursos extensivos para cobrir todas as strings da interface de configurações
*/
i18next.init({
    lng: 'pt', // Idioma padrão: Português
    debug: false, // Modo debug desabilitado para produção
    resources: {
        // ===== RECURSOS DE TRADUÇÃO EM PORTUGUÊS =====
        pt: {
            translation: {
                "config-title": "Configurações da Conta",
                "voltar": "Voltar",
                "perfil": "Perfil",
                "foto-perfil": "Foto de Perfil",
                "mudar-foto": "Mudar Foto",
                "nome-completo": "Nome Completo",
                "email": "Email",
                "usuario": "Nome de Usuário",
                "seguranca": "Segurança",
                "senha-atual": "Senha Atual",
                "nova-senha": "Nova Senha",
                "confirmar-senha": "Confirmar Senha",
                "dois-fatores": "Ativar Autenticação de Dois Fatores",
                "preferencias": "Preferências",
                "idioma-padrao": "Idioma Padrão",
                "portugues": "Português",
                "ingles": "Inglês",
                "espanhol": "Espanhol",
                "tema": "Tema",
                "tema-claro": "Claro",
                "tema-escuro": "Escuro",
                "notif-email": "Receber notificações por email",
                "notif-push": "Receber notificações push",
                "salvar": "Salvar Alterações",
                "cancelar": "Cancelar",
                "sair": "Sair da Conta",
                "footer-texto": "© 2024 StudyPro. Todos os direitos reservados."
            }
        },
        // ===== RECURSOS DE TRADUÇÃO EM INGLÊS =====
        en: {
            translation: {
                "config-title": "Account Settings",
                "voltar": "Back",
                "perfil": "Profile",
                "foto-perfil": "Profile Picture",
                "mudar-foto": "Change Photo",
                "nome-completo": "Full Name",
                "email": "Email",
                "usuario": "Username",
                "seguranca": "Security",
                "senha-atual": "Current Password",
                "nova-senha": "New Password",
                "confirmar-senha": "Confirm Password",
                "dois-fatores": "Enable Two-Factor Authentication",
                "preferencias": "Preferences",
                "idioma-padrao": "Default Language",
                "portugues": "Portuguese",
                "ingles": "English",
                "espanhol": "Spanish",
                "tema": "Theme",
                "tema-claro": "Light",
                "tema-escuro": "Dark",
                "notif-email": "Receive email notifications",
                "notif-push": "Receive push notifications",
                "salvar": "Save Changes",
                "cancelar": "Cancel",
                "sair": "Sign Out",
                "footer-texto": "© 2024 StudyPro. All rights reserved."
            }
        },
        // ===== RECURSOS DE TRADUÇÃO EM ESPANHOL =====
        es: {
            translation: {
                "config-title": "Configuración de la Cuenta",
                "voltar": "Volver",
                "perfil": "Perfil",
                "foto-perfil": "Foto de Perfil",
                "mudar-foto": "Cambiar Foto",
                "nome-completo": "Nombre Completo",
                "email": "Correo Electrónico",
                "usuario": "Nombre de Usuario",
                "seguranca": "Seguridad",
                "senha-atual": "Contraseña Actual",
                "nova-senha": "Nueva Contraseña",
                "confirmar-senha": "Confirmar Contraseña",
                "dois-fatores": "Habilitar Autenticación de Dos Factores",
                "preferencias": "Preferencias",
                "idioma-padrao": "Idioma Predeterminado",
                "portugues": "Portugués",
                "ingles": "Inglés",
                "espanhol": "Español",
                "tema": "Tema",
                "tema-claro": "Claro",
                "tema-escuro": "Oscuro",
                "notif-email": "Recibir notificaciones por correo electrónico",
                "notif-push": "Recibir notificaciones push",
                "salvar": "Guardar Cambios",
                "cancelar": "Cancelar",
                "sair": "Cerrar Sesión",
                "footer-texto": "© 2024 StudyPro. Todos los derechos reservados."
            }
        }
    }
}, function (err, t) {
    // Callback executado após inicialização bem-sucedida
    // Atualiza imediatamente todo o conteúdo da página com traduções
    updateContent();
});

/*
===== FUNÇÃO: ATUALIZAR CONTEÚDO DA PÁGINA =====
Percorre todos os elementos com atributo data - i18n
Substitui o conteúdo interno pelas traduções correspondentes
Usa innerHTML para preservar formatação HTML se necessário
*/
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = i18next.t(key);
    });
}

/*
    ===== CONTROLE DO DROPDOWN DE IDIOMA =====
Sistema interativo para seleção de idioma
    Mesma implementação das outras páginas para consistência
*/
const langToggle = document.getElementById('lang-toggle');
const langMenu = document.getElementById('lang-menu');
const currentLang = document.getElementById('current-lang');
const arrow = langToggle.querySelector('.arrow');

/*
EVENTO: CLIQUE NO BOTÃO DE IDIOMA
Abre / fecha menu dropdown com animação visual da seta
Previne propagação para evitar conflitos com outros eventos
*/
langToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    langMenu.classList.toggle('show'); // Exibe/oculta menu
    langToggle.classList.toggle('active'); // Estilo ativo do botão

    // Animação da seta: rotação de 90 graus quando expandido
    if (langToggle.classList.contains('active')) {
        arrow.style.transform = 'rotate(90deg)';
    } else {
        arrow.style.transform = 'rotate(0deg)';
    }
});

/*
EVENTO: SELEÇÃO DE IDIOMA
Atualiza idioma atual e aplica mudanças em toda a interface
Fecha automaticamente o dropdown após seleção
*/
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function () {
        const newLang = this.getAttribute('data-lang');
        currentLang.textContent = newLang.toUpperCase(); // Atualiza indicador

        // Muda idioma no i18next e atualiza toda a página
        i18next.changeLanguage(newLang, function () {
            updateContent();
        });

        // Fecha dropdown e reseta animações
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
    });
});

/*
EVENTO: CLIQUE FORA DO DROPDOWN
Fecha menu automaticamente quando usuário clica em outro lugar
Melhora UX evitando dropdowns abertos desnecessariamente
*/
document.addEventListener('click', function (e) {
    if (!langToggle.contains(e.target)) {
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
    }
});

/*
===== FUNCIONALIDADE: UPLOAD DE FOTO DE PERFIL =====
Sistema para alteração da imagem de perfil do usuário
Interface intuitiva com preview em tempo real

EVENTO: CLIQUE NO BOTÃO "MUDAR FOTO"
Gatilho para abrir seletor de arquivo nativo do navegador
Usa input oculto para melhor controle da experiência
*/
document.querySelector('.btn-change-photo').addEventListener('click', function () {
    document.getElementById('photo-input').click();
});

/*
EVENTO: SELEÇÃO DE ARQUIVO DE IMAGEM
Processa arquivo selecionado e atualiza preview
Usa FileReader API para converter imagem em data URL
*/
document.getElementById('photo-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            // Atualiza src da imagem com dados do arquivo
            document.getElementById('profile-image').src = event.target.result;
        };
        reader.readAsDataURL(file); // Converte arquivo para base64
    }
});

/*
===== FUNCIONALIDADES DOS BOTÕES DE AÇÃO =====
Handlers para os três botões principais da página
Cada um executa ação específica com feedback apropriado

BOTÃO SALVAR ALTERAÇÕES
Ação primária - deveria enviar dados para servidor
Atualmente mostra placeholder com alert (TODO: implementar backend)
*/
document.querySelector('.btn-primary').addEventListener('click', function () {
    alert(i18next.t('salvar') + ' clicado! Aqui você salvaria os dados no servidor.');
    // TODO: Implementar envio dos dados para o servidor via AJAX/fetch
});

/*
BOTÃO CANCELAR
Descarta mudanças e retorna à página inicial
Redirecionamento imediato sem confirmação
*/
document.querySelector('.btn-secondary').addEventListener('click', function () {
    window.location.href = '../index.html';
});

/*
BOTÃO SAIR DA CONTA
Ação crítica que requer confirmação do usuário
Implementa logout básico(TODO: implementar logout completo)
*/
document.querySelector('.btn-danger').addEventListener('click', function () {
    if (confirm(i18next.t('sair') + '?')) {
        // TODO: Implementar logout completo (limpar sessão, cookies, etc.)
        alert('Deslogando...');
    }
});