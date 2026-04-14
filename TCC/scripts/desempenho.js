/*
    ================================================================================
    SEÇÃO: JAVASCRIPT - FUNCIONALIDADES DINÂMICAS
    Lógica de dashboard, manipulação de dados e interatividade da página
    ================================================================================
    */

/*
===== CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS =====
Definição de estado da aplicação e carregamento de dados persistentes
Integração com localStorage para manter progresso entre sessões
*/
let currentPeriod = 'week'; // Período atual de visualização (semanal/mensal/geral)
let performanceData = JSON.parse(localStorage.getItem('studyPro_performance') || '[]'); // Histórico de sessões
let progressData = JSON.parse(localStorage.getItem('studyPro_progress') || '{}'); // Dados de progresso geral
let favorites = JSON.parse(localStorage.getItem('studyPro_favorites') || '[]'); // Questões favoritas

/*
===== INICIALIZAÇÃO DO SISTEMA DE TRADUÇÃO (i18next) =====
Configuração completa do sistema multilíngue
Suporte a português, inglês e espanhol com recursos extensivos
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
                "desempenho-title": "Seu Desempenho",
                "desempenho-desc": "Acompanhe sua evolução com métricas detalhadas e insights personalizados.",
                "semanal": "Semanal",
                "mensal": "Mensal",
                "geral": "Geral",
                "xp-total": "XP Total",
                "esta-semana": "esta semana",
                "acertos": "Acertos",
                "fases": "Fases",
                "tempo-estudo": "Tempo de Estudo",
                "progresso-semanal": "Progresso Semanal",
                "seg": "Seg", "ter": "Ter", "qua": "Qua", "qui": "Qui", "sex": "Sex", "sab": "Sáb", "dom": "Dom",
                "acertos-assunto": "Acertos por Assunto",
                "historia": "História",
                "historico-sessoes": "Histórico de Sessões",
                "nenhuma-sessao": "Nenhuma sessão registrada ainda.",
                "conquistas-recentes": "Conquistas Recentes",
                "primeiro-acerto": "Primeiro Acerto",
                "acerte-uma-questao": "Acerte sua primeira questão",
                "sequencia-5": "Sequência de 5",
                "acerte-5-seguidas": "Acerte 5 questões seguidas",
                "fase-5": "Fase 5",
                "complete-5-fases": "Complete as primeiras 5 fases",
                "estrela": "Estrela",
                "acerte-100": "Acerte 100 questões no total",
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
                "desempenho-title": "Your Performance",
                "desempenho-desc": "Track your evolution with detailed metrics and personalized insights.",
                "semanal": "Weekly",
                "mensal": "Monthly",
                "geral": "Overall",
                "xp-total": "Total XP",
                "esta-semana": "this week",
                "acertos": "Correct",
                "fases": "Phases",
                "tempo-estudo": "Study Time",
                "progresso-semanal": "Weekly Progress",
                "seg": "Mon", "ter": "Tue", "qua": "Wed", "qui": "Thu", "sex": "Fri", "sab": "Sat", "dom": "Sun",
                "acertos-assunto": "Correct by Subject",
                "historia": "History",
                "historico-sessoes": "Session History",
                "nenhuma-sessao": "No sessions recorded yet.",
                "conquistas-recentes": "Recent Achievements",
                "primeiro-acerto": "First Correct",
                "acerte-uma-questao": "Get your first correct answer",
                "sequencia-5": "5 Streak",
                "acerte-5-seguidas": "Get 5 correct in a row",
                "fase-5": "Phase 5",
                "complete-5-fases": "Complete the first 5 phases",
                "estrela": "Star",
                "acerte-100": "Get 100 correct answers total",
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
                "desempenho-title": "Tu Rendimiento",
                "desempenho-desc": "Sigue tu evolución con métricas detalladas y perspectivas personalizadas.",
                "semanal": "Semanal",
                "mensal": "Mensual",
                "geral": "General",
                "xp-total": "XP Total",
                "esta-semana": "esta semana",
                "acertos": "Correctas",
                "fases": "Fases",
                "tempo-estudo": "Tiempo de Estudio",
                "progresso-semanal": "Progreso Semanal",
                "seg": "Lun", "ter": "Mar", "qua": "Mié", "qui": "Jue", "sex": "Vie", "sab": "Sáb", "dom": "Dom",
                "acertos-assunto": "Correctas por Tema",
                "historia": "Historia",
                "historico-sessoes": "Historial de Sesiones",
                "nenhuma-sessao": "No hay sesiones registradas aún.",
                "conquistas-recentes": "Logros Recientes",
                "primeiro-acerto": "Primer Acierto",
                "acerte-uma-questao": "Obtén tu primera respuesta correcta",
                "sequencia-5": "Racha de 5",
                "acerte-5-seguidas": "Obtén 5 correctas seguidas",
                "fase-5": "Fase 5",
                "complete-5-fases": "Completa las primeras 5 fases",
                "estrela": "Estrella",
                "acerte-100": "Obtén 100 respuestas correctas en total",
                "privacy": "Política de Privacidad",
                "terms": "Términos de Uso",
                "contact": "Contacto"
            }
        }
    }
}, function (err, t) {
    // Callback executado após inicialização das traduções
    updateTranslations(); // Atualiza textos da interface
    loadPerformanceData(); // Carrega dados de desempenho
});

/*
===== FUNÇÕES PRINCIPAIS =====
Conjunto de funções para manipulação de dados e atualização da interface
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
FUNÇÃO: CARREGAR DADOS DE DESEMPENHO
Função principal que coordena o carregamento e exibição de dados
Processa dados do localStorage e atualiza toda a interface
*/
function loadPerformanceData() {
    // Cria objeto com dados a partir do localStorage
    const mockData = {
        totalXP: progressData.xp || 0, // XP total do usuário
        totalCorrect: performanceData.reduce((sum, session) => sum + (session.correct || 0), 0), // Soma de acertos
        unlockedPhases: progressData.unlockedPhases || 1, // Fases desbloqueadas
        studyTime: Math.floor((performanceData.reduce((sum, s) => sum + (s.time || 0), 0) || 0) / 60), // Tempo estimado em horas
        weeklyData: generateWeeklyData(), // Dados semanais processados
    };
    mockData.achievements = checkAchievements(mockData); // Status das conquistas

    // Atualiza todas as seções da interface
    updateStats(mockData);
    updateCharts(mockData);
    updateSessionsList();
    updateAchievements(mockData.achievements);
}

