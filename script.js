document.getElementById('setup-form').addEventListener('submit', startGame);
document.getElementById('roll-dice').addEventListener('click', rollDice);

// Tlačítko zpět do menu
document.getElementById('back-to-menu').addEventListener('click', () => {
  const confirmBack = confirm("Opravdu chcete zpět do nastavení? Přerušíte tím aktuální hru!");
  if (confirmBack) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
  }
});

// Tlačítko restartu hry
document.getElementById('restart-game').addEventListener('click', () => {
  const confirmRestart = confirm("Opravdu chcete restartovat hru? Všichni hráči se vrátí na start!");
  if (confirmRestart) {
    resetGame();
  }
});

// Zavírání vyskakovacího okna
document.getElementById('modal-btn').addEventListener('click', () => {
  document.getElementById('custom-modal').classList.add('hidden');
});

function gameAlert(message) {
  document.getElementById('modal-text').innerHTML = message;
  document.getElementById('custom-modal').classList.remove('hidden');
}

function getColoredName(player) {
  return `<span style="color: ${player.color}; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">${player.name}</span>`;
}

let players = [];
let currentPlayerIndex = 0;
let isCampMode = false; 
let currentTasks = [];

// --- NOVÁ LOGIKA PRO PŘIDÁVÁNÍ POLÍČEK ---

document.getElementById('add-player-btn').addEventListener('click', addPlayerField);

function addPlayerField() {
  const container = document.getElementById('player-names-container');
  const count = container.children.length + 1;
  const input = document.createElement('input');
  
  input.type = 'text';
  input.placeholder = `Jméno hráče ${count}`;
  // Zajištění stejného vzhledu, ať už se generují automaticky, nebo ručně přidávají
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

// Při startu aplikace vygenerujeme základních 6 políček
function initPlayerFields() {
  const container = document.getElementById('player-names-container');
  container.innerHTML = '';
  for(let i = 0; i < 6; i++) {
    addPlayerField();
  }
}

// Spustíme generování
initPlayerFields();

// --- LOGIKA STARTU HRY ---

function startGame(event) {
  event.preventDefault();
  
  isCampMode = document.getElementById('camp-mode-toggle').checked;
  currentTasks = isCampMode ? campTasks : adultTasks;

  // Najdeme všechna políčka pro jména
  const nameInputs = document.querySelectorAll('#player-names-container input');
  
  // Vyfiltrujeme jen ty, kam uživatel reálně něco napsal (prázdná ignorujeme)
  const validNames = Array.from(nameInputs)
                          .map(inp => inp.value.trim())
                          .filter(name => name !== "");

  if (validNames.length === 0) {
    alert("Musíte vyplnit alespoň jednoho hráče!");
    return;
  }

  players = [];
  // Rozšířené barvy, kdybyste hráli v hodně lidech
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'cyan', 'lime', 'white', 'gray'];
  
  for (let i = 0; i < validNames.length; i++) {
    players.push({
      name: validNames[i],
      position: 0,
      color: colors[i % colors.length], // Když je víc hráčů než barev, točí se barvy od znova
      number: i,
      lastRoll: 0
    });
  }
  
  currentPlayerIndex = 0;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  generateBoard();
  displayPlayerInfo();
  updateTurnIndicator(); 
}
