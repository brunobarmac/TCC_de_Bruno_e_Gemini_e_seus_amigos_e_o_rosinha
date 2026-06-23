export function filtrarTrofeus(lista, filtro) {
    if (!filtro || filtro === "todos") {
        return lista;
    }
    return lista.filter((trofeu) => trofeu.raridade === filtro);
}

export function pesquisarTrofeus(lista, termo) {
    if (!termo) {
        return lista;
    }

    const texto = termo.toLowerCase();
    return lista.filter((trofeu) => {
        return (
            trofeu.nome.toLowerCase().includes(texto) ||
            trofeu.descricao.toLowerCase().includes(texto) ||
            trofeu.categoria.toLowerCase().includes(texto)
        );
    });
}
