let listaCompleta = new Array();

// Quando o mouse entrar na parte dos inputs
document.querySelector('.bloco_inputs').addEventListener('mouseenter', () => {

    const ids = ['#nome','#sobrenome','#data','#cep'];
    const itensInputsIds = selecionaItens(ids, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, '#cep': inputCep} = itensInputsIds;
    
    RegexListenerSimples(inputNome, /[^A-Za-zÀ-ÿ\s]/g);
    RegexListenerSimples(inputSobrenome, /[^A-Za-zÀ-ÿ\s]/g);
    RegexListenerSimples(inputData, /\D/g);
    RegexListenerSimples(inputCep, /\D/g);

    RegexListenerExpecifico(inputCep, /(\d{5})(\d{3})/, '$1-$2');
    RegexListenerExpecifico(inputData, /(\d{2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');

});

// Botão para adicionar novo registro
document.querySelector('#btn_adicionar button').addEventListener('click', () => {
    
    const ids = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(ids, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, 
    '#cep': inputCep, '#endereco': inputEndereco} = itensInputsIds;

    const check = validarCampos(itensInputsIds);

    if(check.every((i) => !!i)) {
   
        const infosCliente = {
            nome: inputNome.value,
            sobrenome: inputSobrenome.value,
            data: inputData.value,
            cep: inputCep.value,
            endereco: inputEndereco.value,
        }
        
        listaCompleta.push(infosCliente);
        localStorage.setItem('lista', JSON.stringify(listaCompleta));

        limparInputs(itensInputsIds);
        alert("Adicionado!");
    }

});

function criaBtnsExcluir(linha) {
    linha.querySelector('#btn_excluir').addEventListener('click', () => {
        linha.remove();
    });
}

function criaBtnsEditar(linha) {
    const idsInputs = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(idsInputs, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, 
    '#cep': inputCep, '#endereco': inputEndereco} = itensInputsIds;
    
    linha.querySelector('#btn_editar').addEventListener('click', () => {

        limparInputs(itensInputsIds);

        document.querySelector('.caixa_principal').style.display = 'block';

        const idsIL = ['#txt_nomeSobrenome','#txt_data','#txt_cep','#txt_endereco'];
        const itensListaIds = selecionaItens(idsIL, linha);
        const {'#txt_nomeSobrenome': txtNomeSobrenome, '#txt_data': txtData, 
        '#txt_cep': txtCep, '#txt_endereco': txtEndereco} = itensListaIds;
        
        linha.classList.add('editando');
        
        inputNome.value = (txtNomeSobrenome.textContent).split(' ')[0];
        inputSobrenome.value = (txtNomeSobrenome.textContent).split(' ')[1];
        inputData.value = txtData.textContent;
        inputCep.value = txtCep.textContent;
        inputEndereco.value = txtEndereco.textContent;
        recebeViaCep();
        
        document.querySelector('#btn_adicionar').style.display = 'none';
        document.querySelector('#btn_listar').style.display = 'none';
        document.querySelector('#btn_alterar').style.display = 'flex';

    });

}

// Botão para confirmar edição
document.querySelector('#btn_alterar button').addEventListener('click', () => {

    const idsInputs = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(idsInputs, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, 
    '#cep': inputCep, '#endereco': inputEndereco} = itensInputsIds;

    let linhaLista;
    document.querySelectorAll('#linha').forEach((linha) => {
        if(linha.classList.contains('editando')) {
            linhaLista = linha;
            linha.classList.remove('editando');
            document.querySelector('.caixa_principal').style.display = 'none';
            return;
        }
    });

    if(!(linhaLista === undefined)) {

        const idsIL = ['#txt_nomeSobrenome','#txt_data','#txt_cep','#txt_endereco'];
        const itensListaIds = selecionaItens(idsIL, linhaLista);
        const {'#txt_nomeSobrenome': txtNomeSobrenome, '#txt_data': txtData, '#txt_cep': txtCep, 
        '#txt_endereco': txtEndereco} = itensListaIds;

        const check = validarCampos(itensInputsIds);
        
        if(check.every((i) => !!i)) {
            txtNomeSobrenome.textContent = `${inputNome.value} ${inputSobrenome.value}`;
            txtData.textContent = inputData.value;
            txtCep.textContent = inputCep.value;
            txtEndereco.textContent = inputEndereco.value;
            reset();
        }
        
    }else {
        reset();
        document.querySelector('.caixa_lista').style.display = 'none';
        alert("Você não pode alterar uma linha que foi excluída.");
    }

    function reset() {
        limparInputs(itensInputsIds);
        document.querySelector('#btn_alterar').style.display = 'none';
        document.querySelector('#btn_adicionar').style.display = 'flex';
        document.querySelector('#btn_listar').style.display = 'flex';
    }
    
});

// Botão para excluir a lista toda
document.querySelector('#btn_limpar button').addEventListener('click', () => {
    const idsInputs = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(idsInputs, document);
    limparInputs(itensInputsIds);
    
    document.querySelector('#blocoLista').innerHTML = '';
    document.querySelector('.caixa_lista').style.display = 'none';
    document.querySelector('.caixa_principal').style.display = 'block';

    document.querySelector('#btn_alterar').style.display = 'none';
    document.querySelector('#btn_adicionar').style.display = 'flex';

    localStorage.removeItem('lista');
});

document.querySelector('#btn_listar button').addEventListener('click', () => {

    const vec = JSON.parse(localStorage.getItem('lista'));
    if(vec !== null) {
        vec.forEach((item) =>  {
            const addItem = criarItem(item.nome, item.sobrenome, item.data, item.cep, item.endereco);
            document.getElementById('blocoLista').innerHTML = addItem;
        });

        document.querySelector('.caixa_lista').style.display = 'block';
        document.querySelector('.caixa_principal').style.display = 'none';

        document.querySelectorAll('#linha').forEach((linha) => {
            criaBtnsExcluir(linha);
            criaBtnsEditar(linha);
        });
    }else {
        alert("Você não pode carregar uma lista vazia!");
    }

});

document.querySelector('#cep').addEventListener('focusout', () => {
    recebeViaCep();
});

document.querySelector('#btn_voltar').addEventListener('click', () => {
    
    document.querySelector('.caixa_principal').style.display = 'block';
    document.querySelector('.caixa_lista').style.display = 'none';

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

function validarCampos(itensInputsIds) {
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, '#cep': inputCep} = itensInputsIds;

    let check = [];
    check.push(minMaxCaracteres(inputNome, 2, 20));
    check.push(minMaxCaracteres(inputSobrenome, 2, 50));
    check.push(minMaxCaracteres(inputData, 8, 10));
    check.push(minMaxCaracteres(inputCep, 8, 9));
    
    return check;
}

function limparInputs(objInputs) {
    for(const propriedade in objInputs) {
        objInputs[propriedade].value = "";
        objInputs[propriedade].placeholder = "";
    }
}

function selecionaItens(ids, local) {
    const armazenaSelecionados = {}
    ids.forEach((id) => {
        armazenaSelecionados[id] = local.querySelector(id);
    });
    return armazenaSelecionados;
}

function RegexListenerSimples(input, regex) {
    input.addEventListener('input', () => {
        input.value = (input.value).replace(regex, '');
    });
}

function RegexListenerExpecifico(input, regex, sub) {
    input.addEventListener('input', () => {
        input.value = input.value.slice(0, 8);
        input.value = (input.value).replace(regex, sub);
    });
}

function minMaxCaracteres(input, min, max) {
    const regexString = `^.{${min},${max}}$`;
    const minMax = new RegExp(regexString);
    
    if(!minMax.test(input.value)) {
        input.value = "";
        input.placeholder = `Deve possuir entre ${min} e ${max} caracteres.`;
        return false;
    }
    return true;
}

async function recebeViaCep() {
    const idsIL = ['#cep','#cidade','#endereco','#uf'];
    const itensListaIds = selecionaItens(idsIL, document);
    const {'#cep': inputCep, '#cidade': inputCidade, '#endereco': inputEndereco, '#uf': inputUF} = itensListaIds;

    const response = await fetch(`https://viacep.com.br/ws/${inputCep.value}/json/`);

    if(!response.ok) {
        throw await response.json();
    }

    const responseCep = await response.json();

    inputCidade.value = responseCep.localidade;
    inputEndereco.value = responseCep.logradouro;
    inputUF.value = responseCep.uf;
}