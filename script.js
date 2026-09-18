// ==========================================
// QUANTUM RUN 🎮 — SCRIPT COMPLETO
// ==========================================

// ---------- NÍVEIS ----------
const niveis = {
    1: {
        nome: "FÁCIL",
        velocidadeInicial: 0.8,
        velocidadeMaxima: 2.2,
        aceleracao: 0.00008,
        intervaloInimigo: 100,
        intervaloInimigoMin: 60
    },
    2: {
        nome: "MÉDIO",
        velocidadeInicial: 1.2,
        velocidadeMaxima: 3.2,
        aceleracao: 0.00015,
        intervaloInimigo: 70,
        intervaloInimigoMin: 35
    },
    3: {
        nome: "INSANO",
        velocidadeInicial: 1.8,
        velocidadeMaxima: 4.5,
        aceleracao: 0.00025,
        intervaloInimigo: 45,
        intervaloInimigoMin: 18
    }
};


// ==========================================
// SKINS DO JOGADOR
// ==========================================

const skinsJogador = {
    default:    { nome: "Padrão",           cor: "#00ffff", corBrilho: "#00ffff", emoji: null, acessorio: null },
    red:        { nome: "Vermelho",         cor: "#ff4444", corBrilho: "#ff4444", emoji: null, acessorio: null },
    green:      { nome: "Verde",            cor: "#44ff44", corBrilho: "#44ff44", emoji: null, acessorio: null },
    purple:     { nome: "Roxo",             cor: "#aa44ff", corBrilho: "#aa44ff", emoji: null, acessorio: null },
    gold:       { nome: "Dourado",          cor: "#ffd700", corBrilho: "#ffd700", emoji: null, acessorio: null },
    hat:        { nome: "Chapéu",           cor: "#00ffff", corBrilho: "#00ffff", emoji: null, acessorio: "🎩" },
    sunglasses: { nome: "Óculos Escuros",   cor: "#00ffff", corBrilho: "#00ffff", emoji: null, acessorio: "🕶️" },
    cap:        { nome: "Boné",             cor: "#00ffff", corBrilho: "#00ffff", emoji: null, acessorio: "🧢" },
    brasil:     { nome: "Brasil",           cor: "#00ff00", corBrilho: "#ffff00", emoji: null, acessorio: "🇧🇷" },
    eua:        { nome: "EUA",              cor: "#ffffff", corBrilho: "#ff0000", emoji: null, acessorio: "🇺🇸" },
    japao:      { nome: "Japão",            cor: "#ffffff", corBrilho: "#ff0000", emoji: null, acessorio: "🇯🇵" },
    dragon:     { nome: "Dragão Lendário",  cor: "#ff6600", corBrilho: "#ff0000", emoji: "🐉", acessorio: null, lendario: true }
};


// ==========================================
// SKINS DOS INIMIGOS
// ==========================================

