const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let cells = [];
let boardState = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameActive = true;
let winningPattern = null;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create board
function createBoard() {
  board.innerHTML = "";
  cells = [];
  winningPattern = null;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

// Handle player move
function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || boardState[index] !== "") return;

  makeMove(index, human);

  if (!gameActive) return;

  setTimeout(() => {
    const bestMove = minimax(boardState, ai).index;
    makeMove(bestMove, ai);
  }, 300);
}

// Apply move
function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = player === human
      ? "🎉 Sen yutding!"
      : "🤖 Kompyuter yutdi!";
    gameActive = false;
    drawWinningLine();
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "🤝 Durrang!";
    gameActive = false;
  }
}

// Check winner and store pattern
function checkWinner(player) {
  for (let pattern of winPatterns) {
    if (pattern.every(i => boardState[i] === player)) {
      winningPattern = pattern;
      return true;
    }
  }
  return false;
}

// Draw winning line
function drawWinningLine() {
  if (!winningPattern) return;

  const line = document.createElement("div");
  line.classList.add("win-line");

  const [a, , c] = winningPattern;

  const cellA = cells[a].getBoundingClientRect();
  const cellC = cells[c].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = cellA.left + cellA.width / 2 - boardRect.left;
  const y1 = cellA.top + cellA.height / 2 - boardRect.top;
  const x2 = cellC.left + cellC.width / 2 - boardRect.left;
  const y2 = cellC.top + cellC.height / 2 - boardRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = length + "px";
  line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;

  board.appendChild(line);
}

// Minimax AI
function minimax(newBoard, player) {
  const empty = newBoard
    .map((val, i) => val === "" ? i : null)
    .filter(v => v !== null);

  if (checkWinner(human)) return { score: -10 };
  if (checkWinner(ai)) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < empty.length; i++) {
    let move = {};
    move.index = empty[i];
    newBoard[empty[i]] = player;

    if (player === ai) {
      let result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[empty[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

// Restart game
restartBtn.addEventListener("click", () => {
  boardState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  winningPattern = null;
  statusText.textContent = "Sening navbating (X)";
  createBoard();
});

// Init
createBoard();
statusText.textContent = "Sening navbating (X)";
