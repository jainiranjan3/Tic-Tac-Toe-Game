const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const reset = document.getElementById("reset");
const restartButton = document.getElementById("restartButton");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");

let circleTurn;
let isMusicPlaying = false; // Track if music is playing

document.addEventListener("DOMContentLoaded", () => {
  // Start playing music on user interaction
  document.body.addEventListener("click", () => {
    if (!isMusicPlaying) {
      music.play().catch((e) => {
        console.log("Music playback issue:", e);
      });
      isMusicPlaying = true;
    }
  }, { once: true }); // Only runs once
  
  startGame();
});

reset.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

musicButton.addEventListener("click", () => {
  if (isMusicPlaying) {
    music.pause();
    musicButton.innerText = "Turn Music On";
    isMusicPlaying = false;
  } else {
    music.play().catch((e) => console.log("Music playback issue:", e));
    musicButton.innerText = "Turn Music Off";
    isMusicPlaying = true;
  }
});

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");

  // Ensure music is playing at the start of the game
  if (!isMusicPlaying) {
    music.play().catch((e) => console.log("Music playback issue:", e));
    isMusicPlaying = true;
  }
  musicButton.innerText = "Turn Music Off"; // Sync button state
  updateinfo();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  audioTurn.play();

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function swapTurns() {
  circleTurn = !circleTurn;
  updateinfo();
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add("show");

  gameover.play();
  music.pause();
  music.currentTime = 0; // Reset music for potential replay
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function updateinfo() {
  info.innerText = `${circleTurn ? "O's" : "X's"} Turn`;
}
