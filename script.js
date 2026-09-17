let players = [];
let currentPlayerIndex = 0;
let isCampMode = false; 
let currentTasks = [];

// Zabalíme vše do window.onload, aby HTML bylo 100% připravené
window.onload = function() {
    console.log("✅ Skript byl úspěšně spuštěn!");

    // Bezpečné napojení tlačítek (pokud prvek existuje, napojí se)
    const form = document.getElementById('setup-form');
    if (form) form.addEventListener('submit', startGame);

    const btnRoll = document.getElementById('roll-dice');
    if (btnRoll) btnRoll.addEventListener('click', rollDice);

    const btnAddPlayer = document.getElementById('add-player-btn');
    if (btnAddPlayer) btnAddPlayer.addEventListener('click', addPlayerField);

    const btnBack = document.getElementById('back-to-menu');
    if (btnBack) btnBack.addEventListener('click', () => {
        if (confirm("Opravdu chcete zpět do nastavení? Přerušíte tím aktuální hru!")) {
            document.getElementById('game').style.display = 'none';
            document.getElementById('setup').style.display = 'block';
        }
    });

    const btnRestart = document.getElementById('restart-game');
    if (btnRestart) btnRestart.addEventListener('click', () => {
        if (confirm("Opravdu chcete restartovat hru? Všichni hráči se vrátí na start!")) {
            resetGame();
        }
    });

    const btnModal = document.getElementById('modal-btn');
    if (btnModal) btnModal.addEventListener('click', () => {
        document.getElementById('custom-modal').classList.add('hidden');
    });

    // Spuštění generování políček
    initPlayerFields();
};

function gameAlert(message) {
    document.getElementById('modal-text').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function getColoredName(player) {
    return `<span style="color: ${player.color}; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">${player.name}</span>`;
}

function addPlayerField() {
    const container = document.getElementById('player-names-container');
    if (!container) {
        console.error("Kontejner pro jména nebyl nalezen!");
        return;
    }
    
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
