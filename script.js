let players = [];
let currentPlayerIndex = 0;
let isCampMode = false; 
let currentTasks = [];

window.onload = function() {
    console.log("✅ Skript v3000 (Šoumen a Sportovec edice) spuštěn!");

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
    if (btnModal) {
        btnModal.addEventListener('click', () => {
            document.getElementById('custom-modal').classList.add('hidden');
        });
    }

    const readyTeams = localStorage.getItem('maximo_teams_ready');
    if (readyTeams) {
        localStorage.removeItem('maximo_teams_ready');
        const parsedTeams = JSON.parse(readyTeams);
        const teamNames = parsedTeams
            .filter(team => team.length > 0)
            .map(team => team.join(" + "));
        
        const savedCampMode = localStorage.getItem('maximo_camp_mode') === 'true';
        const toggle = document.getElementById('camp-mode-toggle');
        if (toggle) toggle.checked = savedCampMode;
        
        setTimeout(() => {
            isCampMode = savedCampMode;
            startGameCore(teamNames);
        }, 100);
        return; 
    }

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
    if (!container) return;
    
    const count = container.children.length + 1;
    const input = document.createElement('input');
    
    input.type = 'text';
    input.placeholder = `Hráč ${count}`;
    input.style.width = '100%';
    input.style.padding = '8px 10px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #444';
    input.style.background = '#1a1a1a';
    input.style.color = 'white';
    input.style.boxSizing = 'border-box';
    input.style.outline = 'none';
    input.style.fontSize = '14px';
    
    container.appendChild(input);
}

function initPlayerFields() {
    const container = document.getElementById('player-names-container');
    if (!container) return; 
    
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)'; 
    container.style.gap = '8px';
    container.style.marginBottom = '15px';
    
    for(let i = 0; i < 4; i++) {
        addPlayerField();
    }
}

window.startGame = function(event) {
    if(event) event.preventDefault();
    
    isCampMode = document.getElementById('camp-mode-toggle').checked;
    const nameInputs = document.querySelectorAll('#player-names-container input');
    
    const validNames = Array.from(nameInputs)
                          .map(inp => inp.value.trim())
                          .filter(name => name !== "");

    if (validNames.length === 0) {
        alert("Musíte vyplnit alespoň jednoho hráče!");
        return;
    }

    startGameCore(validNames);
};

function startGameCore(namesArray) {
    currentTasks = isCampMode ? campTasks : adultTasks;
    players = [];
    
    const colors = ['#ff4d4d', '#3399ff', '#33cc33', '#ffd633', '#cc33ff', '#ff9933', '#ff66b2', '#8c52ff', '#00e6e6', '#ccff33', '#ffffff', '#a6a6a6'];
    
    for (let i = 0; i < namesArray.length; i++) {
        players.push({
            name: namesArray[i],
            position: 0,
            color: colors[i % colors.length], 
            number: i,
            lastRoll: 0,
            stats: {
                rolls: 0,
                sixes: 0,
                ones: 0,
                backwardMoved: 0,
                drinks: 0,
                exercise: 0,
                spicy: 0,
                embarrassing: 0,
                bodyShots: 0,
                totalTasks: 0
            }
        });
    }
    
    currentPlayerIndex = 0;
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    
    const statsContainer = document.getElementById('stats-screen-wrapper');
    if (statsContainer) statsContainer.remove();

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
    currentPlayer.stats.rolls++;
    if (diceValue === 6) currentPlayer.stats.sixes++;
    if (diceValue === 1) currentPlayer.stats.ones++;
    
    document.getElementById('turn-indicator').innerHTML = `
        ${getColoredName(currentPlayer)} hodil kostkou: <strong style="font-size: 1.3em; color: #fff;">${diceValue}</strong>
    `;
    
    currentPlayer.lastRoll = diceValue;
    
    setTimeout(() => {
        movePlayer(diceValue);
        displayPlayerInfo();
    }, 50);
    
    document.getElementById('manual-roll').value = '';
}

