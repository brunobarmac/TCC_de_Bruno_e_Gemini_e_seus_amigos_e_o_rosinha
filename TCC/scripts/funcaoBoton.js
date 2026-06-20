// Shared functions for question buttons: copy, send to Pequeno Rosa, favorite
(function(){
    function extrairTextoQuestao(q){
        const titulo = q.querySelector('h2')?.innerText.replace(/\n/g,' ') || '';
        let texto = titulo + "\n";
        q.querySelectorAll('.options li').forEach(li => { texto += li.innerText.replace(/\n/g,' ') + "\n"; });
        return texto;
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
        let favoritos = JSON.parse(localStorage.getItem('questoesFavoritas')) || [];
        const html = q.outerHTML;
        if (!favoritos.includes(html)){
            favoritos.push(html);
            localStorage.setItem('questoesFavoritas', JSON.stringify(favoritos));
        }
        if (btn){ btn.innerText = 'Salvo nos Favoritos!'; btn.style.backgroundColor = '#027002'; btn.style.color = 'white'; }
    };

})();
