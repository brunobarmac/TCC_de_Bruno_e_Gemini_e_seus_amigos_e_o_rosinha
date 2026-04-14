/*
    ================================================================================
    SEÇÃO: JAVASCRIPT - SISTEMA COMPLETO DE TROFÉUS E CONQUISTAS
    Gerenciamento de conquistas, gamificação e interatividade da sala de troféus
    ================================================================================
    */

/*
===== CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS =====
Definição do sistema de troféus e carregamento de dados persistentes
Integração com localStorage para manter progresso e estatísticas
*/

/*
ARRAY DE TROFÉUS DISPONÍVEIS
Definição completa de todas as conquistas possíveis no sistema
Cada troféu tem: id único, título, descrição, ícone, categoria, requisito, recompensa e raridade
Sistema estruturado para facilitar expansão e manutenção
*/
const trophies = [
    // TROFÉU BÁSICO - Primeira interação
    {
        id: 'first_question',
        title: 'Primeira Questão',
        description: 'Responda sua primeira questão',
        icon: '🎯',
        category: 'basico',
        requirement: { type: 'questions_answered', value: 1 },
        reward: { points: 10, xp: 50 },
        rarity: 'comum'
    },
    // TROFÉU AVANÇADO - Conclusão total
    {
        id: 'phase_master',
        title: 'Mestre das Fases',
        description: 'Complete todas as 10 fases',
        icon: '👑',
        category: 'fases',
        requirement: { type: 'phases_completed', value: 10 },
        reward: { points: 500, xp: 1000 },
        rarity: 'lendario'
    },
    // TROFÉU DE DESEMPENHO - Velocidade
    {
        id: 'speed_demon',
        title: 'Demônio da Velocidade',
        description: 'Complete uma fase em menos de 30 segundos',
        icon: '⚡',
        category: 'desempenho',
        requirement: { type: 'fast_completion', value: 1 },
        reward: { points: 100, xp: 200 },
        rarity: 'raro'
    },
    // TROFÉU DE PERFEIÇÃO - Sem erros
    {
        id: 'perfect_phase',
        title: 'Fase Perfeita',
        description: 'Complete uma fase sem errar nenhuma questão',
        icon: '💎',
        category: 'desempenho',
        requirement: { type: 'perfect_phase', value: 1 },
        reward: { points: 150, xp: 300 },
        rarity: 'epico'
    },
    // TROFÉU DE SEQUÊNCIA - Streak
    {
        id: 'streak_master',
        title: 'Mestre do Streak',
        description: 'Acumule 10 acertos consecutivos',
        icon: '🔥',
        category: 'streak',
        requirement: { type: 'streak', value: 10 },
        reward: { points: 75, xp: 150 },
        rarity: 'raro'
    },
    // TROFÉU DE COLEÇÃO - Favoritos
    {
        id: 'favorite_collector',
        title: 'Colecionador de Favoritos',
        description: 'Salve 20 questões nos favoritos',
        icon: '⭐',
        category: 'favoritos',
        requirement: { type: 'favorites_saved', value: 20 },
        reward: { points: 50, xp: 100 },
        rarity: 'comum'
    },
    // TROFÉU DE ATIVIDADE - Diário
    {
        id: 'daily_warrior',
        title: 'Guerreiro Diário',
        description: 'Use o site por 7 dias consecutivos',
        icon: '📅',
        category: 'atividade',
        requirement: { type: 'daily_streak', value: 7 },
        reward: { points: 200, xp: 400 },
        rarity: 'epico'
    },
    // TROFÉU DE PROGRESSO - Volume
    {
        id: 'knowledge_seeker',
        title: 'Buscador do Conhecimento',
        description: 'Responda 100 questões no total',
        icon: '📚',
        category: 'progresso',
        requirement: { type: 'total_questions', value: 100 },
        reward: { points: 300, xp: 600 },
        rarity: 'raro'
    },
    // TROFÉU ESPECÍFICO - Modalidade tradicional
    {
        id: 'tradition_expert',
        title: 'Especialista Tradicional',
        description: 'Complete 5 questionários tradicionais',
        icon: '🎓',
        category: 'tradicional',
        requirement: { type: 'traditional_completed', value: 5 },
        reward: { points: 250, xp: 500 },
        rarity: 'raro'
    },
    // TROFÉU DE EXPLORAÇÃO - Multilíngue
    {
        id: 'multilingual',
        title: 'Multilíngue',
        description: 'Mude o idioma do site 3 vezes',
        icon: '🌍',
        category: 'exploracao',
        requirement: { type: 'language_changes', value: 3 },
        reward: { points: 25, xp: 50 },
        rarity: 'comum'
    }
];

