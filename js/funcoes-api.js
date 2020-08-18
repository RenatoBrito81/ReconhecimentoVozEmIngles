//Dados para executar o jogo
var engine = {
    "cores": ["green","purple","pink","red","yellow","orange","gray", "black","white"],
    "hexadecimais": ["#02EF00", "#790093", "#F02A7E", "#E90808", "#E7D703", "#F16529", "#EBEBEB", "#141414", "#FFFFFF"],
    "moedas": 0
}

//Referências aos áudios do jogo
const audioMoeda = new Audio("../audio/moeda.mp3");
const audioErrou = new Audio("../audio/errou.mp3");

//Função para sortear uma cor
function sortearCor(){
    //Define o índice da cor sorteada
    var indiceCorSorteada = Math.floor(Math.random() * engine.cores.length);

    //Atribui a cor sorteada
    document.getElementById("cor-na-caixa").innerText = engine.cores[indiceCorSorteada].toUpperCase();
    document.getElementById("cor-atual").style.backgroundColor = engine.hexadecimais[indiceCorSorteada];
    document.getElementById("cor-atual").style.backgroundImage = "url('/img/caixa-fechada.png')";
    document.getElementById("cor-atual").style.backgroundSize = "100%";
}
sortearCor();

//Função para atualizar a pontução
function atualizarPontuacaoAtual(valor){
    //Soma o valor no contador de moedas
    engine.moedas += valor;
    
    //Verifica se errou a cor
    if(valor < 0 ){
        //Toca o áudio de erro
        audioErrou.play();
    }
    else{
        //Toca o áudio de acerto
        audioMoeda.play();
    }

    //Seta a pontução
    document.getElementById("pontuacao-atual").innerText = engine.moedas
}

//Referência a API de reconhcimento de voz
var botaoGravador = document.getElementById("btn-responder");
var gravador;

//Verifica a versão da API de reconhecimento de voz
if(window.SpeechRecognition || window.webkitSpeechRecognition){
    var speechAPI =  window.SpeechRecognition || window.webkitSpeechRecognition;
    gravador = new speechAPI();

    //Configura a API
    gravador.continuous = false;
    gravador.lang = "en-US";

    //Configura o evento start
    gravador.onstart = function(){
        botaoGravador.innerText = "Estou ouvindo...";
        botaoGravador.style.backgroundColor = "white";
        botaoGravador.style.color = "black";
    }

    //Configura o evento end
    gravador.onend = function(){
        botaoGravador.innerText = "RESPONDER";
        botaoGravador.style.backgroundColor = "transparent";
        botaoGravador.style.color = "white";
    }

    //Configura o evento result
    gravador.onresult = function(evento){
        var transcricaoAudio = evento.results[0][0].transcript.toUpperCase();
        var respostaCorreta = document.getElementById("cor-na-caixa").innerText.toUpperCase();

        //Seta a cor padrão
        document.getElementById("cor-padrao").innerText = respostaCorreta.toUpperCase();

        //Seta a resposta idenficada
        document.getElementById("resposta-cor").innerText = transcricaoAudio.toUpperCase();

        //Verifica se a cor foi acertada
        if(transcricaoAudio === respostaCorreta){
            //Atualiza a pontuação
        atualizarPontuacaoAtual(1)
        }
        else{
            //Atualiza a pontuação
        atualizarPontuacaoAtual(-1)
        }

        //Sorte uma nova cor
        sortearCor();
    }
}
else{
    alert("Navegador não possui suporte ao reconhecimento de voz.\nPor favor abra a página em outro nagevador.");
}

//Adiciona o evento ao botão responder
botaoGravador.addEventListener("click", function(e){
    //Inicia a gravação do áudio
    gravador.start();
});