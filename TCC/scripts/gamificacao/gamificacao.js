// =====================================
// GAMIFICAÇÃO STUDYPRO
// =====================================

import { doc, updateDoc, getDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db, auth } from "../firebaseConfig.js";
import { getTrofeu } from "./conquistas.js";

console.log("DB:", db);
console.log("AUTH:", auth);

export function getLevelData(xp = 0) {
    const thresholds = [100, 250, 500, 1000];
    let nivel = 1;

    if (xp >= thresholds[3]) nivel = 5;
    else if (xp >= thresholds[2]) nivel = 4;
    else if (xp >= thresholds[1]) nivel = 3;
    else if (xp >= thresholds[0]) nivel = 2;

    const proxNivelXP = thresholds.find((valor) => xp < valor) ?? thresholds[thresholds.length - 1];
    const xpParaProximo = Math.max(0, proxNivelXP - xp);

    return {
        xp,
        nivel,
        proxNivelXP,
        xpParaProximo
    };
}

// =====================================
// VERIFICAR TROFÉUS
// =====================================
export async function verificarTrofeus(currentAttempt = null) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const dados = snap.data() || {};
    const estatisticas = dados.estatisticas || {};

    // =====================================
    // PRIMEIRO ACERTO
    // =====================================
    if ((estatisticas.questoesCorretas || 0) >= 1) {
        await desbloquearTrofeu("primeiro_acerto");
    }

    // =====================================
    // HISTORIADOR
    // =====================================
    if ((estatisticas.provasPerfeitas || 0) >= 1) {
        await desbloquearTrofeu("historiador");
    }

    // =====================================
    // MULTILÍNGUE
    // =====================================
    if ((estatisticas.trocasIdioma || 0) >= 3) {
        await desbloquearTrofeu("multi_linguagens");
    }

    // =====================================
    // DESASTRE HISTÓRICO
    // =====================================
    if (
        currentAttempt &&
        currentAttempt.questoesRespondidas > 0 &&
        currentAttempt.questoesCorretas === 0
    ) {
        await desbloquearTrofeu("desastre_historica");
    }
}

export async function incrementarTrocasIdioma() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
        "estatisticas.trocasIdioma": increment(1)
    });

    await verificarTrofeus();
}


// =====================================
// DESBLOQUEAR TROFÉU
// =====================================

export async function desbloquearTrofeu(idTrofeu) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const trofeus = userSnap.data().trofeus || {};

    if (trofeus[idTrofeu]) {
        // Troféu já desbloqueado
        return;
    }

    await updateDoc(userRef, {
        [`trofeus.${idTrofeu}`]: {
            desbloqueado: true,
            data: serverTimestamp()
        }
    });

    mostrarNotificacaoTrofeu(idTrofeu);
};

window.desbloquearTrofeu = desbloquearTrofeu;
window.verificarTrofeus = verificarTrofeus;
window.incrementarTrocasIdioma = incrementarTrocasIdioma;


// =====================================
// ADICIONAR PONTOS
// =====================================
export async function adicionarXP(xpGanhos) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(
        db,
        "users",
        user.uid
    );

    await updateDoc(userRef, {
        xp: increment(xpGanhos)
    });

    await verificarNivel();
}


// =====================================
// VERIFICAR NÍVEL
// =====================================
export async function verificarNivel() {

    const user = auth.currentUser;

    if (!user) return;

    const userRef =
        doc(db, "users", user.uid);

    const snap =
        await getDoc(userRef);

    const dados =
        snap.data();

    const xp = dados.xp || 0;
    const { nivel } = getLevelData(xp);

    if (nivel > dados.nivel) {

        await updateDoc(userRef, {
            nivel: nivel
        });

        alert(
            `🎉 Você subiu para o nível ${nivel}!`
        );
    }
}


// =====================================
// ATUALIZAR ESTATÍSTICAS
// =====================================
export async function atualizarEstatisticas(
    corretou,
    totalQuestoes = 1
) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
        "estatisticas.questoesRespondidas": increment(totalQuestoes),
        "estatisticas.questoesCorretas": increment(corretou ? 1 : 0)
    });

    await verificarTrofeus();
}

// =====================================
// NOTIFICAÇÃO
// =====================================
export function mostrarNotificacaoTrofeu(idTrofeu) {
    const trofeu = getTrofeu(idTrofeu);
    if (!trofeu) return;

    alert(`🏆 Conquista Desbloqueada!\n\n${trofeu.nome}`);
}

window.mostrarNotificacaoTrofeu = mostrarNotificacaoTrofeu;


// =====================================
// REGISTRAR PROVA
// =====================================
export async function registrarProva(
    perfeita = false,
    currentAttempt = null
) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef =
        doc(db, "users", user.uid);

    await updateDoc(userRef, {

        "estatisticas.provasConcluidas":
        increment(1),

        "estatisticas.provasPerfeitas":
        increment(perfeita ? 1 : 0)

    });

    await verificarTrofeus(currentAttempt);
}