import { voituresInitiales } from "./data.js";

// On garde seulement les voitures disponibles
const voitures = voituresInitiales.filter((v) => v.statut === "Disponible");

const mois = ["janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const joursMax = 3;

// Les éléments HTML
const formulaire = document.querySelector("#formulaire-location");
const liste = document.querySelector("#liste-voitures");
const periode = document.querySelector(".periode");
const boutons = document.querySelector(".boutons");
const resume = document.querySelector(".resume");

// Petite fonction pour créer un élément plus vite
function creer(balise, classe, texte) {
  const element = document.createElement(balise);
  if (classe) {
    element.className = classe;
  }
  if (texte !== undefined) {
    element.textContent = texte;
  }
  return element;
}


// ===== 1. LES CARTES DES VOITURES =====
function creerCartes() {
  liste.innerHTML = "";

  voitures.forEach((voiture, index) => {
    const carte = creer("label", "voiture");

    const radio = creer("input");
    radio.type = "radio";
    radio.name = "voiture";
    radio.value = voiture.id;
    if (index === 0) {
      radio.defaultChecked = true; // la première est choisie au départ
    }

    const type = creer("span", "type", voiture.categorie);
    const nom = creer("span", "nom", voiture.marque + " " + voiture.modele);
    const statut = creer("span", "statut", voiture.statut);
    const prix = creer("span", "prix", voiture.prixJour + " MAD / jour");
    const rond = creer("span", "rond");

    carte.append(radio, type, nom, statut, prix, rond);
    liste.appendChild(carte);
  });
}


// ===== 2. LA PÉRIODE =====
function creerChamp(texte, id, valeur) {
  const champ = creer("div", "champ");

  const label = creer("label", "", texte);
  label.htmlFor = id;

  const input = creer("input");
  input.id = id;
  input.type = "date";
  input.defaultValue = valeur;
  input.required = true;

  champ.append(label, input);
  return champ;
}

function creerPeriode() {
  const titre = creer("h3", "", "Votre période de location");

  const dates = creer("div", "dates");
  dates.append(
    creerChamp("Date de début *", "debut", "2026-11-10"),
    creerChamp("Date de fin *", "fin", "2026-11-12")
  );

  const info = creer("p", "info");

  periode.append(titre, dates, info);
}


// ===== 3. LES BOUTONS =====
function creerBoutons() {
  const recommencer = creer("button", "btn blanc", "Recommencer");
  recommencer.type = "reset";

  const suivant = creer("button", "btn bleu", "Suivant");
  suivant.type = "submit";

  boutons.append(recommencer, suivant);
}


// ===== 4. FONCTIONS UTILES =====
function voitureChoisie() {
  if (!formulaire.voiture) {
    return null; // aucune voiture disponible
  }
  const id = Number(formulaire.voiture.value);
  return voitures.find((v) => v.id === id);
}
function limiterDateFin() {
  const debut = document.querySelector("#debut");
  const fin = document.querySelector("#fin");

  fin.min = debut.value;   // fin ma tkounch qbl debut

  if (debut.value !== "") {
    const max = new Date(debut.value);
    max.setUTCDate(max.getUTCDate() + joursMax - 1);
    fin.max = max.toISOString().split("T")[0];   // ex : "2026-11-12"
  }
}
function calculerJours() {
  const debut = document.querySelector("#debut").value;
  const fin = document.querySelector("#fin").value;

  if (debut === "" || fin === "") {
    return 0;
  }

  const diff = (new Date(fin) - new Date(debut)) / 86400000;
  if (diff < 0) {
    return 0;
  }
  return diff + 1; // +1 car les dates sont incluses
}

function formaterDates(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);

  const finTexte = b.getUTCDate() + " " + mois[b.getUTCMonth()] + " " + b.getUTCFullYear();

  if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()) {
    return a.getUTCDate() + " → " + finTexte;
  }
  return a.getUTCDate() + " " + mois[a.getUTCMonth()] + " → " + finTexte;
}


  function afficherDuree(jours) {
  const info = document.querySelector(".periode .info");
  const debut = document.querySelector("#debut").value;
  const fin = document.querySelector("#fin").value;

  if (debut === "" || fin === "") {
    info.textContent = "Veuillez choisir les deux dates.";
  } else if (jours === 0) {
    info.textContent = "La date de fin doit être après la date de début.";
  } else if (jours > joursMax) {
    info.textContent = "La durée maximale est de " + joursMax + " jours.";
  } else {
    const s = jours > 1 ? "s" : "";
    info.textContent =
      "Durée : " + jours + " jour" + s + ". Les dates de début et de fin sont incluses.";
  }
}



// ===== 5. LE RÉSUMÉ =====
function creerResume() {
  resume.innerHTML = "";

  const voiture = voitureChoisie();
  if (!voiture) {
    resume.append(creer("p", "gris", "Aucune voiture disponible."));
    return;
  }

  const jours = calculerJours();
  const valide = jours > 0 && jours <= joursMax;
  const total = jours * voiture.prixJour;
  const s = jours > 1 ? "s" : "";

  const debut = document.querySelector("#debut").value;
  const fin = document.querySelector("#fin").value;

  // ligne 1 : véhicule
  const ligne1 = creer("div", "ligne");
  ligne1.append(
    creer("span", "", valide ? "Véhicule · " + jours + " × " + voiture.prixJour + " MAD" : "Véhicule"),
    creer("b", "", valide ? total + " MAD" : "—")
  );

  // ligne 2 : récupération
  const ligne2 = creer("div", "ligne");
  ligne2.append(creer("span", "", "Récupération"), creer("b", "", "Gratuite"));

  // total
  const totalbox = creer("div", "total");
  totalbox.append(
    creer("span", "", "Total estimé"),
    creer("strong", "", valide ? total + " MAD" : "—")
  );

  resume.append(
    creer("p", "eyebrow", "VOTRE LOCATION"),
    creer("h2", "", voiture.marque + " " + voiture.modele),
    creer("p", "sous-titre", voiture.categorie + " · " + voiture.prixJour + " MAD / jour"),
    creer("hr"),
    creer("p", "date", valide ? formaterDates(debut, fin) : "Dates à choisir"),
    creer("p", "gris", valide ? jours + " jour" + s + " · dates incluses" : ""),
    ligne1,
    ligne2,
    creer("hr"),
    totalbox,
    creer("p", "gris", "Frais de récupération facturés une seule fois."),
    creer("p", "info gris-fond", "Une demande, sans paiement en ligne.")
  );
}


// ===== 6. METTRE À JOUR =====

function mettreAJour() {
  limiterDateFin();
  afficherDuree(calculerJours());
  creerResume();
}
// Quand on change la voiture ou une date
formulaire.addEventListener("input", mettreAJour);

// "Recommencer" : on attend que le formulaire se réinitialise
formulaire.addEventListener("reset", () => {
  setTimeout(mettreAJour, 0);
});

// "Suivant"

  formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  const jours = calculerJours();

  if (jours === 0 || jours > joursMax) {
    alert("Veuillez choisir une période de 1 à " + joursMax + " jours.");
    return;
  }
  alert("Étape suivante : Récupération");
});


// ===== 7. DÉMARRAGE =====
creerCartes();
creerPeriode();
creerBoutons();
mettreAJour();