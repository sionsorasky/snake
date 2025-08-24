let gridSize = 16;
let fruitCount = 1;
let snake = [];
let fruits = [];
let direction = 'right';
let score = 0;
let gameInterval;

const gameEl = document.getElementById('game');
const scoreEl = document.getElementById('score');

document.getElementById('startBtn').addEventListener('click', startGame);
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowUp' && direction !== 'down') direction='up';
  if(e.key === 'ArrowDown' && direction !== 'up') direction='down';
  if(e.key === 'ArrowLeft' && direction !== 'right') direction='left';
  if(e.key === 'ArrowRight' && direction !== 'left') direction='right';
});

function startGame() {
  clearInterval(gameInterval);
  gridSize = parseInt(document.getElementById('gridSize').value);
  fruitCount = parseInt(document.getElementById('fruitCount').value);
  snake = [{x: Math.floor(gridSize/2), y: Math.floor(gridSize/2)}];
  fruits = [];
  score = 0;
  scoreEl.textContent = 'スコア: 0';
  direction='right';
  gameEl.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  gameEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  spawnFruits();
  draw();
  gameInterval = setInterval(gameLoop, 200);
}

function spawnFruits() {
  while(fruits.length < fruitCount) {
    let fx = Math.floor(Math.random()*gridSize);
    let fy = Math.floor(Math.random()*gridSize);
    if(!snake.some(s=>s.x===fx && s.y===fy) && !fruits.some(f=>f.x===fx && f.y===fy)) {
      fruits.push({x:fx, y:fy});
    }
  }
}

function gameLoop() {
  const head = {...snake[0]};
  if(direction==='up') head.y--;
  if(direction==='down') head.y++;
  if(direction==='left') head.x--;
  if(direction==='right') head.x++;
  
  // 壁に当たったらゲームオーバー
  if(head.x<0||head.x>=gridSize||head.y<0||head.y>=gridSize||snake.some(s=>s.x===head.x && s.y===head.y)) {
    alert('ゲームオーバー！スコア:'+score);
    document.cookie = `highscore=${score}; max-age=31536000`;
    clearInterval(gameInterval);
    return;
  }

  snake.unshift(head);

  // 果物を食べたか
  const fruitIndex = fruits.findIndex(f=>f.x===head.x && f.y===head.y);
  if(fruitIndex!==-1) {
    fruits.splice(fruitIndex,1);
    score++;
    scoreEl.textContent = 'スコア: '+score;
    spawnFruits();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  gameEl.innerHTML = '';
  for(let y=0; y<gridSize; y++) {
    for(let x=0; x<gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if(snake.some(s=>s.x===x && s.y===y)) cell.classList.add('snake');
      if(fruits.some(f=>f.x===x && f.y===y)) cell.classList.add('fruit');
      gameEl.appendChild(cell);
    }
  }
}