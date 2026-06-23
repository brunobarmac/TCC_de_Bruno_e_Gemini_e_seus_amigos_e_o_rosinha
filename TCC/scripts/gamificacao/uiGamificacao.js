export function criarElemento(tag, className = "", attributes = {}) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    Object.entries(attributes).forEach(([name, value]) => {
        if (value === null || value === undefined) {
            return;
        }
        element.setAttribute(name, value);
    });

    return element;
}

export function criarBadgeRaridade(raridade) {
    const badge = criarElemento("span", `rarity-badge rarity-${raridade}`);
    badge.textContent = raridade.charAt(0).toUpperCase() + raridade.slice(1);
    return badge;
}

export function formatarPorcentagem(valor) {
    return `${Math.round(valor * 100)}%`;
}
