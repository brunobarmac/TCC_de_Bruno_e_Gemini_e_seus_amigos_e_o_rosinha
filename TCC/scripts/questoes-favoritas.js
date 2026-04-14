/*
    ================================================================================
    SEÇÃO: JAVASCRIPT - FUNCIONALIDADES DINÂMICAS
    Gerenciamento de questões favoritas e interatividade da página
    ================================================================================
    */

/*
===== CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS =====
Carregamento de dados persistentes do localStorage
Estado da aplicação para gerenciamento de favoritos
*/
let favorites = JSON.parse(localStorage.getItem('studyPro_favorites') || '[]'); // Array de questões favoritas

/*
===== INICIALIZAÇÃO DO SISTEMA DE TRADUÇÃO (i18next) =====
Configuração completa do sistema multilíngue
Suporte a português, inglês e espanhol com recursos específicos da página
Callback para carregamento inicial dos dados após tradução
*/
i18next.init({
    lng: localStorage.getItem('studyPro_lang') || 'pt', // Idioma salvo ou padrão português
    debug: false, // Modo debug desabilitado para produção
    resources: {
        // ===== RECURSOS DE TRADUÇÃO EM PORTUGUÊS =====
        pt: {
            translation: {
                "voltar": "Voltar",
                "questionario": "Questionário",
                "questoes-favoritas": "Questões favoritas",
                "desempenho": "Desempenho",
                "sala-trofeus": "Sala de Troféus",
                "tutorial-ia": "Tutorial IA",
                "favoritas-title": "Suas Questões Favoritas",
                "favoritas-desc": "Aqui estão todas as questões que você marcou para revisar mais tarde.",
                "remover": "Remover",
                "nenhuma-favorita": "Você ainda não favoritou nenhuma questão.",
                "favoritar-dica": "Para favoritar uma questão, clique no coração durante o questionário.",
                "privacy": "Política de Privacidade",
                "terms": "Termos de Uso",
                "contact": "Contato"
            }
        },
        // ===== RECURSOS DE TRADUÇÃO EM INGLÊS =====
        en: {
            translation: {
                "voltar": "Back",
                "questionario": "Questionnaire",
                "questoes-favoritas": "Favorite Questions",
                "desempenho": "Performance",
                "sala-trofeus": "Trophy Room",
                "tutorial-ia": "AI Tutorial",
                "favoritas-title": "Your Favorite Questions",
                "favoritas-desc": "Here are all the questions you marked to review later.",
                "remover": "Remove",
                "nenhuma-favorita": "You haven't favorited any questions yet.",
                "favoritar-dica": "To favorite a question, click the heart during the questionnaire.",
                "privacy": "Privacy Policy",
                "terms": "Terms of Use",
                "contact": "Contact"
            }
        },
        // ===== RECURSOS DE TRADUÇÃO EM ESPANHOL =====
        es: {
            translation: {
                "voltar": "Volver",
                "questionario": "Cuestionario",
                "questoes-favoritas": "Preguntas favoritas",
                "desempenho": "Rendimiento",
                "sala-trofeus": "Sala de Trofeos",
                "tutorial-ia": "Tutorial IA",
                "favoritas-title": "Tus Preguntas Favoritas",
                "favoritas-desc": "Aquí están todas las preguntas que marcaste para revisar más tarde.",
                "remover": "Remover",
                "nenhuma-favorita": "Aún no has marcado ninguna pregunta como favorita.",
                "favoritar-dica": "Para marcar una pregunta como favorita, haz clic en el corazón durante el cuestionario.",
                "privacy": "Política de Privacidad",
                "terms": "Términos de Uso",
                "contact": "Contacto"
            }
        }
    }
}, function (err, t) {
    // Callback executado após inicialização das traduções
    updateTranslations(); // Atualiza textos da interface
    loadFavorites(); // Carrega lista de favoritos
});

/*
===== FUNÇÕES PRINCIPAIS =====
Conjunto de funções para manipulação de favoritos e atualização da interface
*/

/*
FUNÇÃO: ATUALIZAR TRADUÇÕES
Percorre todos os elementos com data-i18n e atualiza seu conteúdo
Chamada sempre que o idioma é alterado
*/
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });
}

/**
 * FUNÇÃO: CARREGAR FAVORITOS
 * Função principal que carrega e exibe todas as questões favoritas
 * Recupera dados do localStorage e cria elementos HTML dinâmicos
 * Trata casos especiais como lista vazia
 */
