// Shared functions for question buttons: copy, send to Pequeno Rosa, favorite
(function(){
    function extrairTextoQuestao(q){
        const titulo = q.querySelector('h2')?.innerText.replace(/\n/g,' ') || '';
        let texto = titulo + "\n";
        q.querySelectorAll('.options li').forEach(li => { texto += li.innerText.replace(/\n/g,' ') + "\n"; });
        return texto;
    }

    function normalizeTextForId(text){
        return text.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '')
            .replace(/\-+/g, '-')
            .replace(/(^\-|\-$)/g, '');
    }

    function ensureQuestionIds(){
        const pageName = window.location.pathname.split('/').pop().replace(/\.[^/.]+$/, '');
        document.querySelectorAll('.question').forEach((q, idx) => {
            if (!q.id) {
                const titleText = q.querySelector('h2')?.innerText || `question-${idx + 1}`;
                const candidate = `${pageName}-${idx + 1}-${normalizeTextForId(titleText.slice(0, 40))}`;
                q.id = candidate;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureQuestionIds);
    } else {
        ensureQuestionIds();
    }

    window.extrairTextoQuestao = extrairTextoQuestao;

    window.copyQuestion = function(q, btn){
        const texto = extrairTextoQuestao(q);
        if (navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(texto).then(() => {
                if (btn){ btn.innerText = 'Copiado! ✓'; setTimeout(() => btn.innerText = 'Copiar Questão', 2000); }
            }).catch(()=>{});
        } else {
            const ta = document.createElement('textarea');
            ta.value = texto; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); if (btn){ btn.innerText = 'Copiado! ✓'; setTimeout(() => btn.innerText = 'Copiar Questão', 2000); } } catch(e){}
            ta.remove();
        }
    };

    window.sendToPequenoRosa = function(q, tema){
        sessionStorage.setItem('questao_transferida', extrairTextoQuestao(q));
        window.location.href = "../IA/pequeno_rosa.html?tema=" + encodeURIComponent(tema);
    };

    window.favoriteQuestion = function(q, btn){
        ensureQuestionIds();
        const pageName = window.location.pathname.split('/').pop();
        q.dataset.favoriteSource = pageName;
        if (!q.id) ensureQuestionIds();

        const favoriteItem = {
            html: q.outerHTML,
            sourcePage: pageName,
            questionId: q.id || null
        };

        let favoritos = JSON.parse(localStorage.getItem('questoesFavoritas') || '[]');
        const alreadyFavorited = favoritos.some(item => {
            if (typeof item === 'string') return item === favoriteItem.html;
            return item.sourcePage === favoriteItem.sourcePage && item.questionId === favoriteItem.questionId;
        });

        if (!alreadyFavorited) {
            favoritos.push(favoriteItem);
            localStorage.setItem('questoesFavoritas', JSON.stringify(favoritos));
        }
        if (btn){ btn.innerText = 'Salvo nos Favoritos!'; btn.style.backgroundColor = '#027002'; btn.style.color = 'white'; }
    };

})();
