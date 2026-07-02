document.getElementById('setup-form').addEventListener('submit', startGame);
document.getElementById('player-count').addEventListener('change', updatePlayerNameFields);
document.getElementById('roll-dice').addEventListener('click', rollDice);

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

function gameAlert(message) {
  document.getElementById('modal-text').innerHTML = message;
  document.getElementById('custom-modal').classList.remove('hidden');
}

function getColoredName(player) {
  return `<span style="color: ${player.color}; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">${player.name}</span>`;
}

updatePlayerNameFields();

let players = [];
let currentPlayerIndex = 0;
let isCampMode = false; 
let currentTasks = [];

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
  
  isCampMode = document.getElementById('camp-mode-toggle').checked;
  currentTasks = isCampMode ? campTasks : adultTasks;

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
  updateTurnIndicator(); 
}

// KLASICKÉ ÚKOLY
const adultTasks = [
    "", "Pijí všichni", "Piješ ty a osoba nejblíž tobě", "Ruku na sklenici",
    "Hráči s pivem se napijí", "Jdeš na políčko 32", "Piješ!", "Pijí všichni naproti tobě",
    "Nic", "Vyber si s kým budeš pít", "Pijí všichni chlapci",
    "Dáš si panáka nejtvrdšího alkoholu co máte", "Pije ten kdo má brýle nebo čočky",
    "Hází všichni a kdo hodí sudé číslo tak pije", "Uděláš dřep na jedné noze jinak piješ",
    "Pije ten nejmenší", "Pijí dívky", "Piješ a jedno kolo mlčíš", "Nic",
    "Házíš ještě jednou", "Uděláš 2 kotrmelce", "Dej si nealko", "Vracíš se o 2 pole dozadu", "Aby ti to nebylo líto tak piješ!",
    "Piješ a posouváš se o 2 pole vpřed", "Pije den největší", "a piješ ještě jednou", 
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

// TÁBOROVÉ / DĚTSKÉ ÚKOLY
const campTasks = [
    "", "Všichni dělají 5 dřepů", "Cvičíš ty a osoba nejblíž tobě", "Ruku na hlavu! Poslední dělá 5 kliků",
    "Kdo má na sobě něco modrého (jako voda), dělá dřep", "Jdeš na políčko 32", "Cvičíš!", "Všichni naproti tobě dělají žabáky",
    "Nic", "Vyber si, s kým uděláš 10 dřepů", "Cvičí všichni kluci",
    "Zazpívej nahlas kousek vodácké nebo táborové písničky", "Cvičí ten, kdo má brýle",
    "Hází všichni: kdo hodí sudé, oběhne stůl", "Uděláš dřep na jedné noze, jinak 10 kliků",
    "Cvičí ten nejmenší", "Cvičí holky", "Děláš 5 kliků a jedno kolo mlčíš", "Nic",
    "Házíš ještě jednou", "Uděláš 2 kotrmelce", "Běž se napít čisté vody", "Vracíš se o 2 pole dozadu", "Aby ti to nebylo líto, udělej 5 dřepů!",
    "Udělej 3 žabáky a posouváš se o 2 pole vpřed", "Cvičí ten největší", "a házíš ještě jednou", 
    "Udělej 5 kliků", "Nic", "Děláš 10 dřepů, vybereš někoho, kdo je dělá s tebou",
    "Udělej 10 kliků", "Oběhni tábor/místnost", "Ostatní ti vymyslí tajný vodácký úkol", "Urči 2 hráče, kteří budou cvičit",
    "Předveď, jak pádluješ na lodi", "Otoč se 10x jako slon", "Oběhni stany/stůl jako vítr",
    "Házíš kostkou, kolik hodíš, o tolik se vracíš","Nic", "Stůj 10 vteřin na jedné noze jako volavka", "Poslední, kdo se dotkne země, cvičí",
    "Předveď jakékoliv zvíře", "Vyjmenuj 5 řek v ČR (nebo cvičíš)", "Usmívej se celé další kolo", "Udělej 10 žabáků", "Udělej tolik dřepů, kolik ti je let",
    "Vyskoč 5x co nejvýš a přesouváš se na pole 63", "Musíš jít na pole, kde se nachází poslední hráč","Nic",
    "Zazpívej Holka modrooká", "Vydrž 30 vteřin v prkně (plank)", "Zahraješ si kámen nůžky papír s hráčem po levici",
    "Kdo nemá sourozence, dělá dřepy", "Vymysli rým na slovo VODA", "Běž si umýt ruce", "Kdo má sourozence, dělá dřepy",
    "Vypij celou sklenici vody", "ROZCVIČKA!!! Skoč 10 panáků", "Nic", "Udělej 10 dřepů", "Zakřič táborový pokřik!",
    "Zavři oči a stůj na jedné noze", "Předveď želvu","Přesouváš se na pole 46",
    "Házíš znovu, pokud hodíš liché číslo, cvičíš", "Jdi obejmout strom (nebo stůl)", "Hází všichni, kdo hodí číslo 6, dělá 10 dřepů",
    "JAZYKOLAM: Tři sta třiatřicet stříbrných stříkaček...","Nic", "Udělej most (nebo 5 kliků)","Jdeš na pole 61", "Zatleskej si!"
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
  
  document.getElementById('turn-indicator').innerHTML = `
    ${getColoredName(currentPlayer)} hodil kostkou: <strong style="font-size: 1.3em; color: #fff;">${diceValue}</strong>
  `;
  
  players[currentPlayerIndex].lastRoll = diceValue;
  
  setTimeout(() => {
    movePlayer(diceValue);
    displayPlayerInfo();
  }, 50);
  
  document.getElementById('manual-roll').value = '';
}

function movePlayer(steps) {
  const player = players[currentPlayerIndex];
  player.position += steps;
  let showSpecialTask = true; 

  if (player.position > 71) {
    const overshoot = player.position - 71;
    player.position = 71 - overshoot;
    gameAlert(`${getColoredName(player)} přehodil cíl a vrací se na pole ${player.position}.`);
  }

  if (player.position === 5) {
    player.position = 32;
    gameAlert(`${getColoredName(player)} skončil na poli 5 a přesouvá se na pole 32.`);
  } else if (player.position === 13) {
    let resultMessage = `${getColoredName(player)} stoupl na pole 13!<br>Všichni hráči nyní házejí kostkou:<br><br>`;
    players.forEach(p => {
      const throwValue = Math.floor(Math.random() * 6) + 1;
      resultMessage += `${getColoredName(p)} hodil ${throwValue}. `;
      if (throwValue % 2 === 0) { 
        resultMessage += isCampMode ? "Je to sudé, DŘEPUJE!<br>" : "Je to sudé, PIJE!<br>";
      } else {
        resultMessage += isCampMode ? "Necvičí.<br>" : "Nepije.<br>";
      }
    });
    gameAlert(resultMessage);
  } else if (player.position === 19) {
    const extraRoll = Math.floor(Math.random() * 6) + 1;
    gameAlert(`${getColoredName(player)} skončil na poli 19 a hází ještě jednou!<br><br>Hodil ${extraRoll} a posouvá se o ${extraRoll} dál.`);
    player.position += extraRoll;
  } else if (player.position === 22) {
    player.position -= 2;
    gameAlert(`${getColoredName(player)} skončil na poli 22 a vrací se na pole ${player.position}.`);
  } else if (player.position === 24) {
    player.position = 26;
    if (isCampMode) {
      gameAlert(`${getColoredName(player)} stoupl na pole 24!<br><br>Udělej 3 žabáky a posouváš se o 2 pole vpřed.<br><br>Na poli 26 tě čeká dokončení úkolu!`);
    } else {
      gameAlert(`${getColoredName(player)} stoupl na pole 24!<br><br>Piješ a posouváš se o 2 pole vpřed.<br><br>Na poli 26 tě čeká dokončení úkolu!`);
    }
  } else if (player.position === 37) {
    const random = Math.floor(Math.random() * 6) + 1;
    player.position -= random;
    if (player.position < 0) player.position = 0;
    gameAlert(`${getColoredName(player)} hodil ${random} a vrací se o tolik zpět na pole ${player.position}.`);
  } else if (player.position === 46) {
    player.position = 63;
    showSpecialTask = false; 
    if (isCampMode) {
      gameAlert(`${getColoredName(player)} stoupl na pole 46!<br><br>Vyskoč 5x co nejvýš a přesouváš se na pole 63!`);
    } else {
      gameAlert(`${getColoredName(player)} stoupl na pole 46!<br><br>EXNI SVŮJ DRINK a přesouváš se na pole 63!`);
    }
    document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Byl jsi přesunut z pole 46 na pole 63!</div>`;
  } else if (player.position === 47) {
    const lastPlayerPosition = Math.min(...players.map(p => p.position));
    player.position = lastPlayerPosition;
    gameAlert(`${getColoredName(player)} se přesouvá na pole ${player.position} k hráči, který je poslední.`);
  
  // --- UPRAVENÁ LOGIKA PRO POLE 63 ---
  } else if (player.position === 63) {
    player.position = 46;
    showSpecialTask = false; 
    if (isCampMode) {
      gameAlert(`${getColoredName(player)} stoupl na pole 63!<br><br>Spadl jsi zpět na pole 46!<br><br>A protože jsi na 46, musíš navíc vyskočit 5x co nejvýš! (Zůstáváš ale už tady)`);
      document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Spadl jsi na 46! Vyskoč 5x co nejvýš!</div>`;
    } else {
      gameAlert(`${getColoredName(player)} stoupl na pole 63!<br><br>Spadl jsi zpět na pole 46!<br><br>A protože jsi na 46, musíš navíc EXNOUT DRINK! (Zůstáváš ale už tady)`);
      document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Spadl jsi na 46! EXNI SVŮJ DRINK!</div>`;
    }
  // -----------------------------------

  } else if (player.position === 64) {
    const extraRoll = Math.floor(Math.random() * 6) + 1;
    let msg = `${getColoredName(player)} skončil na poli 64 – Házíš znovu!<br><br>`;
    if (extraRoll % 2 === 0) {
      msg += isCampMode ? `Hodil jsi sudé číslo (${extraRoll}) – nepiješ!` : `Hodil jsi sudé číslo (${extraRoll}) – nepiješ!`;
    } else {
      msg += isCampMode ? `Hodil jsi liché číslo (${extraRoll}) – děláš 5 dřepů!` : `Hodil jsi liché číslo (${extraRoll}) – piješ!`;
    }
    gameAlert(msg);
  } else if (player.position === 66) {
    let resultMessage = `${getColoredName(player)} skončil na poli 66 – všichni hráči hází!<br><br>`;
    players.forEach(p => {
      const throwValue = Math.floor(Math.random() * 6) + 1;
      resultMessage += `${getColoredName(p)} hodil ${throwValue}. `;
      if (throwValue === 6) {
        resultMessage += isCampMode ? "CVIČÍ!<br>" : "Pije!<br>";
      } else {
        resultMessage += isCampMode ? "Necvičí.<br>" : "Nepije.<br>";
      }
    });
    gameAlert(resultMessage);
  } else if (player.position === 70) {
    player.position = 61;
    gameAlert(`${getColoredName(player)} se vrací na pole 61.`);
  }

  updatePlayerPositions();
  
  if (showSpecialTask) {
    showTask(player);
  }

  if (player.position === 71) {
    gameAlert(`Gratulujeme! ${getColoredName(player)} vyhrál!`);
    resetGame();
    return;
  }

  if (players.length > 1) {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
}

function resetGame() {
  players.forEach(player => {
    player.position = 0;
    player.lastRoll = 0;
  });
  currentPlayerIndex = 0;
  updatePlayerPositions();
  document.getElementById('task-text').innerHTML = '';
  displayPlayerInfo();
  updateTurnIndicator(); 
}

function updateTurnIndicator() {
  if (players.length > 0) {
    const player = players[currentPlayerIndex];
    document.getElementById('turn-indicator').innerHTML = `
      ${getColoredName(player)} začíná hru!
    `;
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

  if (typeof playerOrPosition === 'object' && playerOrPosition !== null) {
    position = playerOrPosition.position;
  } else {
    position = playerOrPosition;
  }

  const task = currentTasks[position];
  
  if (task && task !== "Nic" && task !== "") {
    document.getElementById('task-text').innerHTML = `
      <div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">${task}</div>
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