function loadFavorites() {
    // Recarrega dados mais recentes do localStorage
    favorites = JSON.parse(localStorage.getItem('studyPro_favorites') || '[]');
    const favoritesList = document.getElementById('favorites-list');

    /**
     * CASO ESPECIAL: LISTA VAZIA
     * Quando não há favoritos, mostra mensagem explicativa com ícone
     * Orienta usuário sobre como favoritar questões
     */
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
                    <div class="no-favorites">
                        <i class="fas fa-star-half-alt"></i>
                        <h3 data-i18n="nenhuma-favorita">Você ainda não favoritou nenhuma questão.</h3>
                        <p data-i18n="favoritar-dica">Para favoritar uma questão, clique na estrela durante o questionário.</p>
                    </div>
                `;
        return;
    }

    /**
     * RENDERIZAÇÃO DOS FAVORITOS
     * Para cada questão favorita, cria um card clicável que:
     * - Exibe o texto da pergunta
     * - Mostra as opções (com destaque para a correta)
     * - Permite clicar para ir direto àquela questão no questionário
     */
    favoritesList.innerHTML = ''; // Limpa conteúdo anterior

    favorites.forEach((favorite, index) => {
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'favorite-item';

        // Deixa o card clicável para navegar direto para a questão
        favoriteCard.style.cursor = 'pointer';
        favoriteCard.addEventListener('click', () => {
            // Passa o índice da questão via sessionStorage
            sessionStorage.setItem('goToQuestion', favorite.questionIndex);
            // Redireciona para o questionário
            window.location.href = 'questionario.html';
        });

        // Estrutura HTML do card de favorito
        favoriteCard.innerHTML = `
                    <!-- CABEÇALHO DO CARD -->
                    <div class="favorite-header">
                        <span class="favorite-subject">Questão ${favorite.questionIndex + 1}</span>
                        <button class="btn-remove" onclick="event.stopPropagation(); removeFavorite(${index})" data-i18n="remover">✕ Remover</button>
                    </div>

                    <!-- TEXTO DA PERGUNTA -->
                    <div class="favorite-question">${favorite.question}</div>

                    <!-- OPÇÕES DE RESPOSTA -->
                    <div class="favorite-options">
                        ${favorite.options.map((option, optIndex) =>
            `<div class="option ${optIndex === favorite.correct ? 'correct' : ''}">${String.fromCharCode(65 + optIndex)}) ${option}</div>`
        ).join('')}
                    </div>

                    <!-- EXPLICAÇÃO DA RESPOSTA -->
                    <div class="favorite-explanation">
                        <strong>Explicação:</strong> ${favorite.explanation}
                    </div>
                `;

        favoritesList.appendChild(favoriteCard);
    });
}

/**
 * FUNÇÃO: REMOVER FAVORITO
 * Remove uma questão específica da lista de favoritos
 * Atualiza localStorage e recarrega a interface
 * Recebe o índice da questão a ser removida
 */
function removeFavorite(index) {
    // Remove item do array pelo índice
    favorites.splice(index, 1);

    // Salva alterações no localStorage
    localStorage.setItem('studyPro_favorites', JSON.stringify(favorites));

    // Recarrega interface para refletir mudanças
    loadFavorites();
}

/**
===== EVENT LISTENERS =====
Configuração de interatividade da página
-->

<!--
EVENTO: DROPDOWN DE IDIOMA
Controle de abertura/fechamento do menu de seleção de idioma
Animação da seta e gerenciamento de estado visual
-->
document.getElementById('lang-toggle').addEventListener('click', (e) => {
    e.stopPropagation(); // Previne propagação do evento
    const langMenu = document.getElementById('lang-menu');
    const langToggle = document.getElementById('lang-toggle');
    const arrow = langToggle.querySelector('.arrow');

    // Toggle das classes para mostrar/ocultar menu
    langMenu.classList.toggle('show');
    langToggle.classList.toggle('active');

    // Animação da seta (rotação)
    arrow.style.transform = langToggle.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
});

<!--
EVENTO: SELEÇÃO DE IDIOMA
Processa mudança de idioma e atualiza toda a interface
Salva preferência no localStorage para persistência
Fecha menu após seleção
-->
document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');

        // Muda idioma no i18next
        i18next.changeLanguage(lang, updateTranslations);

        // Salva preferência do usuário
        localStorage.setItem('studyPro_lang', lang);

        // Atualiza indicador visual
        document.getElementById('current-lang').textContent = lang.toUpperCase();

        // Fecha menu e reseta estado visual
        document.getElementById('lang-menu').classList.remove('show');
        document.getElementById('lang-toggle').classList.remove('active');
        document.getElementById('lang-toggle').querySelector('.arrow').style.transform = 'rotate(0deg)';

        // Recarrega favoritos para atualizar textos
        loadFavorites();
    });
});

/*
EVENTO: FECHAR MENU AO CLICAR FORA
Fecha o dropdown de idioma quando usuário clica em qualquer lugar fora
Melhora experiência do usuário evitando menu aberto desnecessariamente
*/
document.addEventListener('click', (e) => {
    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');

    // Fecha menu se clique foi fora do toggle
    if (!langToggle.contains(e.target)) {
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
        langToggle.querySelector('.arrow').style.transform = 'rotate(0deg)';
    }
});

/*
EVENTO: ANO NO RODAPÉ
Define ano atual dinamicamente no copyright
Mantém informação sempre atualizada
*/
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();