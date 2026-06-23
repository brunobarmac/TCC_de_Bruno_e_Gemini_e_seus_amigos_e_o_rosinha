export function abrirModalTrofeu(trofeu, desbloqueado = false, progresso = 0) {
    const modal = document.getElementById("trophyModal");
    const modalIcon = document.getElementById("modalIcon");
    const modalTitle = document.getElementById("modalTitle");
    const modalRarity = document.getElementById("modalRarity");
    const modalDescription = document.getElementById("modalDescription");
    const modalPoints = document.getElementById("modalPoints");
    const modalXP = document.getElementById("modalXP");
    const progressSection = document.getElementById("progressSection");
    const modalProgressBar = document.getElementById("modalProgressBar");
    const modalProgressText = document.getElementById("modalProgressText");

    if (!modal || !modalIcon || !modalTitle) {
        return;
    }

    modalIcon.textContent = desbloqueado ? trofeu.icone : "❔";
    modalTitle.textContent = desbloqueado ? trofeu.nome : "Conquista Secreta";
    modalRarity.textContent = `Raridade: ${trofeu.raridade}`;
    modalDescription.textContent = desbloqueado
        ? trofeu.descricao
        : "Continue estudando para descobrir esta conquista.";
    modalPoints.textContent = `+${trofeu.pontos}`;
    modalXP.textContent = `+${trofeu.xp}`;

    if (!desbloqueado && trofeu.oculto) {
        progressSection.style.display = "none";
    } else {
        progressSection.style.display = "block";
        const progressoPercentual = Math.min(100, Math.round(progresso * 100));
        modalProgressBar.style.width = `${progressoPercentual}%`;
        modalProgressText.textContent = `${progressoPercentual}% concluído`;
    }

    modal.classList.add("visible");
    document.body.classList.add("modal-open");
}

export function fecharModalTrofeu() {
    const modal = document.getElementById("trophyModal");
    if (!modal) return;
    modal.classList.remove("visible");
    document.body.classList.remove("modal-open");
}