/*
FUNÇÃO: GERAR DADOS SEMANAIS
Processa dados de performance para criar visualização semanal
Agrupa sessões por dia da semana para gráfico de barras
*/
function generateWeeklyData() {
    const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    const weeklyData = {};

    // Para cada dia da semana, soma os acertos das sessões daquele dia
    days.forEach(day => {
        const daySessions = performanceData.filter(session =>
            new Date(session.date).toLocaleDateString('pt-BR', { weekday: 'short' }) === day
        );
        weeklyData[day] = daySessions.reduce((sum, session) => sum + (session.correct || 0), 0);
    });

    return weeklyData;
}

/*
FUNÇÃO: ATUALIZAR ESTATÍSTICAS
Atualiza os cards de estatísticas principais com dados calculados
Mostra valores atuais e mudanças semanais simuladas
*/
function updateStats(data) {
    // Atualiza valores principais
    document.getElementById('total-xp').textContent = data.totalXP;
    document.getElementById('total-correct').textContent = data.totalCorrect;
    document.getElementById('unlocked-phases').textContent = `${data.unlockedPhases}/10`;
    document.getElementById('study-time').textContent = `${data.studyTime}h`;

    // Calcula e mostra mudanças semanais (simuladas como porcentagem dos totais)
    const weeklyXP = Math.floor(data.totalXP * 0.3);
    const weeklyCorrect = Math.floor(data.totalCorrect * 0.2);
    const weeklyTime = Math.floor(data.studyTime * 0.25);

    // Atualiza elementos de mudança com traduções
    document.getElementById('xp-change').innerHTML = `+${weeklyXP} <span data-i18n="esta-semana">${i18next.t('esta-semana')}</span>`;
    document.getElementById('correct-change').innerHTML = `+${weeklyCorrect} <span data-i18n="esta-semana">${i18next.t('esta-semana')}</span>`;
    document.getElementById('time-change').innerHTML = `+${weeklyTime}h <span data-i18n="esta-semana">${i18next.t('esta-semana')}</span>`;
}