/*
DADOS DE PROGRESSO E ESTATÍSTICAS
Carregamento de dados persistentes do usuário
Estatísticas abrangentes para rastreamento de conquistas
*/
let userProgress = JSON.parse(localStorage.getItem('studyPro_progress')) || {};
let userStats = JSON.parse(localStorage.getItem('studyPro_stats')) || {
    questionsAnswered: 0,    // Total de questões respondidas
    phasesCompleted: 0,      // Fases concluídas
    totalPoints: 0,          // Pontos acumulados
    totalXP: 0,              // Experiência total
    perfectPhases: 0,        // Fases perfeitas (sem erros)
    currentStreak: 0,        // Sequência atual de acertos
    maxStreak: 0,            // Melhor sequência
    favoritesSaved: 0,       // Questões favoritadas
    traditionalCompleted: 0, // Questionários tradicionais
    languageChanges: 0,      // Mudanças de idioma
    dailyStreak: 0,          // Dias consecutivos de uso
    lastVisit: null,         // Última visita
    fastCompletions: 0       // Conclusões rápidas (<30s)
};

/*
===== INICIALIZAÇÃO DO SISTEMA DE TRADUÇÃO (i18next) =====
Configuração completa do sistema multilíngue
Suporte a português, inglês e espanhol com recursos específicos da sala de troféus
Callback para carregamento inicial do sistema de troféus
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
                "trofeus-title": "🏆 Sua Sala de Troféus",
                "trofeus-desc": "Colecione conquistas ao completar fases, responder questões e usar o site diariamente.",
                "trofeus-conquistados": "Troféus Conquistados",
                "pontos-totais": "Pontos Totais",
                "taxa-conclusao": "Taxa de Conclusão",
                "todos": "Todos",
                "conquistados": "Conquistados",
                "bloqueados": "Bloqueados",
                "recompensa": "Recompensa:",
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
                "trofeus-title": "🏆 Your Trophy Room",
                "trofeus-desc": "Collect achievements by completing phases, answering questions and using the site daily.",
                "trofeus-conquistados": "Trophies Earned",
                "pontos-totais": "Total Points",
                "taxa-conclusao": "Completion Rate",
                "todos": "All",
                "conquistados": "Earned",
                "bloqueados": "Locked",
                "recompensa": "Reward:",
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
                "trofeus-title": "🏆 Tu Sala de Trofeos",
                "trofeus-desc": "Colecciona logros al completar fases, responder preguntas y usar el sitio diariamente.",
                "trofeus-conquistados": "Trofeos Ganados",
                "pontos-totais": "Puntos Totales",
                "taxa-conclusao": "Tasa de Finalización",
                "todos": "Todos",
                "conquistados": "Ganados",
                "bloqueados": "Bloqueados",
                "recompensa": "Recompensa:",
                "privacy": "Política de Privacidad",
                "terms": "Términos de Uso",
                "contact": "Contacto"
            }
        }
    }
}, function (err, t) {
    // Callback executado após inicialização das traduções
    updateTranslations(); // Atualiza textos da interface
    initTrophySystem(); // Inicializa sistema completo de troféus
});

/*
===== FUNÇÕES PRINCIPAIS =====
Conjunto de funções para gerenciamento completo do sistema de troféus
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

/*
FUNÇÃO: INICIALIZAR SISTEMA DE TROFÉUS
Função principal que coordena o carregamento e exibição de todo o sistema
Chama todas as funções necessárias para preparar a interface
*/
function initTrophySystem() {
    updateUserStats();      // Atualiza estatísticas do usuário
    renderTrophies();       // Renderiza galeria de troféus
    updateStatsOverview();  // Atualiza painel de estatísticas
    checkNewAchievements(); // Verifica novas conquistas
}

