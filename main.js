let poeng = 0;
let riktigSvar = 0;
let naavaerendeNivaa = "lett";
let tidIgjen = 100;
let timerInterval;
let lydPaa = true;

function startSpill(nivaa) {
  naavaerendeNivaa = nivaa;
  poeng = 0;
  oppdaterPoeng();
  lagNyOppgave();
  startTimer();
  document.getElementById("katte-melding").innerText =
    "Lykke til! Velg riktig svar.";
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
    knapp.innerText = alternativer[index];
    knapp.style.backgroundColor = "#4DB6AC"; 
  });
}

function sjekkSvar(valgtKnapp) {
  let valgtTall = parseInt(valgtKnapp.innerText);
  if (isNaN(valgtTall)) return;

  if (valgtTall === riktigSvar) {
    poeng++;
    oppdaterPoeng();
    tidIgjen = Math.min(100, tidIgjen + 15);
    document.getElementById("katte-melding").innerText =
      "Riktig svar!";
    lagNyOppgave();
  } else {
    valgtKnapp.style.backgroundColor = "#e57373";
    tidIgjen = Math.max(0, tidIgjen - 10);
    document.getElementById("katte-melding").innerText =
      "Oi, det ble feil. Prøv igjen!";
  }
}

function startTimer() {
  clearInterval(timerInterval);
  tidIgjen = 100;
  const tidBar = document.getElementById("tid-bar");

  timerInterval = setInterval(() => {
    tidIgjen -= 1;
    tidBar.value = tidIgjen;

    if (tidIgjen <= 0) {
      clearInterval(timerInterval);
      document.getElementById("oppgave-tekst").innerText = "Tiden er ute!";
      document.getElementById("katte-melding").innerText =
        `Du fikk ${poeng} poeng! Velg et nivå for å spille igjen.`;
    }
  }, 300);
}

function oppdaterPoeng() {
  document.getElementById("poeng-tekst").innerText = `Poeng: ${poeng}`;
}

function byttLyd() {
  lydPaa = !lydPaa;
  alert(lydPaa ? "Lyd er nå PÅ" : "Lyd er nå AV");
}

function visMeny() {
  clearInterval(timerInterval);
  document.getElementById("oppgave-tekst").innerText = "Pause / Meny";
  document.getElementById("katte-melding").innerText =
    "Velg et nivå øverst for å starte på nytt.";
}
