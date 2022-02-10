const nome = prompt('Qual seu nome? ')

function obterMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(exibe)
}

function exibe(resposta){
    console.log(resposta.data)
    resposta.data.forEach(element => { 

        const textoMain = document.querySelector('.mensagem')

        if (element.type === 'message'){

            textoMain.innerHTML += `
            <div class="mensagem__publica">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>            
            `
        } else if (element.type === 'private_message'){

            textoMain.innerHTML += `
            <div class="mensagem__privada">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
        } else if (element.type === 'status') {
            textoMain.innerHTML += `
            <div class="mensagem__status">
                <span>${element.time}</span><span>${element.from}  ${element.text}</span>
            </div>
            `
        }        
    });
}

//setInterval(obterMensagens, 3000)