/*
FUNÇÃO: ATUALIZAR GRÁFICOS
Atualiza visualizações de dados (barras semanais e barras de assunto)
Usa dados processados para ajustar alturas e larguras dinamicamente
*/
function updateCharts(data) {
    // Gráfico semanal: ajusta altura das barras baseado nos valores
    const maxValue = Math.max(...Object.values(data.weeklyData)); // Valor máximo para normalização
    Object.keys(data.weeklyData).forEach(day => {
        const bar = document.querySelector(`[data-day="${day}"]`);
        if (!bar) return;
        const fill = bar.querySelector('.bar-fill');
        const percentage = maxValue > 0 ? (data.weeklyData[day] / maxValue) * 100 : 0;
        fill.style.height = `${percentage}%`; // Ajusta altura proporcional
    });

    // Gráfico por assunto: calcula percentual de acertos (simplificado)
    const historyCorrect = data.totalCorrect;
    const historyTotal = data.totalCorrect + Math.floor(data.totalCorrect * 0.2); // Simula total de questões
    const historyPercentage = historyTotal > 0 ? (historyCorrect / historyTotal) * 100 : 0;

    const subjectFill = document.querySelector('.subject-fill');
    if (subjectFill) {
        subjectFill.style.width = `${historyPercentage}%`;
    }
    const subjectPercentageText = document.querySelector('.subject-percentage');
    if (subjectPercentageText) {
        subjectPercentageText.textContent = `${Math.round(historyPercentage)}%`;
    }
}

/*
FUNÇÃO: ATUALIZAR LISTA DE SESSÕES
Cria elementos HTML dinâmicos para mostrar histórico de sessões
Limita a 5 sessões mais recentes para não sobrecarregar a interface
*/
function updateSessionsList() {
    const sessionsList = document.getElementById('sessions-list');

    // Se não há sessões, mantém mensagem padrão
    if (performanceData.length === 0) {
        return;
    }

    sessionsList.innerHTML = ''; // Limpa conteúdo anterior

    // Cria elementos para as 5 sessões mais recentes (invertidas para mostrar mais recente primeiro)
    performanceData.slice(-5).reverse().forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
                    <div class="session-date">${new Date(session.date).toLocaleDateString()}</div>
                    <div class="session-stats">
                        <span class="session-correct">${session.correct || 0} acertos</span>
                        <span class="session-time">${session.time || 15}min</span>
                    </div>
                `;
        sessionsList.appendChild(sessionItem);
    });
}

/*
FUNÇÃO: VERIFICAR CONQUISTAS
Avalia condições para desbloqueio de achievements
Retorna objeto com status boolean de cada conquista
*/
function checkAchievements(data) {
    const totalCorrect = data.totalCorrect || 0;
    const phases = data.unlockedPhases || 1;
    const sessions = performanceData || [];

    // streak5: últimas 5 sessões com pelo menos 1 acerto cada
    const last5 = sessions.slice(-5);
    const streak5 = last5.length === 5 && last5.every(session => (session.correct || 0) > 0);

    return {
        firstCorrect: totalCorrect > 0,
        streak5: streak5,
        phase5: phases >= 5,
        star100: totalCorrect >= 100
    };
}

/*
FUNÇÃO: ATUALIZAR CONQUISTAS
Atualiza visual dos cards de achievement baseado no status
Adiciona/remove classe 'locked' para indicar estado
*/
function updateAchievements(achievements) {
    const achievementCards = document.querySelectorAll('.achievement-card');

    // Aplica estado locked/unlocked baseado nas condições
    achievementCards[0].classList.toggle('locked', !achievements.firstCorrect);
    achievementCards[1].classList.toggle('locked', !achievements.streak5);
    achievementCards[2].classList.toggle('locked', !achievements.phase5);
    achievementCards[3].classList.toggle('locked', !achievements.star100);
}

/*
===== EVENT LISTENERS =====
Configuração de interatividade da página
*/

/*
EVENTO: FILTROS DE PERÍODO
Permite alternar entre visualizações semanal, mensal e geral
Atualiza interface e recarrega dados quando necessário
*/
document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove classe active de todos os botões
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        // Adiciona classe active ao botão clicado
        btn.classList.add('active');
        // Atualiza período atual
        currentPeriod = btn.getAttribute('data-period');
        // Recarrega dados (em implementação completa, filtraria por período)
        loadPerformanceData();
    });
});

/*
EVENTO: DROPDOWN DE IDIOMA
Controle de abertura/fechamento do menu de seleção de idioma
*/
document.getElementById('lang-toggle').addEventListener('click', () => {
    document.getElementById('lang-menu').classList.toggle('show');
});

/*
EVENTO: SELEÇÃO DE IDIOMA
Processa mudança de idioma e atualiza toda a interface
Salva preferência no localStorage para persistência
*/
document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        // Muda idioma no i18next
        i18next.changeLanguage(lang);
        // Salva preferência do usuário
        localStorage.setItem('studyPro_lang', lang);
        // Atualiza indicador visual
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        // Fecha menu
        document.getElementById('lang-menu').classList.remove('show');
        // Atualiza traduções em toda a página
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
loadPerformanceData();