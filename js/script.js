// Variables globales
let isAnalyzing = false;
// Configuration du serveur Prolog
const PROLOG_SERVER = "http://localhost:8080";

// Animation d'introduction
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    startIntroAnimation();
  }, 800);
});

function startIntroAnimation() {
  const introOverlay = document.getElementById("introOverlay");
  const mainInterface = document.getElementById("mainInterface");

  introOverlay.classList.add("slide-up");

  setTimeout(function () {
    mainInterface.classList.add("visible");
    document.body.style.overflow = "auto";
  }, 800);
}

// Fonction d'enquete
async function analyzeCase() {
  if (isAnalyzing) return;

  const suspect = document.getElementById("suspect").value;
  const crime = document.getElementById("crime").value;

  if (!suspect || !crime) {
    showError("Veuillez sélectionner un suspect et un type de crime.");
    return;
  }

  try {
    isAnalyzing = true;
    hideError();
    hideResult();
    showLoading();

    // Animation de progression
    await animateProgress();

    // Appel au serveur Prolog
    const result = await checkCrimeWithProlog(suspect, crime);

    // Affichage du résultat avec animation
    await showResult(result, suspect, crime);
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    showError(
      "Erreur de connexion au serveur Prolog. Vérifiez que le serveur est démarré sur le port 8080."
    );
  } finally {
    isAnalyzing = false;
    hideLoading();
  }
}

// Appel au serveur Prolog
async function checkCrimeWithProlog(suspect, crime) {
  const response = await fetch(`${PROLOG_SERVER}/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      suspect: suspect,
      crime: crime,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

// Animation de progression
function animateProgress() {
  return new Promise((resolve) => {
    const progressBar = document.getElementById("loadingProgress");
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;

      if (progress >= 100) {
        progress = 100;
        progressBar.style.width = "100%";
        clearInterval(interval);
        setTimeout(resolve, 500);
      } else {
        progressBar.style.width = progress + "%";
      }
    }, 200);
  });
}

// Affichage du résultat
async function showResult(result, suspect, crime) {
  const resultDiv = document.getElementById("result");
  const resultText = document.getElementById("resultText");

  // Préparation du texte
  const suspectName = suspect.charAt(0).toUpperCase() + suspect.slice(1);
  const crimeType = crime.charAt(0).toUpperCase() + crime.slice(1);

  let displayText, className;
  const liaison = crime.charAt(0) === "v" ? "de " : "d'";

  if (result === "GUILTY") {
    displayText = `COUPABLE IDENTIFIÉ (GUILTY)<br><span style="font-size: 0.7em;">Le suspect ${suspectName} est coupable ${liaison}${crimeType}</span>`;
    className = "result-guilty";
    playAlertSound();
  } else {
    displayText = `NON COUPABLE (NOT GUILTY)<br><span style="font-size: 0.7em;">Le suspect ${suspectName} n'est pas coupable ${liaison}${crimeType}</span>`;
    className = "result-not-guilty";
  }

  // Animation d'apparition
  resultDiv.style.display = "block";
  resultDiv.className = "result-display " + className;

  // Effet de frappe
  await typewriterEffect(resultText, displayText, 50);
}

// Effet de frappe
function typewriterEffect(element, text, speed) {
  return new Promise((resolve) => {
    element.innerHTML = "";
    let i = 0;

    function type() {
      if (i < text.length) {
        if (text.substr(i, 4) === "<br>") {
          element.innerHTML += "<br>";
          i += 4;
        } else if (text.charAt(i) === "<") {
          const endTag = text.indexOf(">", i);
          element.innerHTML += text.substring(i, endTag + 1);
          i = endTag + 1;
        } else {
          element.innerHTML += text.charAt(i);
          i++;
        }
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
}

// Gestion de l'affichage
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("loadingProgress").style.width = "0%";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function hideError() {
  document.getElementById("errorMessage").style.display = "none";
}

function hideResult() {
  document.getElementById("result").style.display = "none";
}

// Son d'alerte pour les coupables
function playAlertSound() {
  // Création d'un son simple avec Web Audio API
  if (
    typeof AudioContext !== "undefined" ||
    typeof webkitAudioContext !== "undefined"
  ) {
    const audioContext = new (AudioContext || webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);

    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode2.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator2.start();
      oscillator2.stop(audioContext.currentTime + 0.2);
    }, 300);
  }
}

// Test de connexion au démarrage
window.addEventListener("load", async function () {
  try {
    await fetch(`${PROLOG_SERVER}/check`, {
      method: "OPTIONS",
    });
    console.log("Connexion au serveur Prolog établie");
  } catch (error) {
    console.warn(
      "Serveur Prolog non accessible. Assurez-vous qu'il fonctionne sur le port 8080."
    );
    showError(
      'Serveur Prolog non accessible. Lancez le serveur avec "?- main." dans SWI-Prolog.'
    );
  }
});
