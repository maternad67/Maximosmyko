function movePlayer(steps) {
  const player = players[currentPlayerIndex];
  player.position += steps;
  let showSpecialTask = true; // Zabrání vypsání zmateného textu při skoku na portál

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
  } else if (player.position === 22) {
    player.position -= 2;
    alert(`${player.name} skončil na poli 22 a vrací se na pole ${player.position}.`);
  } else if (player.position === 24) {
    alert("Piješ! a posouváš se na pole 26");
    player.position = 26;
  } else if (player.position === 37) {
    const random = Math.floor(Math.random() * 6) + 1;
    alert(`${player.name} hodil ${random} a vrací se o tolik zpět.`);
    player.position -= random;
    if (player.position < 0) player.position = 0;
  } else if (player.position === 46) {
    alert(`Úkol z pole 46: Exni svůj drink a přesouváš se na 63!`);
    player.position = 63;
    showSpecialTask = false; // Zabrání výpisu textu cílového políčka 63
    document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #111;">Byl jsi přesunut z pole 46 na pole 63!</div>`;
  } else if (player.position === 47) {
    const lastPlayerPosition = players[(currentPlayerIndex - 1 + players.length) % players.length].position;
    player.position = lastPlayerPosition;
    alert(`${player.name} se přesouvá na pole ${player.position} k předchozímu hráči.`);
  } else if (player.position === 63) {
    alert(`Úkol z pole 63: Přesouváš se zpět na pole 46!`);
    player.position = 46;
    showSpecialTask = false; // Zabrání výpisu textu cílového políčka 46
    document.getElementById('task-text').innerHTML = `<div style="font-size: 1.3em; font-weight: bold; color: #111;">Spadl jsi z pole 63 zpět na pole 46!</div>`;
  } else if (player.position === 64) {
    // OPRAVENO: Hráč nyní opravdu hází znovu novou kostkou
    alert(`${player.name} skončil na poli 64 – Házíš znovu!`);
    const extraRoll = Math.floor(Math.random() * 6) + 1;
    if (extraRoll % 2 === 0) {
      alert(`Hodil jsi sudé číslo (${extraRoll}) – nepiješ!`);
    } else {
      alert(`Hodil jsi liché číslo (${extraRoll}) – piješ!`);
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
  
  // Ukáže úkol, pouze pokud nešlo o přeskok mezi 46 a 63
  if (showSpecialTask) {
    showTask(player);
  }

  if (player.position === 71) {
    alert(`Gratulujeme! ${player.name} vyhrál!`);
    resetGame();
    return;
  }

  if (players.length > 1) {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
}
