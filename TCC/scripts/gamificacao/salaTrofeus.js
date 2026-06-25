import { auth, db } from "../firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getListaTrofeus } from "./conquistas.js";
import { criarElemento, criarBadgeRaridade, formatarPorcentagem } from "./uiGamificacao.js";
import { abrirModalTrofeu, fecharModalTrofeu } from "./modalTrofeu.js";
import { aplicarHoverGlow } from "./animacoes.js";
import "./gamificacao.js";
import { filtrarTrofeus } from "./filtros.js";

const galeria = document.getElementById("galeriaTrofeus");
const totalTrofeusEl = document.getElementById("total-trofeus");
const desbloqueadosEl = document.getElementById("trofeus-desbloqueados");
const trancadosEl = document.getElementById("trofeus-trancados");
const pontosTotaisEl = document.getElementById("pontos-totais");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const modalClose = document.getElementById("modalClose");

let trofeusUsuario = {};
let filtroAtivo = "todos";
let trofeusOrdenados = [];

function criarCardTrofeu(trofeu, desbloqueado, progressoPercentual) {
    const estado = desbloqueado ? "unlocked" : "locked";
    const raridadeClass = trofeu.raridade || "comum";
    const card = criarElemento("article", `trophy-card ${estado} ${raridadeClass}`);
    card.dataset.raridade = trofeu.raridade;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${trofeu.nome} - ${desbloqueado ? "Desbloqueado" : trofeu.oculto ? "Oculto" : "Bloqueado"}`);

    const statusLabel = desbloqueado ? "Desbloqueado" : trofeu.oculto ? "Secreto" : "Bloqueado";
    const emoji = criarElemento("div", "trophy-emoji");
    emoji.textContent = desbloqueado ? trofeu.icone : trofeu.oculto ? "❓" : "🔒";

    const title = criarElemento("h3", "trophy-title");
    title.textContent = desbloqueado ? trofeu.nome : trofeu.oculto ? "Conquista Secreta" : "Troféu Trancado";

    const description = criarElemento("p", "trophy-description");
    description.textContent = desbloqueado
        ? trofeu.descricao
        : trofeu.oculto
            ? "Continue estudando para descobrir esta conquista."
            : "Continue estudando para desbloquear esta conquista.";

    const meta = criarElemento("div", "trophy-meta");
    const statusBadge = criarElemento("span", "trophy-status");
    statusBadge.textContent = statusLabel;
    const categoryBadge = criarElemento("span", "trophy-category");
    categoryBadge.textContent = trofeu.categoria;
    const rarityBadge = criarBadgeRaridade(trofeu.raridade);
    meta.append(statusBadge, categoryBadge, rarityBadge);

    const footer = criarElemento("div", "trophy-footer");
    const progressBar = criarElemento("div", "trophy-progress");
    progressBar.innerHTML = `
        <div class="trophy-progress-bar"><div class="trophy-progress-fill" style="width: ${progressoPercentual}%"></div></div>
        <span class="trophy-progress-text">${formatarPorcentagem(progressoPercentual / 100)}</span>
    `;

    footer.append(progressBar);
    card.append(emoji, title, description, meta, footer);

    const infoTrofeu = trofeusUsuario[trofeu.id];
    card.addEventListener("click", () => abrirModalTrofeu(trofeu, desbloqueado, progressoPercentual / 100, infoTrofeu));
    card.addEventListener("keypress", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            abrirModalTrofeu(trofeu, desbloqueado, progressoPercentual / 100, infoTrofeu);
        }
    });
    aplicarHoverGlow(card);

    return card;
}

function atualizarPainelEstatisticas(listaTrofeus) {
    const total = listaTrofeus.length;
    const desbloqueados = listaTrofeus.filter((trofeu) => trofeusUsuario[trofeu.id]).length;
    const bloqueados = total - desbloqueados;
    const pontosTotais = listaTrofeus
        .filter((trofeu) => trofeusUsuario[trofeu.id])
        .reduce((sum, trofeu) => sum + trofeu.pontos, 0);

    if (totalTrofeusEl) totalTrofeusEl.textContent = total;
    if (desbloqueadosEl) desbloqueadosEl.textContent = desbloqueados;
    if (trancadosEl) trancadosEl.textContent = bloqueados;
    if (pontosTotaisEl) pontosTotaisEl.textContent = pontosTotais;
}

function getProgressoTrofeu(trofeu, estatisticas, trofeusUsuario) {
    const meta = trofeu.progresso?.meta || 1;
    switch (trofeu.id) {
        case "primeiro_acerto":
            return { atual: Math.min(estatisticas.questoesCorretas || 0, meta), meta };
        case "historiador":
            return { atual: Math.min(estatisticas.provasPerfeitas || 0, meta), meta };
        case "multi_linguagens":
            return { atual: Math.min(estatisticas.trocasIdioma || 0, meta), meta };
        case "desastre_historica":
            return { atual: trofeusUsuario[trofeu.id]?.desbloqueado ? 1 : 0, meta };
        default:
            return { atual: trofeu.progresso?.atual || 0, meta };
    }
}

function prepararTrofeusComProgresso(listaTrofeus, estatisticas, trofeusUsuario) {
    return listaTrofeus.map((trofeu) => ({
        ...trofeu,
        progresso: getProgressoTrofeu(trofeu, estatisticas, trofeusUsuario)
    }));
}

function atualizarGaleria(trofeus) {
    if (!galeria) return;
    galeria.innerHTML = "";

    trofeus.forEach((trofeu) => {
        const desbloqueado = trofeusUsuario[trofeu.id]?.desbloqueado === true;
        const progresso = trofeu.progresso ? trofeu.progresso.atual / Math.max(1, trofeu.progresso.meta) : 0;
        const progressoPercentual = Math.round(progresso * 100);
        const card = criarCardTrofeu(trofeu, desbloqueado, progressoPercentual);
        galeria.appendChild(card);
    });
}

function aplicarFiltrosEOrdenacao() {
    const listaFiltrada = filtrarTrofeus(trofeusOrdenados, filtroAtivo);
    atualizarGaleria(listaFiltrada);
    atualizarPainelEstatisticas(trofeusOrdenados);
}

async function carregarUsuario() {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}

async function renderizarTrofeus() {
    const dadosUsuario = await carregarUsuario();
    if (!dadosUsuario) return;

    trofeusUsuario = dadosUsuario.trofeus || {};
    const estatisticas = dadosUsuario.estatisticas || {};
    trofeusOrdenados = prepararTrofeusComProgresso(getListaTrofeus(), estatisticas, trofeusUsuario);

    aplicarFiltrosEOrdenacao();
}

function configurarFiltros() {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            filtroAtivo = button.dataset.filter || "todos";
            aplicarFiltrosEOrdenacao();
        });
    });
}

function configurarModal() {
    if (!modalClose) return;
    const modal = document.getElementById("trophyModal");
    modalClose.addEventListener("click", fecharModalTrofeu);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            fecharModalTrofeu();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharModalTrofeu();
        }
    });
}

function inicializarSalaTrofeus() {
    configurarFiltros();
    configurarModal();
}

auth.onAuthStateChanged(async (user) => {
    if (user) {
        inicializarSalaTrofeus();
        await renderizarTrofeus();
    }
});

export { renderizarTrofeus };
