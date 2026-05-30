// =====================================
// GAMIFICAÇÃO STUDYPRO
// =====================================

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebaseauthjs/11.6.1/firebase-firestore.js";

import {
    db,
    auth
} from "./firebaseauth.js";


// =====================================
// TROFÉUS DO SISTEMA
// =====================================

export const TROFEUS = {

    historia_perfeita: {
        nome: "Mestre da História",
        descricao: "Gabaritou História",
        imagem: "🏆"
    },

    historia_desastrosa: {
        nome: "Desastre Histórico",
        descricao: "Errou todas as questões de História",
        imagem: "💩"
    },

    primeiro_erro: {
        nome: "Primeiro Deslize",
        descricao: "Errou sua primeira questão",
        imagem: "😢"
    },

    primeiro_acerto: {
        nome: "Primeiro Passo",
        descricao: "Acertou sua primeira questão",
        imagem: "🎯"
    }
};


// =====================================
// DESBLOQUEAR TROFÉU
// =====================================

export async function desbloquearTrofeu(idTrofeu){

    const user = auth.currentUser;

    if(!user) return;

    const userRef = doc(db,"users",user.uid);

    await updateDoc(userRef,{
        [`trofeus.${idTrofeu}`]: true
    });

    mostrarNotificacaoTrofeu(idTrofeu);
}


// =====================================
// NOTIFICAÇÃO VISUAL
// =====================================

export function mostrarNotificacaoTrofeu(idTrofeu){

    const trofeu = TROFEUS[idTrofeu];

    const div = document.createElement("div");

    div.className = "achievement-notification";

    div.innerHTML = `
        <div style="font-size:50px;">
            ${trofeu.imagem}
        </div>

        <h3>🏆 Conquista Desbloqueada</h3>

        <p>${trofeu.nome}</p>

        <button onclick="
            window.location.href='sala-trofeusVitor.html'
        ">
            Ver Troféu
        </button>
    `;

    document.body.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 5000);
}