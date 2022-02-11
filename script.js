let nome //= prompt('Qual seu nome? ')
let mensagens = null
let destinatario 

function obterMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(exibe)
    promessa.catch(erroAoObterMensagens)
}

function exibe(resposta){
    mensagens = resposta.data
    //console.log(mensagens)
    renderizaMensagens(mensagens)
}

function renderizaMensagens(mensagens){
    const textoMain = document.querySelector('.mensagem')
    textoMain.innerHTML = ''

    mensagens.forEach(element => { 

        if (element.type === 'message'){

            textoMain.innerHTML += `
            <div class="mensagem__publica" data-identifier="message">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>           
            `            
        } else if (element.type === 'private_message'){ //puxar so as msg direcionadas pra mim

            textoMain.innerHTML += `
            <div class="mensagem__privada" data-identifier="message">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
        } else if (element.type === 'status') {
            textoMain.innerHTML += `
            <div class="mensagem__status" data-identifier="message">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
        }           
    }) 
    
}

function erroAoObterMensagens(erro){
    alert('erro ao carregar mensagens, recarregue a página ...')
}

function cadastrarUsuario(nome){
    const pessoa = {
        name: nome
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',pessoa) 
    promessa.then(exibirResposta)
    promessa.catch(erroAoCadastrar)

    
}

function exibirResposta(resposta){
    const entrada = document.querySelector('.entrada')
    entrada.classList.add('esconder')

    setInterval(manterConexao, 5000)
    setInterval(buscarParticipantes, 10000)
    setInterval(obterMensagens, 3000)
}

function erroAoCadastrar(erro){
    //console.log(erro.response)
    if (erro.response.status === 400){
        alert('esse nome já está em uso, escolha outro...')
        //const nome = prompt('Digite um nome ... ')
        //cadastrarUsuario(nome)
    }
}

function manterConexao(){
    const pessoa = {
        name: nome
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', pessoa)
}

function enviarMensagem(){
    const texto = document.querySelector('footer input')

    const mensagem = {
        from: nome,
	    to: "Todos",
	    text: texto.value,
	    type: 'message'          //"private_message"
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagem)
    promessa.then(obterMensagens)
    promessa.catch(erroAoEnviar)
}

function erroAoEnviar(erro){
    window.location.reload()
}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        const tela  = document.querySelector('.entrada')
        const telaEntrada = tela.classList.contains('esconder')
        if (telaEntrada){
            enviarMensagem() 
        }else{
            telaInicial()
        }
            
    }
})

function buscarParticipantes(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promessa.then(listarParticipantes)
    promessa.catch(erroAoBuscarParticipantes)
}

function listarParticipantes(resposta){
    let participantes = resposta.data
    //console.log(participantes)
    renderizarParticipantes(participantes)
}

function erroAoBuscarParticipantes(){
    alert('erro ao buscar participantes...')
}

function renderizarParticipantes(participantes){
    const textoAside = document.querySelector('.container')
    textoAside.innerHTML = `
    <div class="topo">
        <p>Escolha um contato para enviar uma mensagem:</p>
    </div>
    <div class="contatos">
        <div class="contatos__todos" onclick="selecionarParticipante(this)">
            <div><ion-icon name="people-sharp"></ion-icon> <span class="nome">Todos</span> </div>  <div class="selecionado esconder"><ion-icon name="checkmark-outline"></ion-icon></div>
        </div>
    `
    console.log('participantes ' ,participantes)
    participantes.forEach(element => {
        textoAside.innerHTML += `
        <div class="contatos__individual" onclick="selecionarParticipante(this)">
            <div><ion-icon name="person-circle"></ion-icon> <span class="nome">${element.name}</span> </div>  <div class="selecionado esconder"><ion-icon name="checkmark-outline"></ion-icon></div>
        </div>
        `   
    })

    textoAside.innerHTML +=`
        </div>
        <div class="visibilidade">
            <p>Escolha a visibilidade:</p>
        </div>
        <div class="status">
            <div class="status__publico">
                <div><ion-icon name="lock-open"></ion-icon> <span>Público</span> </div>  <div class="selecionado"><ion-icon name="checkmark-outline"></ion-icon></div>
            </div>
            <div class="status__privado">
                <div><ion-icon name="lock-closed"></ion-icon> <span>Reservadamente</span></div>  <div class="selecionado"><ion-icon name="checkmark-outline"></ion-icon></div> 
            </div>
        </div>    
        `
}


function participantesAtivos(){
    const participantes = document.querySelector('aside')
    participantes.classList.toggle('esconder')

    const fundo = document.querySelector('.fundo')
    fundo.classList.toggle('esconder')
}

function telaInicial(){
    const texto = document.querySelector('.entrada input')
    texto.classList.add('esconder')
    nome = texto.value
    cadastrarUsuario(nome)
}

function selecionarParticipante(participante){
    const desmarcar = document.querySelectorAll('.selecionado')
    if (desmarcar !== null){
        desmarcar.forEach(element => {
            element.classList.add('esconder') 
        });
        
    }
    
    const selecionar = participante.querySelector('.esconder')
    if (selecionar !== null){
        selecionar.classList.remove('esconder')
        const selecionado = participante.querySelector('.nome')
        if (selecionado !== null){
            destinatario = selecionado.innerText 
            console.log("destinatario ", destinatario)  
        }
        
    }
    
}





