import { auth, db } from "../firebaseConfig.js";
import { conquistas } from "./conquistas.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const galeria =
    document.getElementById("galeriaTrofeus");

async function carregarTrofeus() {

    const user = auth.currentUser;

    if (!user) return;

    const snap =
        await getDoc(doc(db, "users", user.uid));

    const dados =
        snap.data();

    const desbloqueados =
        dados.trofeus || {};

    galeria.innerHTML = "";

    for (const id in conquistas) {

        const trofeu =
            conquistas[id];

        const liberado =
            desbloqueados[id];
        const card =
            document.createElement("div");
        card.className =
            `trophy-card ${liberado ? "unlocked" : "locked"}`;
        card.dataset.raridade =
            trofeu.raridade;
        card.innerHTML = `
            <div class="emoji">
                ${liberado ? trofeu.imagem : "🔒"}
            </div>
            <h3>
                ${liberado ? trofeu.nome : "???"}
            </h3>
            <p>
                ${liberado
                ? trofeu.descricao
                : "Continue estudando para desbloquear."
            }
            </p>
        `;
        galeria.appendChild(card);
    }

}

auth.onAuthStateChanged(user => {
    if (user) {
        carregarTrofeus();
    }
});