import { selecionaItens } from "./selecionar.js";

let listaCompleta = new Array();

let modo = false;
const modoIndex = sessionStorage.getItem('sessionMI');
try {
    if(modoIndex !== null) {
        modo = JSON.parse(modoIndex)[0];
    }
}catch(error){}
if(modo) {
    const idsInputs = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(idsInputs, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, 
    '#cep': inputCep, '#endereco': inputEndereco} = itensInputsIds;

    let lista = JSON.parse(localStorage.getItem('lista'));
    const index = JSON.parse(modoIndex)[1];
    inputNome.value = lista[index].nome;
    inputSobrenome.value = lista[index].sobrenome;
    inputData.value = lista[index].data;
    inputCep.value = lista[index].cep;
    inputEndereco.value = lista[index].endereco;

    document.querySelector('#btn_adicionar').style.display = 'none';
    document.querySelector('#btn_listar').style.display = 'none';
    document.querySelector('#btn_alterar').style.display = 'flex';
    sessionStorage.setItem('sessionMI', [false, -1]);
}

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

        const listaString = localStorage.getItem("lista");
        listaCompleta = listaString ? JSON.parse(listaString) : listaCompleta;

        listaCompleta.push(infosCliente);
        localStorage.setItem('lista', JSON.stringify(listaCompleta));

        limparInputs(itensInputsIds);

        setTimeout(() => {
            alert("Adicionado!");
        }, 0);

    }

});

// Botão para confirmar edição
document.querySelector('#btn_alterar button').addEventListener('click', () => {
    const idsInputs = ['#nome','#sobrenome','#data','#cep','#cidade','#uf','#endereco'];
    const itensInputsIds = selecionaItens(idsInputs, document);
    const {'#nome': inputNome, '#sobrenome': inputSobrenome, '#data': inputData, 
    '#cep': inputCep, '#endereco': inputEndereco} = itensInputsIds;

    const check = validarCampos(itensInputsIds);
    if(check.every((i) => !!i)) {
        let lista = JSON.parse(localStorage.getItem('lista'));
        const index = JSON.parse(modoIndex)[1];

        let objCapturado = lista[index];
        objCapturado.nome = inputNome.value;
        objCapturado.sobrenome =  inputSobrenome.value;
        objCapturado.data = inputData.value;
        objCapturado.cep = inputCep.value;
        objCapturado.endereco = inputEndereco.value;
        lista[index] = objCapturado;

        localStorage.setItem('lista', JSON.stringify(lista));
        window.location.href = 'lista.html';
    }
});

const cep = document.querySelector('#cep');
cep.addEventListener('keyup', () => {
    verificaChamaCep();
});
cep.addEventListener('paste', () => {
    setTimeout(() => {
        verificaChamaCep();
    }, 0);
});

function verificaChamaCep() {
    if(cep.value.length === 9) {
        recebeViaCep();
    }
}

document.querySelector('#btn_listar button').addEventListener('click', () => {
    const vec = JSON.parse(localStorage.getItem('lista'));
    if(vec !== null) {
        window.location.href = 'lista.html';
    }else {
        alert("Você não pode carregar uma lista vazia!");
    }
});

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