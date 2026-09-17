let players = [];
let currentPlayerIndex = 0;
let isCampMode = false; 
let currentTasks = [];

// TOTO JE TA HLAVNÍ ZMĚNA: Všechno úvodní spouštění zabalíme sem!
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Napojíme všechna tlačítka
    document.getElementById('setup-form').addEventListener('submit', startGame);
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('add-player-btn').addEventListener('click', addPlayerField);

    document.getElementById('back-to-menu').addEventListener('click', () => {
        const confirmBack = confirm("Opravdu chcete zpět do nastavení? Přerušíte tím aktuální hru!");
        if (confirmBack) {
            document.getElementById('game').style.display = 'none';
            document.getElementById('setup').style.display = 'block';
        }
    });

    document.getElementById('restart-game').addEventListener('click', () => {
        const confirmRestart = confirm("Opravdu chcete restartovat hru? Všichni hráči se vrátí na start!");
        if (confirmRestart) {
            resetGame();
        }
    });

    document.getElementById('modal-btn').addEventListener('click', () => {
        document.getElementById('custom-modal').classList.add('hidden');
    });

    // 2. Vykreslíme úvodních 6 políček
    initPlayerFields();
});

// --- DEFINICE FUNKCÍ ---

function gameAlert(message) {
    document.getElementById('modal-text').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function getColoredName(player) {
    return `<span style="color: ${player.color}; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">${player.name}</span>`;
}

function addPlayerField() {
    const container = document.getElementById('player-names-container');
    if (!container) return; // Pojistka, aby to nespadlo
    
    const count = container.children.length + 1;
    const input = document.createElement('input');
    
    input.type = 'text';
    input.placeholder = `Jméno hráče ${count}`;
    input.style.width = '100%';
    input.style.padding = '12px';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid #444';
    input.style.background = '#1a1a1a';
    input.style.color = 'white';
    input.style.boxSizing = 'border-box';
    input.style.outline = 'none';
    
    container.appendChild(input);
}

function initPlayerFields() {
    const container = document.getElementById('player-names-container');
    if (!container) return; 
    
    container.innerHTML = '';
    for(let i = 0; i < 6; i++) {
        addPlayerField();
    }
}

function startGame(event) {
// ... odsud dolů už pokračuje tvůj původní kód (startGame atd.)
