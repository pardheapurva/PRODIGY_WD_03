// ===== ELEMENTS =====
const beginBtn = document.getElementById("beginBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");
const restartBtn = document.getElementById("restart");
const homeBtn = document.getElementById("homeBtn");   

const startSection = document.querySelector(".start-section");
const modeSection = document.querySelector(".mode-section");
const gameSection = document.querySelector(".game-section");

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
}
// ===== GAME STATE =====
let vsAI = false;
let currentPlayer = "X";
let gameActive = false;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];


// START FLOW

// Begin → Show Mode Selection
beginBtn.addEventListener("click", () => {
    startSection.classList.add("hidden");
    modeSection.classList.remove("hidden");
});

// Mode Selection
twoPlayerBtn.addEventListener("click", () => {
    vsAI = false;
    startGame();
});

aiBtn.addEventListener("click", () => {
    vsAI = true;
    startGame();
});

// Start Game → Hide Mode → Show Board
function startGame() {
    modeSection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    restartGame();
}


//  HOME BUTTON 


homeBtn.addEventListener("click", () => {
    // Reset everything
    restartGame();

    // Hide game + mode
    gameSection.classList.add("hidden");
    modeSection.classList.add("hidden");

    // Show start screen
    startSection.classList.remove("hidden");

    // Reset mode
    vsAI = false;
});


// GAME LOGIC

cells.forEach(cell => cell.addEventListener("click", handleCellClick));



document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", playClickSound);
});

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    playClickSound();

    if (checkWinner()) return;

    // AI Turn
    if (vsAI && currentPlayer === "X") {
        currentPlayer = "O";
        setTimeout(computerMove, 400);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    } 
}

function launchConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;

        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            highlightWinner(condition);
            playWinSound();
            launchConfetti();
            statusText.textContent = `Player ${gameState[a]} Wins! 🎉`;
            gameActive = false;
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


//  AI 

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


// RESTART

function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = vsAI 
        ? "VS Computer 🤖" 
        : "2 Players 👥";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
}

restartBtn.addEventListener("click", restartGame);

