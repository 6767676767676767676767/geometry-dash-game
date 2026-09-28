const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const progressElement = document.getElementById('progress');
const modeElement = document.getElementById('modeName');
const levelElement = document.getElementById('levelName');

let width, height, groundY;
let animationId;
let lastTime = 0;

const MODES = {
  CUBE: 'cube',
  BALL: 'ball',
  SHIP: 'ship',
  WAVE: 'wave',
  ROBOT: 'robot'
};

const LEVEL_DATA = [
  {
    name: 'Stereo Madness',
    difficulty: 'Easy',
    mode: MODES.CUBE,
    obstacles: [
      { type: 'spike', x: 400, size: 40 },
      { type: 'gap', x: 600, width: 80 },
      { type: 'spike', x: 800, size: 40 },
      { type: 'platform', x: 1000, width: 100, height: 40 },
      { type: 'spike', x: 1200, size: 40 },
      { type: 'gap', x: 1400, width: 120 },
      { type: 'spike', x: 1700, size: 50 },
      { type: 'spike', x: 1900, size: 40 },
      { type: 'gap', x: 2100, width: 100 }
    ],
    coins: [
      { x: 450, y: 200 },
      { x: 700, y: 250 },
      { x: 1100, y: 150 },
      { x: 1550, y: 220 },
      { x: 1800, y: 180 }
    ],
    length: 2200
  },
  {
    name: 'Back on Track',
    difficulty: 'Easy',
    mode: MODES.CUBE,
    obstacles: [
      { type: 'spike', x: 350, size: 40 },
      { type: 'spike', x: 550, size: 40 },
      { type: 'gap', x: 750, width: 100 },
      { type: 'spike', x: 1000, size: 50 },
      { type: 'platform', x: 1200, width: 80, height: 40 },
      { type: 'gap', x: 1400, width: 120 },
      { type: 'spike', x: 1700, size: 40 },
      { type: 'spike', x: 1850, size: 40 },
      { type: 'spike', x: 2000, size: 50 }
    ],
    coins: [
      { x: 400, y: 200 },
      { x: 850, y: 250 },
      { x: 1300, y: 180 },
      { x: 1750, y: 220 }
    ],
    length: 2150
  },
  {
    name: 'Polargeist',
    difficulty: 'Normal',
    mode: MODES.CUBE,
    obstacles: [
      { type: 'spike', x: 300, size: 40 },
      { type: 'gap', x: 500, width: 100 },
      { type: 'spike', x: 750, size: 40 },
      { type: 'spike', x: 900, size: 40 },
      { type: 'gap', x: 1100, width: 140 },
      { type: 'spike', x: 1400, size: 50 },
      { type: 'platform', x: 1600, width: 120, height: 40 },
      { type: 'gap', x: 1800, width: 150 },
      { type: 'spike', x: 2100, size: 40 },
      { type: 'spike', x: 2250, size: 50 }
    ],
    coins: [
      { x: 350, y: 200 },
      { x: 650, y: 250 },
      { x: 1200, y: 180 },
      { x: 1700, y: 220 },
      { x: 2000, y: 150 }
    ],
    length: 2400
  },
  {
    name: 'Dry Out',
    difficulty: 'Hard',
    mode: MODES.BALL,
    obstacles: [
      { type: 'spike', x: 400, size: 40 },
      { type: 'gap', x: 600, width: 120 },
      { type: 'spike', x: 900, size: 40 },
      { type: 'spike', x: 1050, size: 40 },
      { type: 'gap', x: 1250, width: 140 },
      { type: 'spike', x: 1550, size: 50 },
      { type: 'platform', x: 1750, width: 100, height: 40 },
      { type: 'gap', x: 1950, width: 150 },
      { type: 'spike', x: 2250, size: 40 },
      { type: 'spike', x: 2400, size: 50 }
    ],
    coins: [
      { x: 450, y: 200 },
      { x: 800, y: 250 },
      { x: 1350, y: 180 },
      { x: 1850, y: 220 },
      { x: 2150, y: 150 }
    ],
    length: 2500
  },
  {
    name: 'Baseline',
    difficulty: 'Very Hard',
    mode: MODES.CUBE,
    obstacles: [
      { type: 'spike', x: 300, size: 40 },
      { type: 'gap', x: 500, width: 120 },
      { type: 'spike', x: 800, size: 40 },
      { type: 'spike', x: 950, size: 40 },
      { type: 'gap', x: 1150, width: 150 },
      { type: 'spike', x: 1500, size: 50 },
      { type: 'spike', x: 1700, size: 40 },
      { type: 'gap', x: 1900, width: 160 },
      { type: 'spike', x: 2250, size: 40 },
      { type: 'spike', x: 2400, size: 40 },
      { type: 'spike', x: 2550, size: 50 }
    ],
    coins: [
      { x: 350, y: 200 },
      { x: 700, y: 250 },
      { x: 1250, y: 180 },
      { x: 1800, y: 220 },
      { x: 2200, y: 150 },
      { x: 2500, y: 190 }
    ],
    length: 2700
  }
];