const skinsInimigo = {
    default: { nome: "Padrão",          cor: "#ff1744", corBrilho: "#ff1744", emoji: null },
    green:   { nome: "Verde",           cor: "#00ff00", corBrilho: "#00ff00", emoji: null },
    purple:  { nome: "Roxo",            cor: "#aa00ff", corBrilho: "#aa00ff", emoji: null },
    orange:  { nome: "Laranja",         cor: "#ff8800", corBrilho: "#ff8800", emoji: null },
    robot:   { nome: "Robô",            cor: "#00aaff", corBrilho: "#00aaff", emoji: "🤖" },
    alien:   { nome: "Alienígena",      cor: "#00ff88", corBrilho: "#00ff88", emoji: "👽" },
    skull:   { nome: "Caveira",         cor: "#ffffff", corBrilho: "#ff0000", emoji: "💀" },
    hero:    { nome: "Herói Lendário",  cor: "#ffd700", corBrilho: "#ff0000", emoji: "⚔️", lendario: true }
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
const coinCountElement = document.getElementById("coinCount");


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
// VARIÁVEIS DE ESTADO
// ==========================================

let score = 0;
let lives = 3;
let level = 1;
let moedas = Number(localStorage.getItem("quantumRunCoins")) || 0;
let moedasGanhasNaPartida = 0;

let enemies = [];
let energies = [];
let hearts = [];
let particles = [];

let gameRunning = false;

let enemyTimer = 0;
let energyTimer = 0;
let heartTimer = 0;
let scoreTimer = 0;
let gameTime = 0;

let lastTime = 0;

let velocidadeAtual = 1;
let intervaloAtual = 100;

let highScore = Number(localStorage.getItem("quantumRunHighScore")) || 0;

// Skins equipadas
let skinJogadorAtual = localStorage.getItem("quantumRunSkinJogador") || "default";
let skinInimigoAtual = localStorage.getItem("quantumRunSkinInimigo") || "default";

// Skins compradas
let skinsCompradasJogador = JSON.parse(localStorage.getItem("quantumRunSkinsJogador")) || ["default"];
let skinsCompradasInimigo = JSON.parse(localStorage.getItem("quantumRunSkinsInimigo")) || ["default"];


// ==========================================
// TOASTS (AVISOS)
// ==========================================

function criarToastContainer() {
    if (!document.getElementById("toastContainer")) {
        const div = document.createElement("div");
        div.id = "toastContainer";
        document.body.appendChild(div);
    }
}

function mostrarToast(mensagem, tipo = "") {
    criarToastContainer();
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast " + tipo;
    toast.textContent = mensagem;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.4s ease forwards";
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}


// ==========================================
// TECLADO
// ==========================================

const keys = {};

document.addEventListener("keydown", function (event) {
    keys[event.key.toLowerCase()] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function (event) {
    keys[event.key.toLowerCase()] = false;
});


// ==========================================
// NAVEGAÇÃO
// ==========================================

function irParaJogo() {
    document.getElementById("jogo").scrollIntoView({ behavior: "smooth" });
}


// ==========================================
// TAMANHO DO CANVAS
// ==========================================

function ajustarCanvas() {
    const largura = canvas.parentElement.clientWidth;
    canvas.width = Math.min(largura - 20, 900);
    canvas.height = 500;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
}

window.addEventListener("resize", function () {
    if (gameRunning) ajustarCanvas();
});


// ==========================================
// ESCOLHER NÍVEL
// ==========================================

function selecionarNivel(nivelEscolhido) {
    level = nivelEscolhido;
    levelMenu.style.display = "none";
    gameArea.style.display = "block";
    ajustarCanvas();
    iniciarJogo();

    gameArea.scrollIntoView({ behavior: "smooth", block: "center" });
}


// ==========================================
// INICIAR JOGO
// ==========================================

function iniciarJogo() {
    score = 0;
    moedasGanhasNaPartida = 0;
    lives = 3;

    enemies = [];
    energies = [];
    hearts = [];
    particles = [];

    enemyTimer = 0;
    energyTimer = 0;
    heartTimer = 0;
    scoreTimer = 0;
    gameTime = 0;

    velocidadeAtual = niveis[level].velocidadeInicial;
    intervaloAtual = niveis[level].intervaloInimigo;

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
    hearts = [];
    particles = [];

    limparTela();
    document.getElementById("jogo").scrollIntoView({ behavior: "smooth" });
}


// ==========================================
// MOVIMENTO DO JOGADOR
// ==========================================

function moverJogador() {
    if (keys["w"] || keys["arrowup"])    player.y -= player.speed;
    if (keys["s"] || keys["arrowdown"])  player.y += player.speed;
    if (keys["a"] || keys["arrowleft"])  player.x -= player.speed;
    if (keys["d"] || keys["arrowright"]) player.x += player.speed;

    if (player.x < player.size) player.x = player.size;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (player.y < player.size) player.y = player.size;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}


// ==========================================
// CRIAR INIMIGO
// ==========================================

function criarInimigo() {
    const lado = Math.floor(Math.random() * 4);
    let x, y;

    if (lado === 0) { x = Math.random() * canvas.width; y = -30; }
    if (lado === 1) { x = canvas.width + 30; y = Math.random() * canvas.height; }
    if (lado === 2) { x = Math.random() * canvas.width; y = canvas.height + 30; }
    if (lado === 3) { x = -30; y = Math.random() * canvas.height; }

    enemies.push({
        x: x,
        y: y,
        size: 15,
        speed: velocidadeAtual + Math.random() * 0.5,
        rotation: 0
    });
}


// ==========================================
// CRIAR ENERGIA
// ==========================================

function criarEnergia() {
    energies.push({
        x: 30 + Math.random() * (canvas.width - 60),
        y: 30 + Math.random() * (canvas.height - 60),
        size: 10,
        pulse: 0
    });
}


// ==========================================
// CRIAR CORAÇÃO (máx 1 por vez)
// ==========================================

function criarCoracao() {
    if (hearts.length >= 1) return;

    hearts.push({
        x: 40 + Math.random() * (canvas.width - 80),
        y: 40 + Math.random() * (canvas.height - 80),
        size: 14,
        pulse: 0,
        life: 1
    });
}


// ==========================================
// PARTÍCULAS
// ==========================================

function criarParticulas(x, y, quantidade = 20, cor = "#00ffff") {
    for (let i = 0; i < quantidade; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7,
            size: Math.random() * 4 + 1,
            life: 1,
            cor: cor
        });
    }
}

