export function aplicarHoverGlow(element) {
    if (!element) return;
    element.addEventListener("mouseenter", () => {
        element.classList.add("hover-glow");
    });
    element.addEventListener("mouseleave", () => {
        element.classList.remove("hover-glow");
    });
}

export function tocarSom(opcoes) {
    if (!opcoes || !opcoes.somAtivo) return;
    if (!window.Audio) return;

    const audio = new Audio(opcoes.somUrl || "");
    audio.volume = typeof opcoes.volume === "number" ? opcoes.volume : 0.3;
    audio.play().catch(() => {
        // Enquanto o áudio não carrega ou não está disponível, não interromper a UX.
    });
}

export function animarAberturaModal(modal) {
    if (!modal) return;
    modal.classList.add("modal-enter");
    setTimeout(() => modal.classList.remove("modal-enter"), 300);
}
