const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

let vsAI = false;
let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];


// MODE SELECTION
twoPlayerBtn.addEventListener("click", () => {
    vsAI = false;
    restartGame();
    statusText.textContent = "2 Player Mode";
});

aiBtn.addEventListener("click", () => {
    vsAI = true;
    restartGame();
    statusText.textContent = "Playing vs AI 🤖";
});


//  HANDLE PLAYER CLICK
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) return;

    // If AI mode and Player X just played
    if (vsAI && currentPlayer === "X") {
        currentPlayer = "O";
        setTimeout(computerMove, 500);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}


// CHECK WINNER
function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;

        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            statusText.textContent = `Player ${gameState[a]} Wins! 🎉`;
            gameActive = false;

            highlightWinner(condition);

            return true;
        }
    }

    if (!gameState.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function highlightWinner(combo) {
    combo.forEach(index => {
        cells[index].classList.add("winner");
    });
}

// AI MOVE (Random)
function computerMove() {
    if (!gameActive) return;

    let emptyCells = gameState
        .map((val, index) => val === "" ? index : null)
        .filter(val => val !== null);

    if (emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameState[randomIndex] = "O";
    cells[randomIndex].textContent = "O";

    if (checkWinner()) return;

    currentPlayer = "X";
}

// RESTART GAME
function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner"); 
    });
}

// EVENT LISTENERS
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
