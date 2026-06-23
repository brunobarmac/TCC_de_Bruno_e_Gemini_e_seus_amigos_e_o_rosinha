import { auth, db } from "../firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getListaTrofeus } from "./conquistas.js";
import { criarElemento, criarBadgeRaridade, formatarPorcentagem } from "./uiGamificacao.js";
import { abrirModalTrofeu, fecharModalTrofeu } from "./modalTrofeu.js";
import { aplicarHoverGlow } from "./animacoes.js";
import "./gamificacao.js";
import { filtrarTrofeus, pesquisarTrofeus } from "./filtros.js";

const galeria = document.getElementById("galeriaTrofeus");
const totalTrofeusEl = document.getElementById("total-trofeus");
const desbloqueadosEl = document.getElementById("trofeus-desbloqueados");
const trancadosEl = document.getElementById("trofeus-trancados");
const pontosTotaisEl = document.getElementById("pontos-totais");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const modalClose = document.getElementById("modalClose");

let trofeusUsuario = {};
let filtroAtivo = "todos";
let pesquisaAtiva = "";
let trofeusOrdenados = [];

function criarCardTrofeu(trofeu, desbloqueado, progressoPercentual) {
    const card = criarElemento("article", `trophy-card ${desbloqueado ? "unlocked" : "locked"}`);
    card.dataset.raridade = trofeu.raridade;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${trofeu.nome} - ${desbloqueado ? "Desbloqueado" : "Bloqueado"}`);

    const statusLabel = desbloqueado ? "Desbloqueado" : trofeu.oculto ? "Secreto" : "Bloqueado";
    const emoji = criarElemento("div", "trophy-emoji");
    emoji.textContent = desbloqueado ? trofeu.icone : "🔒";

    const title = criarElemento("h3", "trophy-title");
    title.textContent = desbloqueado ? trofeu.nome : "Conquista Secreta";

    const description = criarElemento("p", "trophy-description");
    description.textContent = desbloqueado
        ? trofeu.descricao
        : trofeu.oculto
            ? "Continue estudando para descobrir esta conquista."
            : "Continue estudando para desbloquear.";

    const meta = criarElemento("div", "trophy-meta");
    meta.innerHTML = `
        <span class="trophy-status">${statusLabel}</span>
        <span class="trophy-category">${trofeu.categoria}</span>
    `;

    const footer = criarElemento("div", "trophy-footer");
    const rarityBadge = criarBadgeRaridade(trofeu.raridade);
    const progressBar = criarElemento("div", "trophy-progress");
    progressBar.innerHTML = `
        <div class="trophy-progress-bar"><div class="trophy-progress-fill" style="width: ${progressoPercentual}%"></div></div>
        <span class="trophy-progress-text">${formatarPorcentagem(progressoPercentual / 100)}</span>
    `;

    footer.append(rarityBadge, progressBar);
    card.append(emoji, title, description, meta, footer);

    card.addEventListener("click", () => abrirModalTrofeu(trofeu, desbloqueado, progressoPercentual / 100));
    card.addEventListener("keypress", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            abrirModalTrofeu(trofeu, desbloqueado, progressoPercentual / 100);
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

function atualizarGaleria(trofeus) {
    if (!galeria) return;
    galeria.innerHTML = "";

    trofeus.forEach((trofeu) => {
        const desbloqueado = Boolean(trofeusUsuario[trofeu.id]);
        const progresso = trofeu.progresso ? trofeu.progresso.atual / Math.max(1, trofeu.progresso.meta) : 0;
        const progressoPercentual = Math.round(progresso * 100);
        const card = criarCardTrofeu(trofeu, desbloqueado, progressoPercentual);
        galeria.appendChild(card);
    });
}

function aplicarFiltrosEOrdenacao() {
    let listaFiltrada = filtrarTrofeus(trofeusOrdenados, filtroAtivo);
    listaFiltrada = pesquisarTrofeus(listaFiltrada, pesquisaAtiva);
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
    trofeusOrdenados = getListaTrofeus();

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
    modalClose.addEventListener("click", fecharModalTrofeu);
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