/*
FUNÇÃO: ATUALIZAR ESTATÍSTICAS DO USUÁRIO
Calcula estatísticas dinâmicas baseadas no progresso armazenado
Atualiza contadores de fases, favoritos e streak diário
*/
function updateUserStats() {
    // ATUALIZAÇÃO DE FASES CONCLUÍDAS
    userStats.phasesCompleted = Object.keys(userProgress).filter(key =>
        key.startsWith('phase') && userProgress[key]?.completed
    ).length;

    // ATUALIZAÇÃO DE FAVORITOS SALVOS
    userStats.favoritesSaved = (JSON.parse(localStorage.getItem('studyPro_favorites')) || []).length;

    // VERIFICAÇÃO DE STREAK DIÁRIO
    const today = new Date().toDateString();
    const lastVisit = userStats.lastVisit;

    if (lastVisit === today) {
        // Já visitou hoje - mantém streak
    } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
        // Visitou ontem - incrementa streak
        userStats.dailyStreak++;
    } else {
        // Quebrou streak - reinicia contador
        userStats.dailyStreak = 1;
    }

    userStats.lastVisit = today;
    localStorage.setItem('studyPro_stats', JSON.stringify(userStats));
}

/*
FUNÇÃO: RENDERIZAR TROFÉUS
Cria e exibe cards de troféus dinamicamente na galeria
Aplica filtros e mostra progresso visual para cada conquista
Recebe parâmetro opcional de filtro (all, unlocked, locked)
*/
function renderTrophies(filter = 'all') {
    const gallery = document.getElementById('trophy-gallery');
    gallery.innerHTML = ''; // Limpa conteúdo anterior

    trophies.forEach(trophy => {
        const isUnlocked = checkTrophyUnlocked(trophy); // Verifica se conquistado
        const progress = getTrophyProgress(trophy);     // Obtém progresso atual

        // APLICAÇÃO DE FILTROS
        if (filter === 'all' ||
            (filter === 'unlocked' && isUnlocked) ||
            (filter === 'locked' && !isUnlocked)) {

            // CRIAÇÃO DO CARD DO TROFÉU
            const trophyCard = document.createElement('div');
            trophyCard.className = `trophy-card ${isUnlocked ? 'unlocked' : 'locked'} ${trophy.rarity}`;
            trophyCard.setAttribute('data-trophy', trophy.id);

            trophyCard.innerHTML = `
                        <!-- ÍCONE DO TROFÉU -->
                        <div class="trophy-icon">${isUnlocked ? trophy.icon : '🔒'}</div>

                        <!-- INFORMAÇÕES DO TROFÉU -->
                        <div class="trophy-info">
                            <h3 class="trophy-title">${trophy.title}</h3>
                            <p class="trophy-desc">${trophy.description}</p>

                            <!-- BARRA DE PROGRESSO -->
                            <div class="trophy-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                                </div>
                                <span class="progress-text">${progress.current}/${progress.total}</span>
                            </div>
                        </div>

                        <!-- RECOMPENSA DO TROFÉU -->
                        <div class="trophy-reward">
                            <span class="reward-points">+${trophy.reward.points} pts</span>
                            <span class="reward-xp">+${trophy.reward.xp} XP</span>
                        </div>
                    `;

            // EVENTO DE CLIQUE - Abre modal de detalhes
            trophyCard.addEventListener('click', () => showTrophyModal(trophy, isUnlocked, progress));
            gallery.appendChild(trophyCard);
        }
    });
}

