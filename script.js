// Připojení obsluhy tlačítek a změn
document.getElementById('setup-form').addEventListener('submit', startGame);
document.getElementById('player-count').addEventListener('change', updatePlayerNameFields);
document.getElementById('roll-dice').addEventListener('click', rollDice);

// Tlačítko zpět do menu
document.getElementById('back-to-menu').addEventListener('click', () => {
  const confirmBack = confirm("Opravdu chcete zpět do nastavení? Přerušíte tím aktuální hru!");
  if (confirmBack) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
  }
});

// Tlačítko pro restart hry
document.getElementById('restart-game').addEventListener('click', () => {
  const confirmRestart = confirm("Opravdu chcete restartovat hru? Všichni hráči se vrátí na start!");
  if (confirmRestart) {
    resetGame();
  }
});

updatePlayerNameFields();

let players = [];
let currentPlayerIndex = 0;

function updatePlayerNameFields() {
  const playerCount = document.getElementById('player-count').value;
  const playerNamesDiv = document.getElementById('player-names');
  playerNamesDiv.innerHTML = '';
  for (let i = 0; i < playerCount; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Jméno hráče ${i + 1}`;
    input.id = `player-name-${i}`;
    input.required = true;
    playerNamesDiv.appendChild(input);
  }
}

function startGame(event) {
  event.preventDefault();
  const playerCount = document.getElementById('player-count').value;
  players = [];
  for (let i = 0; i < playerCount; i++) {
    const playerName = document.getElementById(`player-name-${i}`).value || `Hráč ${i + 1}`;
    players.push({
      name: playerName,
      position: 0,
      color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'][i],
      number: i,
      lastRoll: 0
    });
  }
  currentPlayerIndex = 0;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  generateBoard();
  displayPlayerInfo();
  updateTurnIndicator(); // Zobrazení prvního hráče na tahu
}

// Seznam úkolů pro každé pole
const tasks = [
    "", "Pijí všichni", "Piješ ty a osoba nejblíž tobě", "Ruku na sklenici",
    "Hráči s pivem se napijí", "Jdeš na políčko 32", "Piješ!", "Pijí všichni naproti tobě",
    "Nic", "Vyber si s kým budeš pít", "Pijí všichni chlapci",
    "Dáš si panáka nejtvrdšího alkoholu co máte", "Pije ten kdo má brýle nebo čočky",
    "Hází všichni a kdo hodí sudé číslo tak pije", "Uděláš dřep na jedné noze jinak piješ",
    "Pije ten nejmenší", "Pijí dívky", "Piješ a jedno kolo mlčíš", "Nic",
    "Házíš ještě jednou", "Uděláš 2 kotrmelce", "Dej si nealko", "Vracíš se o 2 pole dozadu", "Aby ti to nebylo líto tak piješ!",
    "Piješ a posouváš se o 2 pole vpřed", "Pije den největší", "Piješ ještě jednou",
    "Dej si panáka", "Nic", "Piješ, když si dáš 2x vybereš někoho kdo si dá s tebou",
    "Udělej 10 kliků", "Oběhni tábor", "Hráči ti uvaří SMYKKAP", "Urči 2 hráče, kteří budou pít",
    "Dáš si paliprdelkoření", "Otoč se 10x jako slon", "Umícháš si drink vítr do plachet",
    "Házíš kostkou, kolik hodíš o tolik se vracíš","Nic", "Dáš si ruskou tequilu", "#KAJINEK kdo se poslední dostane k bráně tak pije",
    "BDSM", "Kategorie", "Napiješ se piva s citronkou", "Dáš si jeden kozelmeister", "Piješ tolik sekund kolik ti je let",
    "Exni svůj drink a zároveň se přesouváš na pole 63", "Musíš jít na pole kde se nachází assignment hráč","Nic",
    "Dáš si vodníkovo sperma", "Dáš si kostku ve smyku", "Zahraješ si kámen nůžky papír s hráčem po levici",
    "Kdo nemá sourozence tak pije", "Zazpívej úryvek tvé oblíbene písně", "Smrdí ti z huby vyčisti si zuby", "Kdo má sourozence tak pije",
    "Dáš si sklenici vody", "ROZCVIČKA!!! skoč 10 panáků", "Nic", "Udělej 10 dřepů", "Pivo, Pivson, Pivíčko",
    "Dáš si malé pivo brčkem", "Želva","Přesouváš se na pole 46",
    "Házíš znovu pokud hodíš liché číslo tak piješ", "VYPROŠŤOVÁK dej si lák od okurek", "Hází všichni, kdo hodí číslo 6 tak pije",
    "JAZYKOLAM","Nic", "BODYSHOT","Jdeš na pole 61", "SMYK"
];

function generateBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < 72; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.innerText = i;
    const playersContainer = document.createElement('div');
    playersContainer.className = 'players-container';
    cell.appendChild(playersContainer);
    board.appendChild(cell);
  }
  updatePlayerPositions();
}

function rollDice() {
  let diceValue = parseInt(document.getElementById('manual-roll')?.value);
  if (isNaN(diceValue)) {
    diceValue = Math.floor(Math.random() * 6) + 1;
  }
  
  const currentPlayer = players[currentPlayerIndex];
  
  document.getElementById('dice-value').innerHTML = `<span class="roll-label">${currentPlayer.name} hodil:</span>${diceValue}`;
  
  players[currentPlayerIndex].lastRoll = diceValue;
  movePlayer(diceValue);
  displayPlayerInfo();
  document.getElementById('manual-roll').value = '';
}

function movePlayer(steps) {
  const player = players[currentPlayerIndex];
  player.position += steps;

  if (player.position > 71) {
    const overshoot = player.position - 71;
    player.position = 71 - overshoot;
    alert(`${player.name} přehodil cíl a vrací se na pole ${player.position}.`);
  }

  if (player.position === 5) {
    player.position = 32;
    alert(`${player.name} skončil na poli 5 a přesouvá se na pole 32.`);
  } else if (player.position === 19) {
    alert(`${player.name} skončil na poli 19 a hází ještě jednou!`);
    const extraRoll = Math.floor(Math.random() * 6) + 1;
    alert(`${player.name} hodil ${extraRoll} a posouvá se o ${extraRoll} dál.`);
    player.position += extraRoll;
    updatePlayerPositions();
    showTask(player);
  } else if (player.position === 22) {
    player.position -= 2;
    alert(`${player.name} skončil na poli 22 a vrací se na pole ${player.position}.`);
  } else if (player.position === 24) {
    alert("Piješ! a posouváš se na pole 26");
    alert(`Další úkol z pole 26: ${tasks[26]}`);
    player.position = 26;
  } else if (player.position === 37) {
    const random = Math.floor(Math.random() * 6) + 1;
    alert(`${player.name} hodil ${random} a vrací se o tolik zpět.`);
    player.position -= random;
    if (player.position < 0) player.position = 0;
  } else if (player.position === 46) {
    alert(`Úkol: ${tasks[46]}`);
    player.position = 63;
    alert(`${player.name} se přesouvá na pole 63.`);
  } else if (player.position === 47) {
    const lastPlayerPosition = players[(currentPlayerIndex - 1 + players.length) % players.length].position;
    player.position = lastPlayerPosition;
    alert(`${player.name} se přesouvá na pole ${player.position}.`);
  } else if (player.position === 63) {
    player.position = 46;
    alert(`${player.name} se přesouvá na pole 46.`);
  } else if (player.position === 64) {
    if (player.lastRoll % 2 === 0) {
      alert(`${player.name} skončil na poli 64 – hodil sudé číslo (${player.lastRoll}) – nepije.`);
    } else {
      alert(`${player.name} skončil na poli 64 – hodil liché číslo (${player.lastRoll}) – pije!`);
    }
  } else if (player.position === 66) {
    let resultMessage = `${player.name} skončil na poli 66 – všichni hráči hází!\n\n`;
    players.forEach(p => {
      const throwValue = Math.floor(Math.random() * 6) + 1;
      resultMessage += `${p.name} hodil ${throwValue}. `;
      if (throwValue === 6) {
        resultMessage += "Pije!\n";
      } else {
        resultMessage += "Nepije.\n";
      }
    });
    alert(resultMessage);
  } else if (player.position === 70) {
    player.position = 61;
    alert(`${player.name} se vrací na pole 61.`);
  }

  updatePlayerPositions();
  showTask(player);

  if (player.position === 71) {
    alert(`Gratulujeme! ${player.name} vyhrál!`);
    resetGame();
    return;
  }

  // Přepnutí na dalšího hráče
  if (players.length > 1) {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
  
  // Aktualizace textu "Kdo hází" pro nového hráče
  updateTurnIndicator();
}

function resetGame() {
  players.forEach(player => {
    player.position = 0;
    player.lastRoll = 0;
  });
  currentPlayerIndex = 0;
  updatePlayerPositions();
  document.getElementById('dice-value').innerHTML = '';
  document.getElementById('task-text').innerHTML = '';
  displayPlayerInfo();
  updateTurnIndicator(); // Reset ukazatele na prvního hráče
}

function updateTurnIndicator() {
  if (players.length > 0) {
    const player = players[currentPlayerIndex];
    document.getElementById('turn-indicator').innerHTML = `<strong style="color: ${player.color}; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); font-size: 1.2em;">${player.name}</strong> hází kostkou`;
  }
}

function updatePlayerPositions() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.querySelector('.players-container').innerHTML = '';
  });
  players.forEach((player, index) => {
    const playerCell = cells[player.position].querySelector('.players-container');
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.style.backgroundColor = player.color;
    
    if (index === currentPlayerIndex) {
      playerElement.style.boxShadow = '0 0 8px 3px gold';
    }
    
    playerCell.appendChild(playerElement);
  });
}

function showTask(playerOrPosition) {
  let position;
  let playerName = "";
  let playerColor = "black";

  if (typeof playerOrPosition === 'object' && playerOrPosition !== null) {
    position = playerOrPosition.position;
    playerName = playerOrPosition.name;
    playerColor = playerOrPosition.color;
  } else {
    position = playerOrPosition;
    const fallbackPlayer = players[currentPlayerIndex];
    if (fallbackPlayer) {
      playerName = fallbackPlayer.name;
      playerColor = fallbackPlayer.color;
    }
  }

  const task = tasks[position];
  
  if (task && task !== "Nic" && task !== "") {
    document.getElementById('task-text').innerHTML = `
      <div style="margin-bottom: 8px;">
        <span style="color: ${playerColor}; font-weight: bold; font-size: 1.2em; text-shadow: 1px 1px 2px rgba(255,255,255,0.8);">${playerName}</span>, tvůj úkol:
      </div>
      <div style="font-size: 1.1em; font-weight: bold;">${task}</div>
    `;
  } else {
    document.getElementById('task-text').innerHTML = '';
  }
}

function displayPlayerInfo() {
  const playerInfoDiv = document.getElementById('player-info');
  playerInfoDiv.innerHTML = '';
  players.forEach((player, index) => {
    const playerInfoItem = document.createElement('div');
    playerInfoItem.className = 'player-info-item';
    
    playerInfoItem.innerHTML = `
      <span class="player-number">${index + 1}.</span>
      <span class="player-color" style="background-color: ${player.color};"></span>
      <span style="font-weight: bold;">${player.name}</span>
    `;
    playerInfoDiv.appendChild(playerInfoItem);
  });
}
