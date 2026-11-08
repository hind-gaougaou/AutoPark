import { voituresInitiales } from "./data.js";

//  les voitures disponibles
const voitures = voituresInitiales.filter(function (v) {
  return v.statut === "Disponible";
});

const mois = ["janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// Dure maximale de location (en jours)
const joursMax = 3;


const formulaire = document.querySelector("#formulaire-location");
const liste = document.querySelector("#liste-voitures");
const periode = document.querySelector(".periode");
const boutons = document.querySelector(".boutons");
const resume = document.querySelector(".resume");


// =====  LES CARTES DES VOITURES =====
function creerCartes() {
  liste.innerHTML = "";

  voitures.forEach(function (voiture, index) {
    const carte = document.createElement("label");
    carte.className = "voiture";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "voiture";
    radio.value = voiture.id;
    if (index === 0) {
      radio.defaultChecked = true; 
    }

    const type = document.createElement("span");
    type.className = "type";
    type.textContent = voiture.categorie;

    const nom = document.createElement("span");
    nom.className = "nom";
    nom.textContent = voiture.marque + " " + voiture.modele;

    const statut = document.createElement("span");
    statut.className = "statut";
    statut.textContent = voiture.statut;

    const prix = document.createElement("span");
    prix.className = "prix";
    prix.textContent = voiture.prixJour + " MAD / jour";

    const rond = document.createElement("span");
    rond.className = "rond";

    carte.append(radio, type, nom, statut, prix, rond);
    liste.appendChild(carte);
  });
}


// ===== LA PeRIODE =====
function creerPeriode() {
  const titre = document.createElement("h3");
  titre.textContent = "Votre période de location";

  const dates = document.createElement("div");
  dates.className = "dates";

  // date de début
  const champDebut = document.createElement("div");
  champDebut.className = "champ";

  const labelDebut = document.createElement("label");
  labelDebut.textContent = "Date de début *";
  labelDebut.htmlFor = "debut";

  const inputDebut = document.createElement("input");
  inputDebut.id = "debut";
  inputDebut.type = "date";
  inputDebut.defaultValue = "2026-11-10";
  inputDebut.required = true;

  champDebut.append(labelDebut, inputDebut);

  // date de fin
  const champFin = document.createElement("div");
  champFin.className = "champ";

  const labelFin = document.createElement("label");
  labelFin.textContent = "Date de fin *";
  labelFin.htmlFor = "fin";

  const inputFin = document.createElement("input");
  inputFin.id = "fin";
  inputFin.type = "date";
  inputFin.defaultValue = "2026-11-12";
  inputFin.required = true;

  champFin.append(labelFin, inputFin);

  // message de duree
  const info = document.createElement("p");
  info.className = "info";

  dates.append(champDebut, champFin);
  periode.append(titre, dates, info);
}


// =====  LES BOUTONS =====
function creerBoutons() {
  const recommencer = document.createElement("button");
  recommencer.type = "reset";
  recommencer.className = "btn blanc";
  recommencer.textContent = "Recommencer";

  const suivant = document.createElement("button");
  suivant.type = "submit";
  suivant.className = "btn bleu";
  suivant.textContent = "Suivant";

  boutons.append(recommencer, suivant);
}


// =====  FONCTIONS UTILES =====
function voitureChoisie() {
  if (!formulaire.voiture) {
    return null; // aucune voiture disponible
  }

  const id = Number(formulaire.voiture.value);

  return voitures.find(function (v) {
    return v.id === id;
  });
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

// La date de fin ne peut pas depasser 3 jours après le début
function limiterDateFin() {
  const debut = document.querySelector("#debut");
  const fin = document.querySelector("#fin");

  fin.min = debut.value;

  if (debut.value !== "") {
    const max = new Date(debut.value);
    max.setUTCDate(max.getUTCDate() + joursMax - 1);
    fin.max = max.toISOString().split("T")[0]; // ex : "2026-11-12"
  }
}

function formaterDates(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);

  const finTexte =
    b.getUTCDate() + " " + mois[b.getUTCMonth()] + " " + b.getUTCFullYear();

  if (
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear()
  ) {
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
    let s = "";
    if (jours > 1) {
      s = "s";
    }
    info.textContent =
      "Durée : " + jours + " jour" + s + ". Les dates de début et de fin sont incluses.";
  }
}


// =====  LE ReSUMe=====
function creerResume() {
  resume.innerHTML = "";

  const voiture = voitureChoisie();

  if (!voiture) {
    const vide = document.createElement("p");
    vide.className = "gris";
    vide.textContent = "Aucune voiture disponible.";
    resume.appendChild(vide);
    return;
  }

  const jours = calculerJours();
  const valide = jours > 0 && jours <= joursMax;
  const total = jours * voiture.prixJour;

  let s = "";
  if (jours > 1) {
    s = "s";
  }

  const debut = document.querySelector("#debut").value;
  const fin = document.querySelector("#fin").value;

  const titre = document.createElement("p");
  titre.className = "eyebrow";
  titre.textContent = "VOTRE LOCATION";

  const nomVoiture = document.createElement("h2");
  nomVoiture.textContent = voiture.marque + " " + voiture.modele;

  const sousTitre = document.createElement("p");
  sousTitre.className = "sous-titre";
  sousTitre.textContent = voiture.categorie + " · " + voiture.prixJour + " MAD / jour";

  const trait1 = document.createElement("hr");

  const date = document.createElement("p");
  date.className = "date";
  if (valide) {
    date.textContent = formaterDates(debut, fin);
  } else {
    date.textContent = "Dates à choisir";
  }

  const nbJours = document.createElement("p");
  nbJours.className = "gris";
  if (valide) {
    nbJours.textContent = jours + " jour" + s + " · dates incluses";
  }

  // ligne 1 : véhicule
  const ligne1 = document.createElement("div");
  ligne1.className = "ligne";

  const vehicule = document.createElement("span");
  vehicule.textContent = "Véhicule";

  const prixVehicule = document.createElement("b");
  prixVehicule.textContent = "—";

  if (valide) {
    vehicule.textContent = "Véhicule · " + jours + " × " + voiture.prixJour + " MAD";
    prixVehicule.textContent = total + " MAD";
  }
  ligne1.append(vehicule, prixVehicule);

  // ligne 2 : recuperation
  const ligne2 = document.createElement("div");
  ligne2.className = "ligne";

  const recuperation = document.createElement("span");
  recuperation.textContent = "Récupération";

  const gratuite = document.createElement("b");
  gratuite.textContent = "Gratuite";

  ligne2.append(recuperation, gratuite);

  const trait2 = document.createElement("hr");

  // total
  const boiteTotal = document.createElement("div");
  boiteTotal.className = "total";

  const texteTotal = document.createElement("span");
  texteTotal.textContent = "Total estimé";

  const prixTotal = document.createElement("strong");
  prixTotal.textContent = "—";
  if (valide) {
    prixTotal.textContent = total + " MAD";
  }

  boiteTotal.append(texteTotal, prixTotal);

  // notes
  const note1 = document.createElement("p");
  note1.className = "gris";
  note1.textContent = "Frais de récupération facturés une seule fois.";

  const note2 = document.createElement("p");
  note2.className = "info gris-fond";
  note2.textContent = "Une demande, sans paiement en ligne.";

  resume.append(
    titre,
    nomVoiture,
    sousTitre,
    trait1,
    date,
    nbJours,
    ligne1,
    ligne2,
    trait2,
    boiteTotal,
    note1,
    note2
  );
}


// ===== 6. METTRE a JOUR =====
function mettreAJour() {
  limiterDateFin();
  afficherDuree(calculerJours());
  creerResume();
}

// Quand on change la voiture ou une date
formulaire.addEventListener("input", mettreAJour);

// "Recommencer" : on attend que le formulaire se reinitialise
formulaire.addEventListener("reset", function () {
  setTimeout(mettreAJour, 0);
});

// "Suivant"
formulaire.addEventListener("submit", function (event) {
  event.preventDefault();

  const jours = calculerJours();

  if (jours === 0 || jours > joursMax) {
    alert("Veuillez choisir une période de 1 à " + joursMax + " jours.");
    return;
  }
  alert("Étape suivante : Récupération");
});


creerCartes();
creerPeriode();
creerBoutons();
mettreAJour();