function movePlayer(steps) {
    const player = players[currentPlayerIndex];
    const startPos = player.position; 
    
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
                isCampMode ? p.stats.exercise++ : p.stats.drinks++; 
            } else {
                resultMessage += isCampMode ? "Necvičí.<br>" : "Nepije.<br>";
            }
        });
        gameAlert(resultMessage);
    } else if (player.position === 19) {
        const extraRoll = Math.floor(Math.random() * 6) + 1;
        player.stats.rolls++; 
        if (extraRoll === 6) player.stats.sixes++;
        if (extraRoll === 1) player.stats.ones++;
        
        gameAlert(`${getColoredName(player)} skončil na poli 19 a hází ještě jednou!<br><br>Hodil ${extraRoll} a posouvá se o ${extraRoll} dál.`);
        player.position += extraRoll;
    } else if (player.position === 22) {
        player.position -= 2;
        gameAlert(`${getColoredName(player)} skončil na poli 22 a vrací se na pole ${player.position}.`);
    } else if (player.position === 24) {
        player.position = 26;
        if (isCampMode) {
            gameAlert(`${getColoredName(player)} stoupl na pole 24!<br><br>Udělej 3 žabáky a posouváš se o 2 pole vpřed.<br><br>Na poli 26 tě čeká dokončení úkolu!`);
            player.stats.exercise++;
        } else {
            gameAlert(`${getColoredName(player)} stoupl na pole 24!<br><br>Piješ a posouváš se o 2 pole vpřed.<br><br>Na poli 26 tě čeká dokončení úkolu!`);
            player.stats.drinks++;
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
            player.stats.exercise++;
        } else {
            gameAlert(`${getColoredName(player)} stoupl na pole 46!<br><br>EXNI SVŮJ DRINK a přesouváš se na pole 63!`);
            player.stats.drinks++;
        }
        document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Byl jsi přesunut z pole 46 na pole 63!</div>`;
    } else if (player.position === 47) {
        const lastPlayerPosition = Math.min(...players.map(p => p.position));
        player.position = lastPlayerPosition;
        gameAlert(`${getColoredName(player)} se přesouvá na pole ${player.position} k hráči, který je poslední.`);
    } else if (player.position === 63) {
        player.position = 46;
        showSpecialTask = false; 
        if (isCampMode) {
            gameAlert(`${getColoredName(player)} stoupl na pole 63!<br><br>Spadl jsi zpět na pole 46!<br><br>A protože jsi na 46, musíš navíc vyskočit 5x co nejvýš!`);
            player.stats.exercise++;
            document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Spadl jsi na 46! Vyskoč 5x co nejvýš!</div>`;
        } else {
            gameAlert(`${getColoredName(player)} stoupl na pole 63!<br><br>Spadl jsi zpět na pole 46!<br><br>A protože jsi na 46, musíš navíc EXNOUT DRINK!`);
            player.stats.drinks++;
            document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #e0e0e0;">Spadl jsi na 46! EXNI SVŮJ DRINK!</div>`;
        }
    } else if (player.position === 64) {
        const extraRoll = Math.floor(Math.random() * 6) + 1;
        player.stats.rolls++; 
        let msg = `${getColoredName(player)} skončil na poli 64 – Házíš znovu!<br><br>`;
        if (extraRoll % 2 === 0) {
            msg += isCampMode ? `Hodil jsi sudé číslo (${extraRoll}) – nepiješ!` : `Hodil jsi sudé číslo (${extraRoll}) – nepiješ!`;
        } else {
            msg += isCampMode ? `Hodil jsi liché číslo (${extraRoll}) – děláš 5 dřepů!` : `Hodil jsi liché číslo (${extraRoll}) – piješ!`;
            isCampMode ? player.stats.exercise++ : player.stats.drinks++;
        }
        gameAlert(msg);
    } else if (player.position === 66) {
        let resultMessage = `${getColoredName(player)} skončil na poli 66 – všichni hráči hází!<br><br>`;
        players.forEach(p => {
            const throwValue = Math.floor(Math.random() * 6) + 1;
            resultMessage += `${getColoredName(p)} hodil ${throwValue}. `;
            if (throwValue === 6) {
                resultMessage += isCampMode ? "CVIČÍ!<br>" : "Pije!<br>";
                isCampMode ? p.stats.exercise++ : p.stats.drinks++;
            } else {
                resultMessage += isCampMode ? "Necvičí.<br>" : "Nepije.<br>";
            }
        });
        gameAlert(resultMessage);
    } else if (player.position === 70) {
        player.position = 61;
        gameAlert(`${getColoredName(player)} se vrací na pole 61.`);
    }

    const netMove = player.position - startPos;
    if (netMove < 0) {
        player.stats.backwardMoved += Math.abs(netMove);
    }

    // --- AUTOMATICKÁ ANALÝZA TEXTU ÚKOLU PRO STATISTIKY ---
    const taskText = currentTasks[player.position]?.toLowerCase() || "";
    
    const drinkKw = ['pije', 'pijí', 'panák', 'exni', 'bodyshot', 'pivo', 'pivson', 'pivíčko', 'drink', 'vody', 'napít', 'nealko'];
    if (drinkKw.some(kw => taskText.includes(kw))) player.stats.drinks++;

    const exKw = ['cvičí', 'dřep', 'klik', 'žabák', 'kotrmel', 'rozcvička', 'skoč', 'most', 'prkně', 'volavka', 'oběhni'];
    if (exKw.some(kw => taskText.includes(kw))) player.stats.exercise++;

    const spicyKw = ['paliprdelkoření', 'sperma', 'kozelmeister', 'lák', 'okurek', 'citronkou', 'smykkap', 'tequilu'];
    if (spicyKw.some(kw => taskText.includes(kw))) player.stats.spicy++;

    const embKw = ['zazpívej', 'předveď', 'zvíře', 'slon', 'jazykolam', 'obejmout', 'želvu', 'bdsm', 'rým', 'pokřik'];
    if (embKw.some(kw => taskText.includes(kw))) player.stats.embarrassing++;
    
    const bodyShotKw = ['bodyshot'];
    if (bodyShotKw.some(kw => taskText.includes(kw))) player.stats.bodyShots++;
    
    if (taskText !== "" && taskText !== "nic") {
        player.stats.totalTasks++;
    }

    updatePlayerPositions();
    
    if (showSpecialTask) {
        showTask(player);
    }

    if (player.position === 71) {
        showEndGameStats(player); 
        return;
    }

    if (players.length > 1) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
}

