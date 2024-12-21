const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restart');
const switchModeButton = document.getElementById('switch-mode');
const statusText = document.getElementById('status');
let isXTurn = true;
let isPlayerVsAI = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

let board = Array(9).fill(null);

// Handle user click
function handleClick(event) {
  const cell = event.target;
  const currentClass = isXTurn ? 'X' : 'O';
  const cellIndex = Array.from(cells).indexOf(cell);

  if (board[cellIndex]) return;

  cell.textContent = currentClass;
  cell.classList.add('taken');
  board[cellIndex] = currentClass;

  if (checkWin(currentClass)) {
    statusText.textContent = `${currentClass} wins!`;
    highlightWinningCells(getWinningCombination(currentClass));
    endGame();
  } else if (board.every(cell => cell)) {
    statusText.textContent = `It's a tie!`;
    endGame();
  } else {
    isXTurn = !isXTurn;
    if (isPlayerVsAI && !isXTurn) {
      statusText.textContent = `O's turn (AI)`;
      setTimeout(makeAIMove, 500);
    } else {
      statusText.textContent = `${isXTurn ? 'X' : 'O'}'s turn`;
    }
  }
}

// Highlight winning cells
function highlightWinningCells(combination) {
  combination.forEach(index => cells[index].classList.add('win'));
}

// Get winning combination
function getWinningCombination(currentClass) {
  return WINNING_COMBINATIONS.find(combination =>
    combination.every(index => board[index] === currentClass)
  );
}

// Check win
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => board[index] === currentClass)
  );
}

// Make AI move (random)
function makeAIMove() {
  const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const cell = cells[randomIndex];

  board[randomIndex] = 'O';
  cell.textContent = 'O';
  cell.classList.add('taken');

  if (checkWin('O')) {
    statusText.textContent = `O wins!`;
    highlightWinningCells(getWinningCombination('O'));
    endGame();
  } else if (board.every(cell => cell)) {
    statusText.textContent = `It's a tie!`;
    endGame();
  } else {
    isXTurn = true;
    statusText.textContent = `X's turn`;
  }
}

// End game
function endGame() {
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

// Restart game
function restartGame() {
  board.fill(null);
  isXTurn = true;
  statusText.textContent = 'X\'s turn';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'win');
    cell.addEventListener('click', handleClick, { once: true });
  });
}

// Switch modes
switchModeButton.addEventListener('click', () => {
  isPlayerVsAI = !isPlayerVsAI;
  switchModeButton.textContent = isPlayerVsAI ? 'Switch to Player Mode' : 'Switch to AI Mode';
  restartGame();
});

// Initialize the game
restartGame();
restartButton.addEventListener('click', restartGame);
