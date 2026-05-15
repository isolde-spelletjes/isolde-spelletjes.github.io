const buttons = {
    green: document.getElementById("green"),
    red: document.getElementById("red"),
    yellow: document.getElementById("yellow"),
    blue: document.getElementById("blue")
};

const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerSequence = [];
let score = 0;
let waitingForPlayer = false;

const clickSound = new Audio("sounds/click.mp3");
const gameOverSound = new Audio("sounds/game-over.mp3");


function flash(color) {
    return new Promise(resolve => {
        const btn = buttons[color];
        btn.classList.add("active");
        setTimeout(() => {
            btn.classList.remove("active");
            resolve();
        }, 500);
    });
}

async function playSequence() {
    waitingForPlayer = false;
    for (let color of sequence) {
        await flash(color);
        await new Promise(r => setTimeout(r, 200));
    }
    waitingForPlayer = true;
    playerSequence = [];
}

function nextRound() {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    playSequence();
}

function gameOver() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    alert("Fout! Je score was: " + score);
    sequence = [];
    playerSequence = [];
    score = 0;
    document.getElementById("score").textContent = "Score: 0";
}

function handlePlayerInput(color) {
    if (!waitingForPlayer) return;

    clickSound.currentTime = 0;
    clickSound.play();

    playerSequence.push(color);
    flash(color);

    const index = playerSequence.length - 1;

    if (playerSequence[index] !== sequence[index]) {
        gameOver();
        return;
    }

    if (playerSequence.length === sequence.length) {
        setTimeout(nextRound, 800);
    }
}

Object.keys(buttons).forEach(color => {
    buttons[color].addEventListener("click", () => handlePlayerInput(color));
    buttons[color].addEventListener("touchstart", () => handlePlayerInput(color));
});

document.getElementById("startBtn").addEventListener("click", () => {
    sequence = [];
    score = 0;
    nextRound();
});
