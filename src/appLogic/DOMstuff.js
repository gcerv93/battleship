import { isArrayInArray, clearDisplay } from "./helpers";

const displayPlayerDiv = (board) => {
  const playerDiv = document.querySelector(".left");
  clearDisplay(playerDiv);

  board.getBoard().forEach((row, i) => {
    const rowCell = document.createElement("div");
    rowCell.dataset.index = i;
    rowCell.classList.add("row");
    row.forEach((cell, idx) => {
      const boardCell = document.createElement("div");
      boardCell.dataset.index = idx;

      if (cell === false) {
        boardCell.classList.add("cell");
      } else {
        boardCell.classList.add("occupied");
      }

      if (cell.hit === true) {
        boardCell.classList.add("hit");
      } else if (isArrayInArray(board.missed, [i, idx])) {
        boardCell.classList.add("miss");
      }

      rowCell.appendChild(boardCell);
    });
    playerDiv.appendChild(rowCell);
  });
};

const displayCompDiv = (board) => {
  const compDiv = document.querySelector(".right");
  clearDisplay(compDiv);

  board.getBoard().forEach((row, i) => {
    const rowCell = document.createElement("div");
    rowCell.dataset.index = i;
    rowCell.classList.add("row");
    row.forEach((cell, idx) => {
      const boardCell = document.createElement("div");
      boardCell.dataset.index = idx;
      boardCell.classList.add("cell");

      if (cell.hit === true) {
        boardCell.classList.add("hit");
      } else if (isArrayInArray(board.missed, [i, idx])) {
        boardCell.classList.add("miss");
      }

      rowCell.appendChild(boardCell);
    });
    compDiv.appendChild(rowCell);
  });
};

// Returns a promise for the game loop to function in turn based fashion.
const listenForClick = (board) => {
  const compBoard = document.querySelector(".right");
  const promise = new Promise((resolve) => {
    compBoard.addEventListener("click", (e) => {
      if (e.target.parentElement !== compBoard) {
        const rowIndex = parseInt(e.target.parentElement.dataset.index, 10);
        const cellIndex = parseInt(e.target.dataset.index, 10);
        board.receiveAttack([rowIndex, cellIndex]);
        clearDisplay(compBoard);
        displayCompDiv(board);
        resolve();
      }
    });
  });

  return promise;
};

const playAgainListener = (newGame) => {
  const playAgainBtn = document.querySelector(".playAgain");
  playAgainBtn.addEventListener(
    "click",
    () => {
      const overlay = document.querySelector("#overlay");
      const gameOver = document.querySelector(".gameOver");
      overlay.classList.remove("overlay");
      gameOver.style.display = "none";
      newGame();
    },
    { once: true }
  );
};

const gameOverDisplay = (text, newGame) => {
  const overlay = document.querySelector("#overlay");
  const gameOver = document.querySelector(".gameOver");
  const gameOverWinner = document.querySelector(".winner");
  overlay.classList.add("overlay");
  gameOver.style.display = "flex";
  gameOverWinner.textContent = text;

  playAgainListener(newGame);
};

export { displayPlayerDiv, displayCompDiv, listenForClick, gameOverDisplay };