function atualizarParticulas() {
    particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        p.size *= 0.97;
    });

    particles = particles.filter(p => p.life > 0);
}


// ==========================================
// MOVER INIMIGOS
// ==========================================

function moverInimigos() {
    enemies.forEach(function (enemy) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia > 0) {
            enemy.x += (dx / distancia) * enemy.speed;
            enemy.y += (dy / distancia) * enemy.speed;
        }

        enemy.rotation += 0.05;
    });
}


// ==========================================
// COLISÕES
// ==========================================

function detectarColisoes() {

    // ---------- INIMIGOS ----------
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < player.size + enemy.size) {
            criarParticulas(enemy.x, enemy.y, 30, "#ff1744");
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
    for (let i = energies.length - 1; i >= 0; i--) {
        const energy = energies[i];
        const dx = player.x - energy.x;
        const dy = player.y - energy.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < player.size + energy.size) {
            criarParticulas(energy.x, energy.y, 25, "#ffe600");
            energies.splice(i, 1);
            score += 10;
            verificarMoedas();
            atualizarInterface();
        }
    }

    // ---------- CORAÇÃO ----------
    for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        const dx = player.x - heart.x;
        const dy = player.y - heart.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < player.size + heart.size) {
            criarParticulas(heart.x, heart.y, 30, "#ff0066");
            hearts.splice(i, 1);

            if (lives < 5) {
                lives++;
                mostrarToast("❤️ +1 Vida!", "success");
            } else {
                mostrarToast("❤️ Vida máxima!", "gold");
            }

            atualizarInterface();
        }
    }
}


// ==========================================
// SISTEMA DE MOEDAS
// ==========================================

function verificarMoedas() {
    // A cada 25 pontos = 1 moeda (controle por marcos)
    const marcoAtual = Math.floor(score / 25);
    const marcoAnterior = Math.floor((score - 10) / 25);

    if (marcoAtual > marcoAnterior) {
        moedas++;
        moedasGanhasNaPartida++;
        localStorage.setItem("quantumRunCoins", moedas);
        coinCountElement.textContent = moedas;
        mostrarToast("🪙 +1 Moeda!", "gold");
    }
}


// ==========================================
// INTERFACE
// ==========================================