/*
FUNÇÃO: VERIFICAR SE TROFÉU ESTÁ DESBLOQUEADO
Avalia condições específicas de cada tipo de troféu
Retorna boolean indicando se o usuário conquistou a conquista
*/
function checkTrophyUnlocked(trophy) {
    const req = trophy.requirement;
    switch (req.type) {
        case 'questions_answered':
            return userStats.questionsAnswered >= req.value;
        case 'phases_completed':
            return userStats.phasesCompleted >= req.value;
        case 'fast_completion':
            return userStats.fastCompletions >= req.value;
        case 'perfect_phase':
            return userStats.perfectPhases >= req.value;
        case 'streak':
            return userStats.maxStreak >= req.value;
        case 'favorites_saved':
            return userStats.favoritesSaved >= req.value;
        case 'daily_streak':
            return userStats.dailyStreak >= req.value;
        case 'total_questions':
            return userStats.questionsAnswered >= req.value;
        case 'traditional_completed':
            return userStats.traditionalCompleted >= req.value;
        case 'language_changes':
            return userStats.languageChanges >= req.value;
        default:
            return false;
    }
}

/*
FUNÇÃO: OBTER PROGRESSO DO TROFÉU
Calcula progresso atual e percentual para troféus bloqueados
Retorna objeto com valores current/total/percentage
*/
function getTrophyProgress(trophy) {
    const req = trophy.requirement;
    let current = 0;

    switch (req.type) {
        case 'questions_answered':
            current = userStats.questionsAnswered;
            break;
        case 'phases_completed':
            current = userStats.phasesCompleted;
            break;
        case 'fast_completion':
            current = userStats.fastCompletions;
            break;
        case 'perfect_phase':
            current = userStats.perfectPhases;
            break;
        case 'streak':
            current = userStats.maxStreak;
            break;
        case 'favorites_saved':
            current = userStats.favoritesSaved;
            break;
        case 'daily_streak':
            current = userStats.dailyStreak;
            break;
        case 'total_questions':
            current = userStats.questionsAnswered;
            break;
        case 'traditional_completed':
            current = userStats.traditionalCompleted;
            break;
        case 'language_changes':
            current = userStats.languageChanges;
            break;
    }

    return {
        current: Math.min(current, req.value), // Não excede o máximo
        total: req.value,
        percentage: Math.min((current / req.value) * 100, 100) // Máximo 100%
    };
}

/*
FUNÇÃO: MOSTRAR MODAL DO TROFÉU
Exibe janela modal com detalhes completos do troféu selecionado
Mostra progresso, recompensas e status de desbloqueio
*/
function showTrophyModal(trophy, isUnlocked, progress) {
    const modal = document.getElementById('trophy-modal');
    const iconEl = document.getElementById('modal-trophy-icon');
    const titleEl = document.getElementById('modal-trophy-title');
    const descEl = document.getElementById('modal-trophy-desc');
    const progressSection = document.getElementById('progress-section');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const rewardText = document.getElementById('reward-text');

    // CONFIGURAÇÃO DO ÍCONE E TEXTO
    iconEl.textContent = isUnlocked ? trophy.icon : '🔒';
    titleEl.textContent = trophy.title;
    descEl.textContent = trophy.description;

    if (isUnlocked) {
        // TROFÉU CONQUISTADO - Mostra recompensa ganha
        progressSection.style.display = 'none';
        rewardText.textContent = `🏆 ${trophy.reward.points} pontos + ${trophy.reward.xp} XP conquistados!`;
    } else {
        // TROFÉU BLOQUEADO - Mostra progresso necessário
        progressSection.style.display = 'block';
        progressFill.style.width = `${progress.percentage}%`;
        progressText.textContent = `Progresso: ${progress.current}/${progress.total}`;
        rewardText.textContent = `🏆 ${trophy.reward.points} pontos + ${trophy.reward.xp} XP`;
    }

    modal.style.display = 'flex'; // Exibe modal
}

