const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const terrain = new Image();
terrain.src = 'img/terrain.png';

const swish = new Audio("sons/swish.mp3");
const chaussures = new Audio("sons/chaussures.mp3");
chaussures.volume = 0.2;

const joueurHauteur = 40;
const joueurLargeur = 20;
const ballonRayon   = 10;

// Constantes physique en px/s
const VITESSE_JOUEUR = 300;
const SAUT_INITIAL   = -600;
const GRAVITE        = 1800;
const CHARGE_VITESSE = 12;
const CHARGE_MAX     = 15;

let score      = 0;
let charge     = 0;
let chargement = false;
let touches    = {};
let aLeBallon  = true;
let dernierPas = 0;

// Initialisées dans DOMContentLoaded (dépendent de canvas.height)
let solY, joueur, ballon, hoop;

window.addEventListener('DOMContentLoaded', () => {
    solY = canvas.height;

    joueur = {
        pseudo:  localStorage.getItem("playerName")  || "Anonyme",
        couleur: localStorage.getItem("playerColor") || "blue",
        x:       100,
        y:       solY - joueurHauteur,
        largeur: joueurLargeur,
        hauteur: joueurHauteur,
        vx: 0, vy: 0, saut: false
    };

    ballon = {
        x: joueur.x + joueur.largeur + 5,
        y: joueur.y + 10,
        vx: 0, vy: 0,
        rayon: ballonRayon,
        dansLAir: false, scored: false,
        couleur: 'orange'
    };

    hoop = { x: 750, y: 250 };

    fetch('php/scores.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=join&pseudo=${encodeURIComponent(joueur.pseudo)}`
    });

    loadScores();
    setInterval(loadScores, 2000);
    loadMessages();
    setInterval(loadMessages, 2000);

    requestAnimationFrame(gameLoop);

    canvas.focus();
    canvas.addEventListener('click', () => canvas.focus());

    canvas.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
    }
});

    // Quand on clique n'importe où sauf le chat, on redonne le focus au canvas
    document.addEventListener('click', (e) => {
        if (e.target.id !== 'chat-input') canvas.focus();
    });
});

window.addEventListener('beforeunload', () => {
    if (!joueur) return;
    navigator.sendBeacon('php/scores.php', new URLSearchParams({
        action: 'leave', pseudo: joueur.pseudo
    }));
});

function loadScores() {
    fetch('json/scores.json').then(r => r.json()).then(players => {
        const board = document.getElementById('leaderboard');
        board.innerHTML = '<h3>Joueurs</h3>';
        players.sort((a, b) => b.score - a.score);
        players.forEach(p => {
            const line = document.createElement('div');
            line.textContent = `${p.pseudo} : ${p.score}`;
            board.appendChild(line);
        });
    });
}

document.getElementById('chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

function sendMessage() {
    const input  = document.getElementById('chat-input');
    const msg    = input.value.trim();
    const pseudo = joueur ? joueur.pseudo : 'Anonyme';
    if (!msg || msg.length > 100) return;
    fetch('php/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `pseudo=${encodeURIComponent(pseudo)}&message=${encodeURIComponent(msg)}`
    }).then(() => { input.value = ''; loadMessages(); });
}

function loadMessages() {
    fetch('json/chat.json').then(r => r.json()).then(messages => {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        messages.forEach(entry => {
            const div = document.createElement('div');
            div.textContent = `${entry.time ? '['+entry.time+'] ' : ''}${entry.pseudo || 'Anonyme'} : ${entry.message || ''}`;
            container.appendChild(div);
        });
        container.scrollTop = container.scrollHeight;
    });
}

document.addEventListener('keydown', (e) => {
    if (document.activeElement.id === 'chat-input') return;
canvas.focus();
    touches[e.key] = true;
    if (e.key === 'ArrowUp' && joueur && !joueur.saut) {
        joueur.vy = SAUT_INITIAL;
        joueur.saut = true;
    }
    if (e.key === ' ' && aLeBallon) chargement = true;
});

document.addEventListener('keyup', (e) => {
    touches[e.key] = false;
    if (e.key === ' ' && chargement && aLeBallon) { shootBall(); chargement = false; }
});

function shootBall() {
    ballon.dansLAir = true;
    aLeBallon       = false;
    const angle = Math.PI / 3.2;
    const force = charge * 130;
    ballon.vx = force * Math.cos(angle);
    ballon.vy = -force * Math.sin(angle);
    charge    = 0;
}

function handleCollisionRect(b, rect) {
    const cx = Math.max(rect.x, Math.min(b.x, rect.x + rect.w));
    const cy = Math.max(rect.y, Math.min(b.y, rect.y + rect.h));
    const dx = b.x - cx, dy = b.y - cy;
    if (dx*dx + dy*dy < b.rayon*b.rayon) {
        if (Math.abs(dx) > Math.abs(dy)) {
            b.vx *= -0.7;
            b.x   = dx > 0 ? rect.x + rect.w + b.rayon : rect.x - b.rayon;
        } else {
            b.vy *= -0.7;
            b.y   = dy > 0 ? rect.y + rect.h + b.rayon : rect.y - b.rayon;
        }
    }
}

