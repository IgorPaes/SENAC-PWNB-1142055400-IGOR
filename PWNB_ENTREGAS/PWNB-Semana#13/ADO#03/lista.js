import { selecionaItens } from "./selecionar.js";

document.addEventListener('DOMContentLoaded', function() {
    const vec = JSON.parse(localStorage.getItem('lista'));
    vec.forEach((item) => {
        const addItem = criarItem(item.nome, item.sobrenome, item.data, item.cep, item.endereco);
        document.getElementById('blocoLista').insertAdjacentHTML('beforeend', addItem);
    });

    document.querySelectorAll('#linha').forEach((linha, index) => {
        criaBtnsExcluir(linha, index, vec);
        criaBtnsEditar(linha, index);
    });
});

// Botão para excluir a lista toda
document.querySelector('#btn_limpar button').addEventListener('click', () => {
    document.querySelector('#blocoLista').innerHTML = '';
    localStorage.removeItem('lista');
});

document.querySelector('#btn_voltar button').addEventListener('click', () => {
    window.location.href = 'cadastro.html';
});

function criarItem(nome, sobreNome, data, cep, endereco) {
    return `
        <li class="linha_itens" id="linha">
            <sup id="txt_nomeSobrenome">${nome} ${sobreNome}</sup>
            <sup id="txt_data">${data}</sup>
            <sup id="txt_cep">${cep}</sup>
            <sup id="txt_endereco">${endereco}</sup>
            <sup class="acoes" id="btns_linha">
                <button id="btn_editar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button id="btn_excluir">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </sup>
        </li>
    `;
}

function criaBtnsExcluir(linha, index, vecLista) {
    linha.querySelector('#btn_excluir').addEventListener('click', () => {
        vecLista.splice(index, 1);
        localStorage.setItem('lista', JSON.stringify(vecLista));
        linha.remove();
    });
}

function criaBtnsEditar(linha, index) {
    linha.querySelector('#btn_editar').addEventListener('click', () => {
        window.location.href = 'cadastro.html';
        sessionStorage.setItem('sessionMI', JSON.stringify([true, index]));
    });
}