/*
FUNÇÃO: ATUALIZAR VISÃO GERAL DAS ESTATÍSTICAS
Atualiza os três indicadores principais no cabeçalho
Calcula troféus conquistados, pontos totais e taxa de conclusão
*/
function updateStatsOverview() {
    const unlockedTrophies = trophies.filter(t => checkTrophyUnlocked(t)).length;
    const totalPossibleTrophies = trophies.length;
    const completionRate = Math.round((unlockedTrophies / totalPossibleTrophies) * 100);

    document.getElementById('total-trophies').textContent = unlockedTrophies;
    document.getElementById('total-points').textContent = userStats.totalPoints;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

/*
FUNÇÃO: VERIFICAR NOVAS CONQUISTAS
Verifica se o usuário desbloqueou novos troféus
Adiciona pontos/XP e mostra notificações para conquistas recentes
*/
function checkNewAchievements() {
    trophies.forEach(trophy => {
        if (checkTrophyUnlocked(trophy) && !userStats.unlockedTrophies?.includes(trophy.id)) {
            // NOVA CONQUISTA DESCOBERTA
            if (!userStats.unlockedTrophies) userStats.unlockedTrophies = [];
            userStats.unlockedTrophies.push(trophy.id);

            // ATRIBUIÇÃO DE RECOMPENSAS
            userStats.totalPoints += trophy.reward.points;
            userStats.totalXP += trophy.reward.xp;

            // NOTIFICAÇÃO VISUAL
            showAchievementNotification(trophy);
        }
    });

    localStorage.setItem('studyPro_stats', JSON.stringify(userStats));
}

/*
FUNÇÃO: MOSTRAR NOTIFICAÇÃO DE CONQUISTA
Cria e exibe notificação temporária para novas conquistas
Animação de entrada e saída automática após 4 segundos
*/
function showAchievementNotification(trophy) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
                <div class="notification-icon">${trophy.icon}</div>
                <div class="notification-content">
                    <h4>Nova Conquista!</h4>
                    <p>${trophy.title}</p>
                    <small>+${trophy.reward.points} pontos</small>
                </div>
            `;

    document.body.appendChild(notification);

    // ANIMAÇÃO DE ENTRADA
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // ANIMAÇÃO DE SAÍDA APÓS 4 SEGUNDOS
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/*
===== EVENT LISTENERS =====
Configuração de interatividade da página
*/

/*
EVENTO: FILTROS DE TROFÉUS
Permite alternar visualização entre todos/conquistados/bloqueados
Atualiza galeria dinamicamente baseado no filtro selecionado
*/
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // GESTÃO DE ESTADO ATIVO
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // RENDERIZAÇÃO FILTRADA
        renderTrophies(btn.getAttribute('data-filter'));
    });
});

/*
EVENTO: FECHAR MODAL
Permite fechar modal de detalhes do troféu
*/
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('trophy-modal').style.display = 'none';
});

/*
EVENTO: CLIQUE FORA DO MODAL
Fecha modal quando usuário clica na área escura externa
*/
document.getElementById('trophy-modal').addEventListener('click', (e) => {
    if (e.target.id === 'trophy-modal') {
        document.getElementById('trophy-modal').style.display = 'none';
    }
});

/*
EVENTO: DROPDOWN DE IDIOMA
Controle de abertura/fechamento do menu de seleção de idioma
Incrementa contador de mudanças de idioma para sistema de conquistas
*/
document.getElementById('lang-toggle').addEventListener('click', () => {
    document.getElementById('lang-menu').classList.toggle('show');
    userStats.languageChanges++; // Conta mudança para conquista multilíngue
    localStorage.setItem('studyPro_stats', JSON.stringify(userStats));
});

/*
EVENTO: SELEÇÃO DE IDIOMA
Processa mudança de idioma e atualiza toda a interface
Salva preferência no localStorage e atualiza traduções
*/
document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');

        // MUDANÇA DE IDIOMA NO i18next
        i18next.changeLanguage(lang);

        // PERSISTÊNCIA DA PREFERÊNCIA
        localStorage.setItem('studyPro_lang', lang);

        // ATUALIZAÇÃO VISUAL
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        document.getElementById('lang-menu').classList.remove('show');

        // ATUALIZAÇÃO DE TRADUÇÕES
        updateTranslations();
    });
});

/*
EVENTO: ANO NO RODAPÉ
Define ano atual dinamicamente no copyright
*/
document.getElementById('year').textContent = new Date().getFullYear();

/*
===== INICIALIZAÇÃO =====
Chamada final para iniciar carregamento de dados
Executada após configuração de todos os event listeners
*/
updateTranslations();