function update(dt) {
    joueur.vx = 0;
    const now = Date.now();
    if ((touches['ArrowLeft'] || touches['ArrowRight']) && now - dernierPas > 1500) {
        chaussures.currentTime = 0; chaussures.play(); dernierPas = now;
    }
    if (touches['ArrowLeft'])  joueur.vx = -VITESSE_JOUEUR;
    if (touches['ArrowRight']) joueur.vx =  VITESSE_JOUEUR;

    joueur.x += joueur.vx * dt;
    if (joueur.x < 0) joueur.x = 0;
    if (joueur.x + joueur.largeur > canvas.width) joueur.x = canvas.width - joueur.largeur;

    joueur.vy += GRAVITE * dt;
    joueur.y  += joueur.vy * dt;
    if (joueur.y >= solY - joueur.hauteur) {
        joueur.y = solY - joueur.hauteur; joueur.vy = 0; joueur.saut = false;
    }

    if (chargement && charge < CHARGE_MAX) charge += CHARGE_VITESSE * dt;

    if (!ballon.dansLAir && aLeBallon) {
        ballon.x = joueur.x + joueur.largeur + 5;
        ballon.y = joueur.y + 10;
    }

    if (ballon.dansLAir) {
        ballon.vy += GRAVITE * dt;
        ballon.x  += ballon.vx * dt;
        ballon.y  += ballon.vy * dt;

        if (ballon.y + ballon.rayon >= solY) {
            ballon.y = solY - ballon.rayon; ballon.vy *= -0.6; ballon.vx *= 0.985;
        }
        if (ballon.x - ballon.rayon <= 0 || ballon.x + ballon.rayon >= canvas.width) {
            ballon.vx *= -0.8;
            ballon.x = Math.max(ballon.rayon, Math.min(ballon.x, canvas.width - ballon.rayon));
        }

        if (!ballon.scored && ballon.vy > 0 &&
            ballon.x > hoop.x - 40 && ballon.x < hoop.x + 40 &&
            ballon.y - ballon.vy * dt < hoop.y && ballon.y >= hoop.y) {
            swish.play();
            ballon.scored = true;
            score++;
            fetch('php/scores.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=score&pseudo=${encodeURIComponent(joueur.pseudo)}&score=${score}`
            });
            setTimeout(() => { ballon.scored = false; }, 1000);
        }

        if (Math.abs(ballon.vx) < 5 && Math.abs(ballon.vy) < 5 && ballon.y + ballon.rayon >= solY) {
            ballon.dansLAir = false; ballon.vx = ballon.vy = 0;
        }

        const partiesPanier = [
            { x: hoop.x - 50, y: hoop.y - 40, w: 20, h: 60 },
            { x: hoop.x + 30, y: hoop.y - 40, w: 20, h: 60 }
        ];
        for (const part of partiesPanier) handleCollisionRect(ballon, part);
    }

    const distX = Math.abs(joueur.x + joueur.largeur / 2 - ballon.x);
    const distY = Math.abs((joueur.y + joueur.hauteur) - ballon.y);
    if (!aLeBallon && distX < 30 && distY < 30) {
        aLeBallon = true; ballon.dansLAir = false; ballon.vx = ballon.vy = 0;
    }
}

function drawJoueur() {
    ctx.fillStyle = joueur.couleur;
    ctx.fillRect(joueur.x, joueur.y, joueur.largeur, joueur.hauteur);
    ctx.lineWidth = 1; ctx.strokeStyle = 'black';
    ctx.strokeRect(joueur.x, joueur.y, joueur.largeur, joueur.hauteur);

    ctx.beginPath();
    ctx.arc(joueur.x + joueur.largeur / 2, joueur.y - 10, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = 'black'; ctx.stroke();

    ctx.font = "14px Arial"; ctx.fillStyle = "white"; ctx.textAlign = "center";
    ctx.fillText(joueur.pseudo, joueur.x + joueur.largeur / 2, joueur.y - 35);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballon.x, ballon.y, ballon.rayon, 0, Math.PI * 2);
    ctx.fillStyle = ballon.couleur; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = 'black'; ctx.stroke();
}

function drawFilet() {
    const x = hoop.x - 30, y = hoop.y - 17, w = 60, h = 55, g = 6;
    ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = 'white'; ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += g) { ctx.beginPath(); ctx.moveTo(x+i, y); ctx.lineTo(x+i, y+h); ctx.stroke(); }
    for (let j = 0; j <= h; j += g) { ctx.beginPath(); ctx.moveTo(x, y+j); ctx.lineTo(x+w, y+j); ctx.stroke(); }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(terrain, 0, 0, canvas.width, canvas.height);

    drawJoueur(); drawBall();

    ctx.font = "14px Arial"; ctx.fillStyle = 'white'; ctx.textAlign = 'left';
    ctx.fillText("Score : " + score, 50, 60);
    ctx.fillStyle = 'red';   ctx.fillRect(20, 20, charge * 10, 10);
    ctx.strokeStyle = 'white'; ctx.strokeRect(20, 20, 150, 10);

    ctx.fillStyle = "gray";
    ctx.fillRect(hoop.x - 50, hoop.y - 20, 20, 60);
    ctx.fillRect(hoop.x + 30, hoop.y - 20, 20, 60);
    ctx.fillStyle = "red";
    ctx.fillRect(hoop.x - 50, hoop.y - 20, 20, 20);
    ctx.fillRect(hoop.x + 30, hoop.y - 20, 20, 20);

    ctx.beginPath(); ctx.moveTo(hoop.x-50,hoop.y-20); ctx.lineTo(hoop.x-50,hoop.y-40); ctx.lineTo(hoop.x-30,hoop.y-20); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hoop.x+50,hoop.y-20); ctx.lineTo(hoop.x+50,hoop.y-40); ctx.lineTo(hoop.x+30,hoop.y-20); ctx.closePath(); ctx.fill();

    drawFilet();
}

let dernierTimestamp = null;
function gameLoop(timestamp) {
    if (!joueur) return;
    if (!dernierTimestamp) dernierTimestamp = timestamp;
    const dt = Math.min((timestamp - dernierTimestamp) / 1000, 0.05);
    dernierTimestamp = timestamp;
    update(dt); draw();
    requestAnimationFrame(gameLoop);
}