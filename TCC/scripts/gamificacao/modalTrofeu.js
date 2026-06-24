export function abrirModalTrofeu(trofeu, desbloqueado = false, progresso = 0, infoTrofeu = null) {
    const modal = document.getElementById("trophyModal");
    const modalIcon = document.getElementById("modalIcon");
    const modalTitle = document.getElementById("modalTitle");
    const modalData = document.getElementById("modalData");
    const modalRarity = document.getElementById("modalRarity");
    const modalDescription = document.getElementById("modalDescription");
    const modalPoints = document.getElementById("modalPoints");
    const modalXP = document.getElementById("modalXP");
    const progressSection = document.getElementById("progressSection");
    const modalProgressBar = document.getElementById("modalProgressBar");
    const modalProgressText = document.getElementById("modalProgressText");

    const dataDesbloqueio = infoTrofeu?.data;
    const dataFormatada = dataDesbloqueio ? new Date(dataDesbloqueio).toLocaleDateString("pt-BR") : "Não desbloqueado";

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
    modalData.textContent = dataFormatada;

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