function showEndGameStats(winner) {
    document.getElementById('game').style.display = 'none';
    const modal = document.getElementById('custom-modal');
    if (modal) modal.classList.add('hidden');

    const maxDrinks = Math.max(...players.map(p => p.stats.drinks));
    const drinker = players.filter(p => p.stats.drinks === maxDrinks && maxDrinks > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxEx = Math.max(...players.map(p => p.stats.exercise));
    const gymBro = players.filter(p => p.stats.exercise === maxEx && maxEx > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxSpicy = Math.max(...players.map(p => p.stats.spicy));
    const plechovaHuba = players.filter(p => p.stats.spicy === maxSpicy && maxSpicy > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxEmb = Math.max(...players.map(p => p.stats.embarrassing));
    const sasek = players.filter(p => p.stats.embarrassing === maxEmb && maxEmb > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxBack = Math.max(...players.map(p => p.stats.backwardMoved));
    const smolar = players.filter(p => p.stats.backwardMoved === maxBack && maxBack > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxSixes = Math.max(...players.map(p => p.stats.sixes));
    const lucky = players.filter(p => p.stats.sixes === maxSixes && maxSixes > 0).map(p => p.name).join(', ') || 'Nikdo?';

    const maxBs = Math.max(...players.map(p => p.stats.bodyShots));
    const bodyShotter = players.filter(p => p.stats.bodyShots === maxBs && maxBs > 0).map(p => p.name).join(', ') || 'Nikdo?';

    let container = document.getElementById('stats-screen-wrapper');
    if(!container) {
        container = document.createElement('div');
        container.id = 'stats-screen-wrapper';
        document.body.appendChild(container);
    }
    
    container.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); z-index: 20000; overflow-y: auto; display: flex; justify-content: center; align-items: flex-start; padding: 20px; box-sizing: border-box; backdrop-filter: blur(10px); font-family: sans-serif;";

    let statsHtml = `
    <div style="background: #111; padding: 30px; border-radius: 15px; border: 3px solid #dfb331; max-width: 900px; width: 100%; text-align: center; color: white; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 0 50px rgba(223, 179, 49, 0.5);">
        <h1 style="color: #ffd700; text-shadow: 0 0 20px #dfb331; font-size: 3em; margin-top: 0;">🏆 SÍŇ SLÁVY 🏆</h1>
        <h2 style="margin-bottom: 40px; font-size: 2em;">Vítěz: <span style="color: ${winner.color}; text-transform: uppercase;">${winner.name}</span></h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 40px;">
            
            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">${isCampMode ? '💧 Vrchní vodák' : '🍻 Pijan dne'}</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${drinker}</p>
                <p style="font-size: 0.9em; color: #aaa;">Pití plněno: ${maxDrinks > 0 ? maxDrinks : 0}x</p>
            </div>
            
            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">👅 Body shot král</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${bodyShotter}</p>
                <p style="font-size: 0.9em; color: #aaa;">Body shoty: ${maxBs > 0 ? maxBs : 0}x</p>
            </div>

            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">🏋️ Sportovec</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${gymBro}</p>
                <p style="font-size: 0.9em; color: #aaa;">Fyzické úkoly: ${maxEx > 0 ? maxEx : 0}x</p>
            </div>
            
            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">🌶️ Plechová huba</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${plechovaHuba}</p>
                <p style="font-size: 0.9em; color: #aaa;">Hnusy / Pálivé: ${maxSpicy > 0 ? maxSpicy : 0}x</p>
            </div>

            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">🎭 Šoumen</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${sasek}</p>
                <p style="font-size: 0.9em; color: #aaa;">Předvádění a zpěv: ${maxEmb > 0 ? maxEmb : 0}x</p>
            </div>

            <div style="background: #1a1a1a; border: 2px solid #dfb331; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dfb331; margin-top:0;">🌧️ Smolař</h3>
                <p style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${smolar}</p>
                <p style="font-size: 0.9em; color: #aaa;">Couval o ${maxBack > 0 ? maxBack : 0} polí</p>
            </div>

        </div>

        <h3 style="font-size: 1.5em; border-bottom: 1px solid #333; padding-bottom: 10px;">Kompletní statistiky všech týmů</h3>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #0a0a0a; border-radius: 10px; font-size: 0.95em;">
                <tr style="background: #222; color: #dfb331;">
                    <th style="padding: 12px; text-align: left;">Hráč</th>
                    <th style="padding: 12px;">🎲 Hodů</th>
                    <th style="padding: 12px;">🍻 Pití</th>
                    <th style="padding: 12px;">👅 Body shot</th>
                    <th style="padding: 12px;">🏋️ Fyzické úkoly</th>
                    <th style="padding: 12px;">🌶️ Pálivé/Hnusy</th>
                    <th style="padding: 12px;">🎭 Předvádění</th>
                    <th style="padding: 12px;">🔙 Couval</th>
                </tr>
    `;

    players.forEach(p => {
        statsHtml += `
            <tr style="border-top: 1px solid #333; text-align: center;">
                <td style="padding: 12px; color: ${p.color}; font-weight: bold; text-align: left;">${p.name}</td>
                <td style="padding: 12px;">${p.stats.rolls}</td>
                <td style="padding: 12px;">${p.stats.drinks}</td>
                <td style="padding: 12px; color: #dfb331;">${p.stats.bodyShots}</td>
                <td style="padding: 12px;">${p.stats.exercise}</td>
                <td style="padding: 12px;">${p.stats.spicy}</td>
                <td style="padding: 12px;">${p.stats.embarrassing}</td>
                <td style="padding: 12px; color: #ff4d4d;">${p.stats.backwardMoved}</td>
            </tr>
        `;
    });

    statsHtml += `
            </table>
        </div>
        <button onclick="location.reload()" style="margin-top: 40px; background: linear-gradient(90deg, #dfb331, #f7a800); color: #111; border: none; padding: 15px 30px; font-size: 18px; font-weight: bold; border-radius: 30px; cursor: pointer; text-transform: uppercase;">Zpět do menu / Nová Hra</button>
    </div>
    `;

    container.innerHTML = statsHtml;
    container.style.display = 'flex';
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
