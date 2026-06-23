export const conquistas = [
    {
        id: "primeiro_acerto",
        nome: "Primeiro Acerto",
        descricao: "Acerte sua primeira questão.",
        imagem: "🎯",
        icone: "🎯",
        raridade: "comum",
        categoria: "Quiz",
        xp: 50,
        pontos: 50,
        oculto: false,
        cor: "#f6c23e",
        ordem: 1,
        progresso: {
            atual: 0,
            meta: 1
        }
    },
    {
        id: "historiador",
        nome: "Fase Perfeita",
        descricao: "Complete uma fase sem errar.",
        imagem: "💎",
        icone: "💎",
        raridade: "epico",
        categoria: "História",
        xp: 150,
        pontos: 250,
        oculto: false,
        cor: "#8e44ad",
        ordem: 2,
        progresso: {
            atual: 0,
            meta: 1
        }
    },
    {
        id: "multi_linguagens",
        nome: "Multilíngue",
        descricao: "Troque o idioma 3 vezes.",
        imagem: "🌍",
        icone: "🌍",
        raridade: "comum",
        categoria: "Idiomas",
        xp: 100,
        pontos: 150,
        oculto: false,
        cor: "#1abc9c",
        ordem: 3,
        progresso: {
            atual: 0,
            meta: 3
        }
    },
    {
        id: "desastre_historica",
        nome: "Desastre Histórico",
        descricao: "Erre todas as questões.",
        imagem: "💥",
        icone: "💥",
        raridade: "raro",
        categoria: "História",
        xp: 20,
        pontos: 25,
        oculto: true,
        cor: "#3498db",
        ordem: 4,
        progresso: {
            atual: 0,
            meta: 1
        }
    },
];

export const TROFEUS_ORDENADOS = conquistas.slice().sort((a, b) => a.ordem - b.ordem);

export function getTrofeu(id) {
    return conquistas.find((trofeu) => trofeu.id === id);
}

export function getListaTrofeus() {
    return TROFEUS_ORDENADOS;
}

export function getTrofeusPorRaridade(raridade) {
    if (!raridade || raridade === "todos") {
        return getListaTrofeus();
    }
    return getListaTrofeus().filter((trofeu) => trofeu.raridade === raridade);
}
