export function selecionaItens(ids, local) {
    const armazenaSelecionados = {}
    ids.forEach((id) => {
        armazenaSelecionados[id] = local.querySelector(id);
    });
    return armazenaSelecionados;
}