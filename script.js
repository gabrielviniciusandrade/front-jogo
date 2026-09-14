
// ==========================================
// QUANTUM RUN 🎮
// ==========================================

// ---------- NÍVEIS ----------
const niveis = {
    1: {
        nome: "FÁCIL",
        velocidade: 1.2,
        intervaloInimigo: 90
    },

    2: {
        nome: "MÉDIO",
        velocidade: 2,
        intervaloInimigo: 55
    },

    3: {
        nome: "INSANO",
        velocidade: 2.8,
        intervaloInimigo: 30
    }
};


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const levelMenu = document.getElementById("levelMenu");
const gameArea = document.getElementById("gameArea");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const levelElement = document.getElementById("currentLevel");
const highScoreElement = document.getElementById("highScore");


// ==========================================
// JOGADOR
// ==========================================

const player = {
    x: 300,
    y: 250,
    size: 18,
    speed: 5
};


// ==========================================
// VARIÁVEIS
// ==========================================

let score = 0;
let lives = 3;
let level = 1;

let enemies = [];
let energies = [];
let particles = [];

let gameRunning = false;

let enemyTimer = 0;
let energyTimer = 0;
let scoreTimer = 0;

let lastTime = 0;

let highScore =
    Number(localStorage.getItem("quantumRunHighScore")) || 0;


// Mostrar recorde
highScoreElement.textContent = highScore;


// ==========================================
// TECLADO
// ==========================================

const keys = {};

document.addEventListener("keydown", function (event) {

    keys[event.key.toLowerCase()] = true;

    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }
});


document.addEventListener("keyup", function (event) {

    keys[event.key.toLowerCase()] = false;
});


// ==========================================
// BOTÃO JOGAR AGORA
// ==========================================

function irParaJogo() {

    const jogo = document.getElementById("jogo");

    jogo.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// TAMANHO DO CANVAS
// ==========================================

function ajustarCanvas() {

    const largura =
        canvas.parentElement.clientWidth;

    canvas.width = Math.min(largura - 20, 900);

    canvas.height = 500;

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
}


window.addEventListener(
    "resize",
    ajustarCanvas
);


// ==========================================
// ESCOLHER NÍVEL
// ==========================================

function selecionarNivel(nivelEscolhido) {

    console.log("Nível escolhido:", nivelEscolhido);

    level = nivelEscolhido;

    levelMenu.style.display = "none";

    gameArea.style.display = "block";

    ajustarCanvas();

    iniciarJogo();

    gameArea.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ==========================================
// INICIAR JOGO
// ==========================================

function iniciarJogo() {

    score = 0;

    lives = 3;

    enemies = [];

    energies = [];

    particles = [];

    enemyTimer = 0;

    energyTimer = 0;

    scoreTimer = 0;

    player.x = canvas.width / 2;

    player.y = canvas.height / 2;

    gameRunning = true;

    atualizarInterface();

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// ==========================================
// REINICIAR
// ==========================================

function reiniciarJogo() {

    iniciarJogo();
}


// ==========================================
// VOLTAR PARA NÍVEIS
// ==========================================

function voltarNiveis() {

    gameRunning = false;

    gameArea.style.display = "none";

    levelMenu.style.display = "grid";

    enemies = [];

    energies = [];

    particles = [];

    limparTela();

    document.getElementById("jogo").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// MOVIMENTO
// ==========================================

function moverJogador() {

    if (keys["w"] || keys["arrowup"]) {

        player.y -= player.speed;
    }


    if (keys["s"] || keys["arrowdown"]) {

        player.y += player.speed;
    }


    if (keys["a"] || keys["arrowleft"]) {

        player.x -= player.speed;
    }


    if (keys["d"] || keys["arrowright"]) {

        player.x += player.speed;
    }


    // Limites laterais

    if (player.x < player.size) {

        player.x = player.size;
    }


    if (
        player.x >
        canvas.width - player.size
    ) {

        player.x =
            canvas.width - player.size;
    }


    // Limites verticais

    if (player.y < player.size) {

        player.y = player.size;
    }


    if (
        player.y >
        canvas.height - player.size
    ) {

        player.y =
            canvas.height - player.size;
    }
}


// ==========================================
// CRIAR INIMIGO
// ==========================================

function criarInimigo() {

    const lado =
        Math.floor(Math.random() * 4);

    let x;
    let y;


    // Cima

    if (lado === 0) {

        x =
            Math.random() *
            canvas.width;

        y = -30;
    }


    // Direita

    if (lado === 1) {

        x =
            canvas.width + 30;

        y =
            Math.random() *
            canvas.height;
    }


    // Baixo

    if (lado === 2) {

        x =
            Math.random() *
            canvas.width;

        y =
            canvas.height + 30;
    }


    // Esquerda

    if (lado === 3) {

        x = -30;

        y =
            Math.random() *
            canvas.height;
    }


    enemies.push({

        x: x,

        y: y,

        size: 15,

        speed:
            niveis[level].velocidade +
            Math.random() * 0.8
    });
}


// ==========================================
// CRIAR ENERGIA
// ==========================================

function criarEnergia() {

    energies.push({

        x:
            30 +
            Math.random() *
            (canvas.width - 60),

        y:
            30 +
            Math.random() *
            (canvas.height - 60),

        size: 10,

        pulse: 0
    });
}


// ==========================================
// PARTÍCULAS
// ==========================================

function criarParticulas(
    x,
    y,
    quantidade = 20
) {

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5) * 7,

            vy:
                (Math.random() - 0.5) * 7,

            size:
                Math.random() * 4 + 1,

            life: 1
        });
    }
}


