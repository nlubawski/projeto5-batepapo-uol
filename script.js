const nome = prompt('Qual seu nome? ')
let mensagens = null

function obterMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(exibe)
}

function exibe(resposta){
    mensagens = resposta.data
    console.log(mensagens)
    renderizaMensagens(mensagens)
}

function renderizaMensagens(mensagens){
    const textoMain = document.querySelector('.mensagem')
    textoMain.innerHTML = ''

    mensagens.forEach(element => { 

        if (element.type === 'message'){

            textoMain.innerHTML += `
            <div class="mensagem__publica">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>           
            `
            //rolagemAutomatica(rolagem) 
            
        } else if (element.to === nome){ //puxar so as msg direcionadas pra mim

            textoMain.innerHTML += `
            <div class="mensagem__privada">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
            //rolagemAutomatica(element, 'private__mensagem')
        } else if (element.type === 'status') {
            textoMain.innerHTML += `
            <div class="mensagem__status">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
        }           
    }) 
}

function cadastrarUsuario(nome){
    const pessoa = {
        name: nome
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',pessoa) 
    promessa.then(exibirResposta)
    promessa.catch(erroAoCadastrar)

    setInterval(manterConexao, 5000)
}

function exibirResposta(resposta){
    console.log(resposta)
}

function erroAoCadastrar(erro){
    console.log(erro.response)
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
	    type: "message"
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagem)
    promessa.then(exibirResposta)
}



//function rolagem(){
//     const msg = document.querySelectorAll('.mensagem__publica')
//     return msg[msg.length -1]

// }

// function rolagemAutomatica(rolagem){
//     const elementoQueQueroQueApareca = rolagem.querySelector('.mensagem__publica');
// elementoQueQueroQueApareca.scrollIntoView();
    
// }

cadastrarUsuario(nome)
setInterval(obterMensagens, 3000)