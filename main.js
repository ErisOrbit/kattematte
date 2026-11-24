let poeng = 0;
let riktigSvar = 0;
let naavaerendeNivaa = "lett";
let tidIgjen = 60;
let timerInterval;
let lydPaa = true;
let spillAktivt = false;
let pausertTid = 60;
let pausetOppgave = "";

const bakgrunnMusikk = new Audio("./zephiramusic-lofi-gaming-606302.mp3");
bakgrunnMusikk.loop = true;
bakgrunnMusikk.volume = 0.35;

function startBakgrunnMusikk() {
  if (!lydPaa) return;
  bakgrunnMusikk.play().catch(() => {});
}

window.addEventListener("DOMContentLoaded", startBakgrunnMusikk);
window.addEventListener("load", startBakgrunnMusikk);
window.addEventListener("pointerdown", startBakgrunnMusikk, { once: true });
window.addEventListener("keydown", startBakgrunnMusikk, { once: true });

function startSpill(nivaa) {
  naavaerendeNivaa = nivaa;
  poeng = 0;
  spillAktivt = true;
  oppdaterPoeng();
  lagNyOppgave();
  startTimer();
  document.getElementById("katte-melding").innerText =
    "Lykke til! Velg riktig svar.";
  oppdaterLydKnapp();
}

function lagNyOppgave() {
  let tall1, tall2;

  if (naavaerendeNivaa === "lett") {
    
    riktigSvar = Math.floor(Math.random() * 9) + 2;
    tall1 = Math.floor(Math.random() * (riktigSvar - 1)) + 1;
    tall2 = riktigSvar - tall1;
  } else if (naavaerendeNivaa === "middels") {
    tall1 = Math.floor(Math.random() * 25) + 1;
    tall2 = Math.floor(Math.random() * 25) + 1;
    riktigSvar = tall1 + tall2;
  } else {
    tall1 = Math.floor(Math.random() * 50) + 1;
    tall2 = Math.floor(Math.random() * 50) + 1;
    riktigSvar = tall1 + tall2;
  }


  document.getElementById("oppgave-tekst").innerText = `${tall1} + ${tall2} =`;


  let alternativer = [riktigSvar];
  while (alternativer.length < 4) {
    let feilSvar;
    if (naavaerendeNivaa === "lett") {

      feilSvar = Math.floor(Math.random() * 10) + 1;
    } else {
      feilSvar = riktigSvar + (Math.floor(Math.random() * 10) - 5);
    }

    if (
      feilSvar !== riktigSvar &&
      feilSvar >= 0 &&
      !alternativer.includes(feilSvar)
    ) {
      alternativer.push(feilSvar);
    }
  }
 
  alternativer.sort(() => Math.random() - 0.5);

  
  let knapper = document.querySelectorAll(".spill-knapp");
  knapper.forEach((knapp, index) => {
    knapp.disabled = false;
    knapp.innerText = alternativer[index];
    knapp.style.backgroundColor = "#4DB6AC"; 
  });
}

function sjekkSvar(valgtKnapp) {
  if (!spillAktivt) return;

  let valgtTall = parseInt(valgtKnapp.innerText);
  if (isNaN(valgtTall)) return;

  if (valgtTall === riktigSvar) {
    poeng++;
    oppdaterPoeng();
    tidIgjen = Math.min(60, tidIgjen + 15);
    document.getElementById("katte-melding").innerText =
      "Riktig svar!";
    lagNyOppgave();
  } else {
    valgtKnapp.style.backgroundColor = "#e57373";
    tidIgjen = Math.max(0, tidIgjen - 10);
    oppdaterTid();
    document.getElementById("katte-melding").innerText =
      "Oi, det ble feil. Prøv igjen!";
    if (tidIgjen === 0) avsluttSpill();
  }
}

function startTimer() {
  clearInterval(timerInterval);
  tidIgjen = 60;
  oppdaterTid();

  timerInterval = setInterval(() => {
    tidIgjen = Math.max(0, tidIgjen - 1);
    oppdaterTid();
    if (tidIgjen === 0) avsluttSpill();
  }, 300);
}

function oppdaterTid() {
  document.getElementById("tid-bar").value = tidIgjen;
}

function avsluttSpill() {
  if (!spillAktivt) return;

  spillAktivt = false;
  clearInterval(timerInterval);
  tidIgjen = 0;
  oppdaterTid();
  document.querySelectorAll(".spill-knapp").forEach((knapp) => {
    knapp.disabled = true;
  });
  document.getElementById("oppgave-tekst").innerText = "Tiden er ute!";
  document.getElementById("katte-melding").innerText =
    `Du fikk ${poeng} poeng! Velg et nivå over for å spille igjen.`;
}

function oppdaterPoeng() {
  document.getElementById("poeng-tekst").innerText = `Poeng: ${poeng}`;
}

function byttLyd() {
  lydPaa = !lydPaa;
  if (lydPaa) {
    bakgrunnMusikk.play().catch(() => {});
  } else {
    bakgrunnMusikk.pause();
  }
  oppdaterLydKnapp();
}

function oppdaterLydKnapp() {
  const lydKnapp = document.getElementById("lyd-knapp");
  if (lydKnapp) {
    lydKnapp.innerText = lydPaa ? "🔊" : "🔇";
    lydKnapp.setAttribute("aria-label", lydPaa ? "Slå lyd av" : "Slå lyd på");
  }
}

function visMeny() {
  spillAktivt = false;
  pausertTid = tidIgjen;
  pausetOppgave = document.getElementById("oppgave-tekst").innerText;
  clearInterval(timerInterval);
  document.querySelectorAll(".spill-knapp").forEach((knapp) => {
    knapp.disabled = true;
  });
  document.getElementById("oppgave-tekst").innerText = "Pause";
  document.getElementById("katte-melding").innerText =
    "Spillet er pause.";
  document.getElementById("pause-meny").hidden = false;
}

function fortsettSpill() {
  document.getElementById("pause-meny").hidden = true;
  spillAktivt = true;
  tidIgjen = pausertTid;
  oppdaterTid();
  document.querySelectorAll(".spill-knapp").forEach((knapp) => {
    knapp.disabled = false;
  });
  document.getElementById("oppgave-tekst").innerText =
    pausetOppgave || "Spillet fortsetter!";
  document.getElementById("katte-melding").innerText =
    "Spillet fortsetter!";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    tidIgjen = Math.max(0, tidIgjen - 1);
    oppdaterTid();
    if (tidIgjen === 0) avsluttSpill();
  }, 300);
}