function atualizarParticulas() {

    particles.forEach(function (particle) {

        particle.x += particle.vx;

        particle.y += particle.vy;

        particle.life -= 0.025;

        particle.size *= 0.97;
    });


    particles =
        particles.filter(function (particle) {

            return particle.life > 0;
        });
}


// ==========================================
// MOVER INIMIGOS
// ==========================================

function moverInimigos() {

    enemies.forEach(function (enemy) {

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distancia > 0) {

            enemy.x +=
                (dx / distancia) *
                enemy.speed;

            enemy.y +=
                (dy / distancia) *
                enemy.speed;
        }
    });
}


// ==========================================
// COLISÕES
// ==========================================

function detectarColisoes() {

    // ---------- INIMIGOS ----------

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy = enemies[i];

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            player.size + enemy.size
        ) {

            criarParticulas(
                enemy.x,
                enemy.y,
                30
            );

            enemies.splice(i, 1);

            lives--;

            atualizarInterface();


            if (lives <= 0) {

                gameOver();

                return;
            }
        }
    }


    // ---------- ENERGIA ----------

    for (
        let i = energies.length - 1;
        i >= 0;
        i--
    ) {

        const energy = energies[i];

        const dx =
            player.x - energy.x;

        const dy =
            player.y - energy.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            player.size + energy.size
        ) {

            criarParticulas(
                energy.x,
                energy.y,
                25
            );

            energies.splice(i, 1);

            score += 10;

            atualizarInterface();
        }
    }
}


// ==========================================
// INTERFACE
// ==========================================

function atualizarInterface() {

    scoreElement.textContent =
        score;


    livesElement.textContent =
        "❤️".repeat(lives);


    levelElement.textContent =
        niveis[level].nome;


    highScoreElement.textContent =
        highScore;
}


// ==========================================
// FUNDO
// ==========================================

function desenharFundo() {

    ctx.fillStyle = "#050816";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grade

    ctx.strokeStyle =
        "rgba(0, 255, 255, 0.08)";

    ctx.lineWidth = 1;


    const tamanho = 40;


    for (
        let x = 0;
        x < canvas.width;
        x += tamanho
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += tamanho
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }
}


// ==========================================
// DESENHAR JOGADOR
// ==========================================