function atualizarInterface() {
    scoreElement.textContent = score;
    livesElement.textContent = "❤️".repeat(Math.max(0, lives));
    levelElement.textContent = niveis[level].nome;
    highScoreElement.textContent = highScore;
    coinCountElement.textContent = moedas;
}


// ==========================================
// FUNDO
// ==========================================

function desenharFundo() {
    ctx.fillStyle = "#050816";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0,255,255,0.08)";
    ctx.lineWidth = 1;
    const tamanho = 40;

    for (let x = 0; x < canvas.width; x += tamanho) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += tamanho) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}


// ==========================================
// DESENHAR JOGADOR (com skin)
// ==========================================

function desenharJogador() {
    const skin = skinsJogador[skinJogadorAtual] || skinsJogador.default;

    ctx.save();

    // Se for dragão, desenhar emoji gigante
    if (skin.emoji) {
        ctx.shadowBlur = 35;
        ctx.shadowColor = skin.corBrilho;
        ctx.font = (player.size * 2.4) + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skin.emoji, player.x, player.y + 2);
        ctx.restore();
        return;
    }

    // Brilho
    ctx.shadowBlur = 30;
    ctx.shadowColor = skin.corBrilho;
    ctx.fillStyle = skin.cor;

    // Triângulo
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.size);
    ctx.lineTo(player.x - player.size, player.y + player.size);
    ctx.lineTo(player.x + player.size, player.y + player.size);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Acessório (emoji)
    if (skin.acessorio) {
        ctx.save();
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skin.acessorio, player.x, player.y - player.size - 8);
        ctx.restore();
    }
}


// ==========================================
// DESENHAR INIMIGOS (com skin)
// ==========================================

