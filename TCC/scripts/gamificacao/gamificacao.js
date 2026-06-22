// =====================================
// GAMIFICAÇÃO STUDYPRO
// =====================================

import { doc, updateDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db, auth } from "../firebaseConfig.js";
import { conquistas } from "./conquistas.js";

console.log("DB:", db);
console.log("AUTH:", auth);

// =====================================
// VERIFICAR TROFÉUS
// =====================================
export async function verificarTrofeus() {

    const user = auth.currentUser;

    if (!user) return;

    const userRef =
        doc(db, "users", user.uid);

    const snap =
        await getDoc(userRef);

    const dados =
        snap.data();

    const estatisticas =
        dados.estatisticas || {};

    // =====================================
    // HISTORIADOR
    // 1 prova perfeita
    // =====================================

    if (
        (estatisticas.provasPerfeitas || 0) >= 1
    ) {
        await desbloquearTrofeu("historiador");
    }

}


// =====================================
// DESBLOQUEAR TROFÉU
// =====================================

export async function desbloquearTrofeu(idTrofeu) {

    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(
        db,
        "users",
        user.uid
    );

    const userSnap = await getDoc(userRef);
    const trofeus = userSnap.data().trofeus || {};

    if (trofeus[idTrofeu]) {
        // Troféu já desbloqueado
        return;
    }

    await updateDoc(userRef, {
        [`trofeus.${idTrofeu}`]: true
    });

    mostrarNotificacaoTrofeu(idTrofeu);
};

window.desbloquearTrofeu = desbloquearTrofeu;


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

    const xp =
        dados.xp || 0;

    let nivel = 1;

    if (xp >= 100) nivel = 2;
    if (xp >= 250) nivel = 3;
    if (xp >= 500) nivel = 4;
    if (xp >= 1000) nivel = 5;

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

    const userRef =
        doc(db, "users", user.uid);

    await updateDoc(userRef, {

        "estatisticas.questoesRespondidas":
        increment(totalQuestoes),

        "estatisticas.questoesCorretas":
        increment(corretou ? 1 : 0)

    });

}

// =====================================
// NOTIFICAÇÃO
// =====================================
export function mostrarNotificacaoTrofeu(idTrofeu) {

    const trofeu = TROFEUS[idTrofeu];

    if (!trofeu) return;

    alert(
        `🏆 Conquista Desbloqueada!\n\n${trofeu.nome}`
    );
}

window.mostrarNotificacaoTrofeu = mostrarNotificacaoTrofeu;


// =====================================
// REGISTRAR PROVA
// =====================================
export async function registrarProva(
    perfeita = false
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

    await verificarTrofeus();
}