function desenharJogador() {

    ctx.save();


    // Brilho

    ctx.shadowBlur = 30;

    ctx.shadowColor =
        "#00ffff";


    ctx.fillStyle =
        "#00ffff";


    // Triângulo

    ctx.beginPath();

    ctx.moveTo(
        player.x,
        player.y - player.size
    );

    ctx.lineTo(
        player.x - player.size,
        player.y + player.size
    );

    ctx.lineTo(
        player.x + player.size,
        player.y + player.size
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();
}


// ==========================================
// DESENHAR INIMIGOS
// ==========================================

function desenharInimigos() {

    enemies.forEach(function (enemy) {

        ctx.save();

        ctx.shadowBlur = 25;

        ctx.shadowColor =
            "#ff1744";

        ctx.fillStyle =
            "#ff1744";


        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    });
}


// ==========================================
// DESENHAR ENERGIA
// ==========================================

function desenharEnergias() {

    energies.forEach(function (energy) {

        energy.pulse += 0.1;


        const tamanho =
            energy.size +
            Math.sin(
                energy.pulse
            ) * 3;


        ctx.save();


        ctx.shadowBlur = 30;

        ctx.shadowColor =
            "#ffe600";

        ctx.fillStyle =
            "#ffe600";


        ctx.beginPath();

        ctx.arc(
            energy.x,
            energy.y,
            tamanho,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    });
}


// ==========================================
// DESENHAR PARTÍCULAS
// ==========================================

function desenharParticulas() {

    particles.forEach(function (particle) {

        ctx.save();


        ctx.globalAlpha =
            particle.life;


        ctx.fillStyle =
            "#00ffff";


        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#00ffff";


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    });
}


// ==========================================
// NÍVEL NA TELA
// ==========================================

function desenharNivel() {

    ctx.save();


    ctx.font =
        "bold 16px Arial";


    ctx.fillStyle =
        "#00ffff";


    ctx.shadowBlur = 10;

    ctx.shadowColor =
        "#00ffff";


    ctx.fillText(
        "NÍVEL: " +
        niveis[level].nome,
        20,
        30
    );


    ctx.restore();
}


// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

    gameRunning = false;


    let novoRecorde = false;


    if (score > highScore) {

        highScore = score;

        novoRecorde = true;


        localStorage.setItem(
            "quantumRunHighScore",
            highScore
        );
    }


    atualizarInterface();

    desenharTelaGameOver(
        novoRecorde
    );
}


// ==========================================
// TELA GAME OVER
// ==========================================

function desenharTelaGameOver(
    novoRecorde
) {

    ctx.fillStyle =
        "rgba(0, 0, 0, 0.78)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    ctx.textAlign =
        "center";


    // GAME OVER

    ctx.shadowBlur = 30;

    ctx.shadowColor =
        "#ff1744";


    ctx.fillStyle =
        "#ff1744";


    ctx.font =
        "bold 52px Arial";


    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 60
    );


    // Pontuação

    ctx.shadowBlur = 15;

    ctx.shadowColor =
        "#00ffff";


    ctx.fillStyle =
        "#00ffff";


    ctx.font =
        "bold 24px Arial";


    ctx.fillText(
        "Pontuação: " + score,
        canvas.width / 2,
        canvas.height / 2 - 10
    );


    // Recorde

    ctx.fillText(
        "Recorde: " + highScore,
        canvas.width / 2,
        canvas.height / 2 + 25
    );


    // Novo recorde

    if (novoRecorde) {

        ctx.shadowColor =
            "#ffe600";


        ctx.fillStyle =
            "#ffe600";


        ctx.font =
            "bold 20px Arial";


        ctx.fillText(
            "🏆 NOVO RECORDE!",
            canvas.width / 2,
            canvas.height / 2 + 65
        );
    }


    // Mensagem

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "16px Arial";


    ctx.fillText(
        "Clique em REINICIAR para jogar novamente",
        canvas.width / 2,
        canvas.height / 2 + 105
    );


    ctx.restore();
}


// ==========================================
// LIMPAR TELA
// ==========================================

function limparTela() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// ==========================================
// LOOP PRINCIPAL
// ==========================================

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }


    const deltaTime =
        timestamp - lastTime;


    lastTime =
        timestamp;


    // Movimento

    moverJogador();


    // Inimigos

    enemyTimer++;


    if (
        enemyTimer >=
        niveis[level].intervaloInimigo
    ) {

        criarInimigo();

        enemyTimer = 0;
    }


    // Energia

    energyTimer++;


    if (energyTimer >= 100) {

        criarEnergia();

        energyTimer = 0;
    }


    // Pontuação por tempo

    scoreTimer += deltaTime;


    if (scoreTimer >= 1000) {

        score++;

        scoreTimer -= 1000;

        atualizarInterface();
    }


    // Atualizações

    moverInimigos();

    detectarColisoes();

    atualizarParticulas();


    // Desenho

    desenharFundo();

    desenharEnergias();

    desenharInimigos();

    desenharParticulas();

    desenharJogador();

    desenharNivel();


    // Próximo frame

    requestAnimationFrame(gameLoop);
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

ajustarCanvas();

atualizarInterface();