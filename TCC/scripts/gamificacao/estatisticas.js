export function calcularEstatisticasTrofeus(TROFEUS, trofeusUsuario = {}) {
    const lista = Object.values(TROFEUS);
    const desbloqueados = lista.filter((trofeu) => trofeusUsuario[trofeu.id]);
    const bloqueados = lista.length - desbloqueados.length;
    const secretos = lista.filter((trofeu) => trofeu.oculto && !trofeusUsuario[trofeu.id]);
    const pontosTotais = desbloqueados.reduce((sum, trofeu) => sum + trofeu.pontos, 0);

    return {
        total: lista.length,
        desbloqueados: desbloqueados.length,
        bloqueados,
        secretos: secretos.length,
        pontosTotais
    };
}

export function calcularNivelPorXP(xp) {
    if (xp >= 1000) return 5;
    if (xp >= 500) return 4;
    if (xp >= 250) return 3;
    if (xp >= 100) return 2;
    return 1;
}
