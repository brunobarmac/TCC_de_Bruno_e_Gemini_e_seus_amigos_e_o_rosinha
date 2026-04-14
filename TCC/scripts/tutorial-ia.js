/*
    ================================================================================
    SEÇÃO: JAVASCRIPT - FUNCIONALIDADES INTERATIVAS
    Sistema de internacionalização e controles de interface
    ================================================================================
    */

/*
INICIALIZAÇÃO DO SISTEMA DE TRADUÇÃO I18NEXT
Configura o idioma padrão (português) e define os recursos de tradução
para português, inglês e espanhol
*/
i18next.init({
    lng: 'pt', // Idioma padrão
    debug: false, // Desabilita debug em produção
    resources: {
        // RECURSOS DE TRADUÇÃO EM PORTUGUÊS
        pt: {
            translation: {
                "voltar": "Voltar",
                "questionario": "Questionário",
                "questoes-favoritas": "Questões favoritas",
                "desempenho": "Desempenho",
                "sala-trofeus": "Sala de Troféus",
                "tutorial-ia": "Tutorial IA",
                "tutorial-title": "Como Usar a IA",
                "tutorial-desc": "A inteligência artificial ajuda você a entender qualquer questão — seja em texto ou imagem.",
                "step1-title": "1. Cole o texto da questão",
                "step1-desc": "Copie a pergunta completa e cole no campo apropriado. A IA irá analisar e explicar passo a passo.",
                "step2-title": "2. Faça upload de uma foto",
                "step2-desc": "Se a questão estiver em papel, tire uma foto e cole aqui. O sistema reconhecerá o texto automaticamente.",
                "step3-title": "3. Receba explicações e exemplos",
                "step3-desc": "A IA fornecerá uma explicação detalhada, fontes e dicas para ajudar na sua compreensão.",
                "privacy": "Política de Privacidade",
                "terms": "Termos de Uso",
                "contact": "Contato"
            }
        },
        // RECURSOS DE TRADUÇÃO EM INGLÊS
        en: {
            translation: {
                "voltar": "Back",
                "questionario": "Questionnaire",
                "questoes-favoritas": "Favorite Questions",
                "desempenho": "Performance",
                "sala-trofeus": "Trophy Room",
                "tutorial-ia": "AI Tutorial",
                "tutorial-title": "How to Use the AI",
                "tutorial-desc": "The artificial intelligence helps you understand any question — text or image.",
                "step1-title": "1. Paste the question text",
                "step1-desc": "Copy the entire question and paste it in the appropriate field. The AI will analyze and explain it step-by-step.",
                "step2-title": "2. Upload a photo",
                "step2-desc": "If the question is on paper, take a photo and paste it here. The system will recognize the text automatically.",
                "step3-title": "3. Receive explanations and examples",
                "step3-desc": "The AI will provide a detailed explanation, sources and tips to aid your understanding.",
                "privacy": "Privacy Policy",
                "terms": "Terms of Use",
                "contact": "Contact"
            }
        },
        // RECURSOS DE TRADUÇÃO EM ESPANHOL
        es: {
            translation: {
                "voltar": "Volver",
                "questionario": "Cuestionario",
                "questoes-favoritas": "Preguntas favoritas",
                "desempenho": "Desempeño",
                "sala-trofeus": "Sala de Trofeos",
                "tutorial-ia": "Tutorial IA",
                "tutorial-title": "Cómo Usar la IA",
                "tutorial-desc": "La inteligencia artificial te ayuda a comprender cualquier pregunta, ya sea en texto o imagen.",
                "step1-title": "1. Pega el texto de la pregunta",
                "step1-desc": "Copia la pregunta completa y pégala en el campo correspondiente. La IA la analizará y explicará paso a paso.",
                "step2-title": "2. Sube una foto",
                "step2-desc": "Si la pregunta está en papel, toma una foto y pégala aquí. El sistema reconocerá el texto automáticamente.",
                "step3-title": "3. Recibe explicaciones y ejemplos",
                "step3-desc": "La IA proporcionará una explicación detallada, fuentes y consejos para ayudarte a comprender.",
                "privacy": "Política de Privacidad",
                "terms": "Términos de Uso",
                "contact": "Contacto"
            }
        }
    }
}, function (err, t) { updateContent(); }); // Callback executa updateContent após inicialização

/*
FUNÇÃO DE ATUALIZAÇÃO DE CONTEÚDO TRADUZÍVEL
Substitui o texto de todos os elementos com atributo data-i18n
pelas traduções correspondentes do idioma atual
*/
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerHTML = i18next.t(el.getAttribute('data-i18n'));
    });
}

/*
CONTROLES DO DROPDOWN DE IDIOMA
Gerencia a abertura/fechamento do menu e seleção de idioma
*/
const langToggle = document.getElementById('lang-toggle'); // Botão do dropdown
const langMenu = document.getElementById('lang-menu'); // Menu de opções
const currentLang = document.getElementById('current-lang'); // Texto do idioma atual
const arrow = langToggle.querySelector('.arrow'); // Seta do dropdown

/*
EVENT LISTENER PARA CLIQUE NO BOTÃO DO DROPDOWN
Alterna visibilidade do menu e rotação da seta
*/
langToggle.addEventListener('click', function (e) {
    e.stopPropagation(); // Previne propagação do evento
    langMenu.classList.toggle('show'); // Mostra/esconde menu
    langToggle.classList.toggle('active'); // Classe ativa para estilização
    arrow.style.transform = langToggle.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)'; // Rotação da seta
});

/*
EVENT LISTENERS PARA OPÇÕES DE IDIOMA
Permite mudança de idioma ao clicar em uma opção
*/
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function () {
        const newLang = this.getAttribute('data-lang'); // Obtém código do idioma
        currentLang.textContent = newLang.toUpperCase(); // Atualiza texto do botão
        i18next.changeLanguage(newLang, updateContent); // Muda idioma e atualiza conteúdo
        langMenu.classList.remove('show'); // Fecha menu
        langToggle.classList.remove('active'); // Remove classe ativa
        arrow.style.transform = 'rotate(0deg)'; // Reseta rotação da seta
    });
});

/*
EVENT LISTENER PARA CLIQUES FORA DO DROPDOWN
Fecha o menu quando usuário clica em qualquer lugar fora
*/
document.addEventListener('click', function (e) {
    if (!langToggle.contains(e.target)) { // Verifica se clique foi fora do dropdown
        langMenu.classList.remove('show'); // Fecha menu
        langToggle.classList.remove('active'); // Remove classe ativa
        arrow.style.transform = 'rotate(0deg)'; // Reseta rotação da seta
    }
});

/*
ATUALIZAÇÃO DO ANO NO RODAPÉ
Define o ano atual dinamicamente no copyright
*/
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();