let currentLevel = 0;
let gameState = 'menu'; // menu, levelSelect, playing, gameOver
let gameOverStatus = null;

const player = {
  x: 100,
  y: 0,
  size: 34,
  velocityY: 0,
  velocityX: 0,
  gravity: 1900,
  jumpPower: 700,
  rotation: 0,
  grounded: false,
  mode: MODES.CUBE,
  radius: 17,
  speed: 360
};

let obstacles = [];
let coins = [];
let particles = [];
let score = 0;
let progress = 0;
let levelStartX = 0;
let levelEndX = 2200;
let collectedCoins = 0;

function resize() {
  const scale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  groundY = height - 100;

  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

window.addEventListener('resize', resize);
resize();

function jump() {
  if (gameState !== 'playing') return;
  if (player.grounded) {
    player.velocityY = -player.jumpPower;
    player.grounded = false;
    emitParticles(8);
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});

canvas.addEventListener('mousedown', jump);
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  jump();
}, { passive: false });

function emitParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: player.x + player.size / 2,
      y: player.y + player.size,
      vx: (Math.random() - 0.5) * 200,
      vy: -Math.random() * 150,
      life: 0.4,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
    });
  }
}

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  const level = LEVEL_DATA[levelIndex];

  player.mode = level.mode;
  player.x = 100;
  player.y = groundY - player.size;
  player.velocityY = 0;
  player.velocityX = 0;
  player.rotation = 0;
  player.grounded = true;
  player.speed = 360;

  obstacles = level.obstacles.map(o => ({
    ...o,
    passed: false
  }));

  coins = level.coins.map(c => ({
    ...c,
    collected: false
  }));

  levelStartX = 0;
  levelEndX = level.length;
  score = 0;
  progress = 0;
  collectedCoins = 0;

  levelElement.textContent = level.name;
  modeElement.textContent = level.mode.charAt(0).toUpperCase() + level.mode.slice(1);

  gameState = 'playing';
}

function update(delta) {
  if (gameState !== 'playing') return;

  // Auto-scroll player right
  player.speed += delta * 3;
  player.x += player.speed * delta;

  // Increase score based on time
  score += delta * 10;

  // Vertical movement
  player.velocityY += player.gravity * delta;
  player.y += player.velocityY * delta;

  if (player.y + player.size >= groundY) {
    player.y = groundY - player.size;
    player.velocityY = 0;
    player.grounded = true;
    player.rotation = 0;
  } else {
    player.grounded = false;
    player.rotation += delta * 7;
  }

  const level = LEVEL_DATA[currentLevel];

  // Check obstacle collisions
  for (const obstacle of obstacles) {
    if (checkCollision(obstacle)) {
      endLevel(false);
      return;
    }
  }

  // Check coin collections
  for (const coin of coins) {
    if (!coin.collected && checkCoinCollision(coin)) {
      coin.collected = true;
      collectedCoins++;
      score += 100;
      emitParticles(6);
    }
  }

  // Check progress
  progress = Math.min(100, (player.x / levelEndX) * 100);

  // Check if level completed
  if (player.x >= levelEndX) {
    endLevel(true);
    return;
  }

  // Update particles
  for (const particle of particles) {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 500 * delta;
    particle.life -= delta;
  }

  particles = particles.filter(p => p.life > 0);
}

function checkCollision(obstacle) {
  const padding = 6;
  const playerLeft = player.x + padding;
  const playerRight = player.x + player.size - padding;
  const playerTop = player.y + padding;
  const playerBottom = player.y + player.size - padding;

  if (obstacle.type === 'spike') {
    const spikeX = obstacle.x;
    const spikeSize = obstacle.size;
    const spikeY = groundY - spikeSize;

    return (
      playerRight > spikeX - 20 &&
      playerLeft < spikeX + spikeSize + 20 &&
      playerBottom > spikeY - 10 &&
      playerTop < groundY
    );
  }

  if (obstacle.type === 'gap') {
    const gapX = obstacle.x;
    const gapWidth = obstacle.width;
    const playerCenterX = player.x + player.size / 2;

    if (
      playerCenterX > gapX &&
      playerCenterX < gapX + gapWidth &&
      playerBottom >= groundY - 10
    ) {
      return true;
    }
  }

  return false;
}

function checkCoinCollision(coin) {
  const dx = player.x + player.size / 2 - coin.x;
  const dy = player.y + player.size / 2 - coin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 40;
}

function draw() {
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, width, height);

  if (gameState !== 'playing') return;

  const cameraX = Math.max(0, player.x - 200);

  ctx.save();
  ctx.translate(-cameraX, 0);

  drawBackground(cameraX);
  drawGround();
  drawObstacles();
  drawCoins();
  drawParticles();
  drawPlayer();

  ctx.restore();

  scoreElement.textContent = Math.floor(score);
  progressElement.textContent = Math.floor(progress) + '%';
}