function desenharInimigos() {
    const skin = skinsInimigo[skinInimigoAtual] || skinsInimigo.default;

    enemies.forEach(function (enemy) {
        ctx.save();

        if (skin.emoji) {
            // Emoji rotacionando
            ctx.translate(enemy.x, enemy.y);
            ctx.rotate(enemy.rotation);
            ctx.shadowBlur = 25;
            ctx.shadowColor = skin.corBrilho;
            ctx.font = (enemy.size * 2.2) + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(skin.emoji, 0, 0);
        } else {
            ctx.shadowBlur = 25;
            ctx.shadowColor = skin.corBrilho;
            ctx.fillStyle = skin.cor;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    });
}


// ==========================================
// DESENHAR ENERGIA
// ==========================================

function desenharEnergias() {
    energies.forEach(function (energy) {
        energy.pulse += 0.1;
        const tamanho = energy.size + Math.sin(energy.pulse) * 3;

        ctx.save();
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#ffe600";
        ctx.fillStyle = "#ffe600";
        ctx.beginPath();
        ctx.arc(energy.x, energy.y, tamanho, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}


// ==========================================
// DESENHAR CORAÇÕES
// ==========================================

function desenharCoracoes() {
    hearts.forEach(function (heart) {
        heart.pulse += 0.08;
        heart.life -= 0.0006;

        if (heart.life <= 0) {
            heart.life = 0;
        }

        const tamanho = heart.size + Math.sin(heart.pulse) * 3;

        ctx.save();
        ctx.globalAlpha = 0.4 + heart.life * 0.6;

        ctx.shadowBlur = 25;
        ctx.shadowColor = "#ff0066";
        ctx.fillStyle = "#ff0066";

        // Desenha ❤️ usando emoji
        ctx.font = (tamanho * 2.2) + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❤️", heart.x, heart.y);

        ctx.restore();
    });

    // Remove corações expirados
    hearts = hearts.filter(h => h.life > 0);
}


// ==========================================
// DESENHAR PARTÍCULAS
// ==========================================

function desenharParticulas() {
    particles.forEach(function (p) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.cor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.cor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}


// ==========================================
// HUD NO CANVAS
// ==========================================

function desenharHUD() {
    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";

    ctx.fillText("NÍVEL: " + niveis[level].nome, 20, 30);
    ctx.fillText("VEL: " + velocidadeAtual.toFixed(2), 20, 55);

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
        localStorage.setItem("quantumRunHighScore", highScore);
    }

    atualizarInterface();
    desenharTelaGameOver(novoRecorde);
}


// ==========================================
// TELA DE GAME OVER (NEON)
// ==========================================

function desenharTelaGameOver(novoRecorde) {

    // Overlay escuro
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Linha neon no topo
    ctx.save();
    ctx.strokeStyle = "#ff1744";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ff1744";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 - 130);
    ctx.lineTo(canvas.width, canvas.height / 2 - 130);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + 150);
    ctx.lineTo(canvas.width, canvas.height / 2 + 150);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Título GAME OVER com efeito neon
    ctx.shadowBlur = 40;
    ctx.shadowColor = "#ff1744";
    ctx.fillStyle = "#ff1744";
    ctx.font = "bold 60px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 90);

    // Sombra interna ciano
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ff6699";
    ctx.font = "bold 59px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 90);

    // Pontuação
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Pontuação: " + score, canvas.width / 2, canvas.height / 2 - 20);

    // Recorde
    ctx.fillText("Recorde: " + highScore, canvas.width / 2, canvas.height / 2 + 20);

    // Moedas ganhas na partida
    ctx.shadowColor = "#ffd700";
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 22px Arial";
    ctx.fillText("🪙 Moedas ganhas: " + moedasGanhasNaPartida, canvas.width / 2, canvas.height / 2 + 60);

    // Novo recorde
    if (novoRecorde) {
        ctx.shadowColor = "#ffe600";
        ctx.shadowBlur = 25;
        ctx.fillStyle = "#ffe600";
        ctx.font = "bold 22px Arial";
        ctx.fillText("🏆 NOVO RECORDE!", canvas.width / 2, canvas.height / 2 + 100);
    }

    // Instrução
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText("Clique em REINICIAR para jogar novamente", canvas.width / 2, canvas.height / 2 + 140);

    ctx.restore();
}


// ==========================================
// LIMPAR TELA
// ==========================================

function limparTela() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// ==========================================
// LOOP PRINCIPAL
// ==========================================

function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    gameTime += deltaTime;

    // Aumentar dificuldade com o tempo
    if (velocidadeAtual < niveis[level].velocidadeMaxima) {
        velocidadeAtual += niveis[level].aceleracao * deltaTime;

        if (velocidadeAtual > niveis[level].velocidadeMaxima) {
            velocidadeAtual = niveis[level].velocidadeMaxima;
        }
    }

    // Reduzir intervalo de inimigos progressivamente
    const progresso = Math.min(1, gameTime / 90000); // 90s até o mínimo
    intervaloAtual = Math.round(
        niveis[level].intervaloInimigo -
        (niveis[level].intervaloInimigo - niveis[level].intervaloInimigoMin) * progresso
    );

    // Movimento
    moverJogador();

    // Spawn inimigos
    enemyTimer++;
    if (enemyTimer >= intervaloAtual) {
        criarInimigo();
        enemyTimer = 0;
    }

    // Spawn energia
    energyTimer++;
    if (energyTimer >= 100) {
        criarEnergia();
        energyTimer = 0;
    }

    // Spawn coração a cada ~8 segundos (aprox. 480 frames a 60fps)
    heartTimer++;
    if (heartTimer >= 480) {
        criarCoracao();
        heartTimer = 0;
    }

    // Pontuação por tempo (a cada 1s = +1 ponto)
    scoreTimer += deltaTime;
    if (scoreTimer >= 1000) {
        score++;
        verificarMoedas();
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
    desenharCoracoes();
    desenharInimigos();
    desenharParticulas();
    desenharJogador();
    desenharHUD();

    requestAnimationFrame(gameLoop);
}


// ==========================================
// LOJA — ABAS
// ==========================================

function mostrarAba(tipo) {
    const tabs = document.querySelectorAll(".skin-tab");
    tabs.forEach(t => t.classList.remove("active"));

    if (tipo === "jogador") {
        document.getElementById("skinsJogador").style.display = "grid";
        document.getElementById("skinsInimigo").style.display = "none";
        tabs[0].classList.add("active");
    } else {
        document.getElementById("skinsJogador").style.display = "none";
        document.getElementById("skinsInimigo").style.display = "grid";
        tabs[1].classList.add("active");
    }
}


// ==========================================
// LOJA — COMPRAR / USAR
// ==========================================

function comprarOuUsar(tipo, skin, preco) {
    let compradas = tipo === "jogador" ? skinsCompradasJogador : skinsCompradasInimigo;
    let equipada = tipo === "jogador" ? skinJogadorAtual : skinInimigoAtual;

    // Já possui: equipar
    if (compradas.includes(skin)) {
        if (tipo === "jogador") {
            skinJogadorAtual = skin;
            localStorage.setItem("quantumRunSkinJogador", skin);
        } else {
            skinInimigoAtual = skin;
            localStorage.setItem("quantumRunSkinInimigo", skin);
        }
        mostrarToast("✅ Skin equipada!", "success");
        atualizarLoja();
        return;
    }

    // Comprar
    if (moedas < preco) {
        mostrarToast("❌ Moedas insuficientes!", "error");
        return;
    }

    moedas -= preco;
    compradas.push(skin);

    if (tipo === "jogador") {
        skinsCompradasJogador = compradas;
        skinJogadorAtual = skin;
        localStorage.setItem("quantumRunSkinsJogador", JSON.stringify(compradas));
        localStorage.setItem("quantumRunSkinJogador", skin);
    } else {
        skinsCompradasInimigo = compradas;
        skinInimigoAtual = skin;
        localStorage.setItem("quantumRunSkinsInimigo", JSON.stringify(compradas));
        localStorage.setItem("quantumRunSkinInimigo", skin);
    }

    localStorage.setItem("quantumRunCoins", moedas);
    coinCountElement.textContent = moedas;

    mostrarToast("🎉 Skin comprada e equipada!", "success");
    atualizarLoja();
}


// ==========================================
// ATUALIZAR ESTADO DA LOJA
// ==========================================

function atualizarLoja() {
    // Jogador
    document.querySelectorAll("#skinsJogador .skin-card").forEach(card => {
        const skin = card.dataset.skin;
        const btn = card.querySelector(".skin-btn");
        const comprada = skinsCompradasJogador.includes(skin);
        const equipada = skinJogadorAtual === skin;

        btn.classList.remove("owned", "equipped", "legendary-btn");
        const isLegendary = card.classList.contains("legendary");
        if (isLegendary) btn.classList.add("legendary-btn");

        if (equipada) {
            btn.textContent = "EQUIPADA";
            btn.classList.add("equipped");
        } else if (comprada) {
            btn.textContent = "USAR";
            btn.classList.add("owned");
        } else {
            btn.textContent = "COMPRAR";
        }
    });

    // Inimigo
    document.querySelectorAll("#skinsInimigo .skin-card").forEach(card => {
        const skin = card.dataset.skin;
        const btn = card.querySelector(".skin-btn");
        const comprada = skinsCompradasInimigo.includes(skin);
        const equipada = skinInimigoAtual === skin;

        btn.classList.remove("owned", "equipped", "legendary-btn");
        const isLegendary = card.classList.contains("legendary");
        if (isLegendary) btn.classList.add("legendary-btn");

        if (equipada) {
            btn.textContent = "EQUIPADA";
            btn.classList.add("equipped");
        } else if (comprada) {
            btn.textContent = "USAR";
            btn.classList.add("owned");
        } else {
            btn.textContent = "COMPRAR";
        }
    });

    coinCountElement.textContent = moedas;
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

ajustarCanvas();
atualizarInterface();
atualizarLoja();
criarToastContainer();