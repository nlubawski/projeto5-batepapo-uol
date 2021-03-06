let nome = null
let mensagens = null
let destinatario = 'Todos'
let visibilidade = 'publicamente'

function obterMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(exibe)
    promessa.catch(erroAoObterMensagens)
}

function exibe(resposta){
    mensagens = resposta.data
    renderizaMensagens(mensagens)
}

function renderizaMensagens(mensagens){
    const textoMain = document.querySelector('.mensagem')
    textoMain.innerHTML = ''

    mensagens.forEach(element => { 
        if (element.type === 'message'){
            textoMain.innerHTML += `
            <div class="mensagem__publica" data-identifier="message">
                <span>${element.time}</span> <span class="nome">${element.from}<span> <span class="texto">para<span> <span class="nome">${element.to}:<span> <span class="texto"> ${element.text}</span>
            </div>           
            `            
        } else if (element.type === 'private_message' && (element.from === nome || element.to === nome)){   
            textoMain.innerHTML += `
            <div class="mensagem__privada" data-identifier="message">
                <span>${element.time}</span><span class="nome">${element.from}<span> <span class="texto"> reservadamente para </span> <span class="nome">${element.to}: <span class="texto"> ${element.text}</span>
            </div>
            `
        } else if (element.type === 'status') {
            textoMain.innerHTML += `
            <div class="mensagem__status" data-identifier="message">
                <span>${element.time}</span> <span class="nome">${element.from}<span>  <span class="texto"> ${element.text}</span>
            </div>
            `
        }           
    }) 
    setTimeout(scroll, 1000)
}

function erroAoObterMensagens(erro){
    alert('erro ao carregar mensagens, a página será recarregada ...')
    window.location.reload()
}

function cadastrarUsuario(nome){
    const pessoa = {
        name: nome
    }
    
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',pessoa) 
    setTimeout(() => {
        promessa.then(exibirResposta)
        promessa.catch(erroAoCadastrar)
    }, 2000)
}

function exibirResposta(resposta){
    const entrada = document.querySelector('.entrada')
    entrada.classList.add('esconder')

    setInterval(manterConexao, 5000)
    setInterval(buscarParticipantes, 10000)
    setInterval(obterMensagens, 3000)
}

function erroAoCadastrar(erro){
    if (erro.response.status !== 200){
        alert('esse nome já está em uso, escolha outro...')
        telaCarregando()
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
	to: destinatario,
    text: texto.value,
	type: visibilidade === 'publicamente'? 'message' : 'private_message'
    }

    texto.value = ""

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
        <div class="contatos__todos" onclick="selecionarParticipante(this)" data-identifier="participant">
            <div><ion-icon name="people-sharp"></ion-icon> <span class="nome">Todos</span> </div>  <div class="selecionado esconder"><ion-icon name="checkmark-outline"></ion-icon></div>
        </div>
    `
    participantes.forEach(element => {
        textoAside.innerHTML += `
        <div class="contatos__individual" onclick="selecionarParticipante(this)" data-identifier="participant">
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
            <div class="status__publico" onclick="selecionarVisibilidade(this)" data-identifier="visibility">
                <div><ion-icon name="lock-open"></ion-icon> <span class="status__visibilidade">Público</span> </div>  <div class="escolhido esconder"><ion-icon name="checkmark-outline"></ion-icon></div>
            </div>
            <div class="status__privado" onclick="selecionarVisibilidade(this)" data-identifier="visibility">
                <div><ion-icon name="lock-closed"></ion-icon> <span class="status__visibilidade">Reservadamente</span></div>  <div class="escolhido esconder"><ion-icon name="checkmark-outline"></ion-icon></div> 
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
    nome = texto.value
    telaCarregando()
    cadastrarUsuario(nome)
}

function selecionarParticipante(participante){
    const desmarcar = document.querySelectorAll('.selecionado')
    if (desmarcar !== null){
        desmarcar.forEach(element => {
            element.classList.add('esconder') 
        })
    }
    
    const selecionar = participante.querySelector('.esconder')
    if (selecionar !== null){
        selecionar.classList.remove('esconder')
        const selecionado = participante.querySelector('.nome')
        if (selecionado !== null){
            destinatario = selecionado.innerText 
            alteraTelaDeEnvio()
        } 
    }
}

function selecionarVisibilidade(item){
    const desmarcar = document.querySelectorAll('.escolhido')
    if (desmarcar !== null){
        desmarcar.forEach(element => {
            element.classList.add('esconder') 
        });
    }
    
    const selecionar = item.querySelector('.esconder')
    if (selecionar !== null){
        selecionar.classList.remove('esconder')
        const selecionado = item.querySelector('.status__visibilidade')
        if (selecionado !== null){
            visibilidade = selecionado.innerText 
            alteraTelaDeEnvio()
        } 
    }
}

function telaCarregando(){
    document.querySelector('.entrada .entrada__input').classList.toggle('esconder')
    document.querySelector('.entrada .entrada__button').classList.toggle('esconder')
    document.querySelector('.entrada .carregando').classList.toggle('esconder')
}

function alteraTelaDeEnvio(){
    document.querySelector('footer .contato').innerHTML = `${destinatario}`
    document.querySelector('footer .visibilidade').innerHTML = `(${visibilidade})`
}

function scroll(){
    switch (mensagens[0].type){
        case 'status':
            const divStatus = document.querySelectorAll('.mensagem__status')
            divStatus[divStatus.length - 1].scrollIntoView()
            break

        case 'private_message':
            const divPrivada = document.querySelectorAll('.mensagem__privada')
            divPrivada[divPrivada.length - 1].scrollIntoView()
            break
        
            case 'message':
            const divPublica = document.querySelectorAll('.mensagem__publica')
            divPublica[divPublica.length - 1].scrollIntoView()
            break
    }
}