function drawBackground(offset) {
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let x = Math.floor(offset / 50) * 50; x < offset + width + 50; x += 50) {
    for (let y = 0; y < groundY; y += 50) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
}

function drawGround() {
  ctx.fillStyle = '#171421';
  ctx.fillRect(-2000, groundY, 10000, height - groundY);

  ctx.fillStyle = '#00f5d4';
  ctx.fillRect(-2000, groundY, 10000, 5);

  ctx.strokeStyle = 'rgba(0,245,212,0.1)';
  ctx.lineWidth = 2;

  for (let x = -2000; x < 10000; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x - 100, height);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.size / 2, player.y + player.size / 2);
  ctx.rotate(player.rotation);

  ctx.shadowColor = '#ffe600';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#ffe600';

  if (player.mode === MODES.CUBE) {
    ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
  } else if (player.mode === MODES.BALL) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ff7b00';
  ctx.lineWidth = 3;
  if (player.mode === MODES.CUBE) {
    ctx.strokeRect(-player.size / 2, -player.size / 2, player.size, player.size);
  } else if (player.mode === MODES.BALL) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawObstacles() {
  for (const obstacle of obstacles) {
    if (obstacle.type === 'spike') {
      const size = obstacle.size;
      const x = obstacle.x;
      const y = groundY - size;

      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, groundY);
      ctx.closePath();

      ctx.fillStyle = '#ff3cac';
      ctx.shadowColor = '#ff3cac';
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffb3e1';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (obstacle.type === 'gap') {
      // Gaps are invisible but checked for collision
    } else if (obstacle.type === 'platform') {
      ctx.fillStyle = 'rgba(0, 245, 212, 0.3)';
      ctx.fillRect(obstacle.x, groundY - obstacle.height, obstacle.width, obstacle.height);
      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, groundY - obstacle.height, obstacle.width, obstacle.height);
    }
  }
}

function drawCoins() {
  for (const coin of coins) {
    if (coin.collected) continue;

    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.rotate(performance.now() / 500);

    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

function drawParticles() {
  for (const particle of particles) {
    ctx.globalAlpha = Math.max(0, particle.life / 0.4);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 5, 5);
  }
  ctx.globalAlpha = 1;
}

function endLevel(completed) {
  gameState = 'gameOver';
  const stars = calculateStars(completed);
  gameOverStatus = { completed, stars };
  showGameOver(completed, stars);
}

function calculateStars(completed) {
  if (!completed) return 0;
  const collectPercent = (collectedCoins / coins.length) * 100;
  if (collectPercent >= 80) return 3;
  if (collectPercent >= 50) return 2;
  return 1;
}

function showGameOver(completed, stars) {
  const modal = document.getElementById('gameOver');
  const title = document.getElementById('gameOverTitle');
  const scoreText = document.getElementById('gameOverScore');
  const percentText = document.getElementById('gameOverPercent');
  const starsDisplay = document.getElementById('starsDisplay');

  title.textContent = completed ? '🎉 Level Complete!' : '💀 Level Failed';
  scoreText.textContent = `Score: ${Math.floor(score)}`;
  percentText.textContent = `Progress: ${Math.floor(progress)}% | Coins: ${collectedCoins}/${coins.length}`;

  let starsHtml = '';
  for (let i = 0; i < 3; i++) {
    starsHtml += i < stars ? '★' : '☆';
  }
  starsDisplay.textContent = starsHtml;

  modal.classList.add('show');
}

function restartLevel() {
  document.getElementById('gameOver').classList.remove('show');
  loadLevel(currentLevel);
}

function startLevelSelect() {
  gameState = 'levelSelect';
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('levelSelect').classList.remove('hidden');
  document.getElementById('gameOver').classList.remove('show');

  const grid = document.getElementById('levelGrid');
  grid.innerHTML = '';

  LEVEL_DATA.forEach((level, index) => {
    const button = document.createElement('button');
    button.className = 'level-button';
    button.innerHTML = `
      <div>Level ${index + 1}</div>
      <div style="font-size: 14px; margin-top: 4px;">${level.name}</div>
      <div style="font-size: 12px; color: #00d4ff; margin-top: 4px;">${level.difficulty}</div>
      <span class="stars">☆☆☆</span>
    `;
    button.onclick = () => startLevel(index);
    grid.appendChild(button);
  });
}

function backToMenu() {
  gameState = 'menu';
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('levelSelect').classList.add('hidden');
  document.getElementById('gameOver').classList.remove('show');
}

function startLevel(index) {
  loadLevel(index);
  document.getElementById('levelSelect').classList.add('hidden');
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (gameState === 'playing') {
    update(delta);
  }
  draw();

  animationId = requestAnimationFrame(gameLoop);
}

lastTime = performance.now();
animationId = requestAnimationFrame(gameLoop);
