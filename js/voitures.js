
import { voituresInitiales } from "./data.js";

// Les element HTML
const formulaire = document.querySelector("#formulaire-voiture");
const marque = document.querySelector("#marque");
const modele = document.querySelector("#modele");
const immatricule = document.querySelector("#immatriculation");
const categorie = document.querySelector("#categorie");
const prix = document.querySelector("#prix-jour");
const statut = document.querySelector("#statut");
const listeVoitures = document.querySelector("#liste-voitures");
const boutonEnregistrer = document.querySelector("#bouton-enregistrer");
const boutonAnnuler = document.querySelector("#annuler-modification");

let voitures = [...voituresInitiales];
let idModifier = null;

// AFFICHER LES VOITURES
function afficherVoitures() {
  listeVoitures.innerHTML = "";

  voitures.forEach((voiture) => {
    const ligne = document.createElement("tr");

    const infosmarque = document.createElement("td");
    const infosmodele = document.createElement("td");
    const infosimmatricule = document.createElement("td");
    const infoscategorie = document.createElement("td");
    const infosStatut = document.createElement("td");
    const infosPrix = document.createElement("td");
    const infosAction = document.createElement("td");

    // Afficher les informations
    infosmarque.textContent = voiture.marque;
    infosmodele.textContent = voiture.modele;
    infosimmatricule.textContent = voiture.immatriculation;
    infoscategorie.textContent = voiture.categorie;
    infosStatut.textContent = voiture.statut;
    infosPrix.textContent = voiture.prixJour;

    // Bouton Supprimer
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.type = "button";
    boutonSupprimer.classList.add("button", "button-delete");

    boutonSupprimer.addEventListener("click", () => {
      const confirmation = confirm(
        "Tu es sure de vouloir supprimer cette voiture ?"
      );

      if (!confirmation) {
        return;
      }

      voitures = voitures.filter((v) => v.id !== voiture.id);

      if (idModifier === voiture.id) {
        formulaire.reset();
        idModifier = null;
        boutonEnregistrer.textContent = "Ajouter la voiture";
        boutonAnnuler.hidden = true;
      }

      afficherVoitures();
    });

    // Bouton Modifier
    const boutonModifier = document.createElement("button");
    boutonModifier.textContent = "Modifier";
    boutonModifier.type = "button";
    boutonModifier.classList.add("button", "button-edit");

    boutonModifier.addEventListener("click", () => {
      idModifier = voiture.id;

      marque.value = voiture.marque;
      modele.value = voiture.modele;
      immatricule.value = voiture.immatriculation;
      categorie.value = voiture.categorie;
      prix.value = voiture.prixJour;
      statut.value = voiture.statut;

      boutonEnregistrer.textContent = "Enregistrer les modifications";
      boutonAnnuler.hidden = false;
    });

    infosAction.append(boutonModifier, boutonSupprimer);

    ligne.append(
      infosmarque,
      infosmodele,
      infosimmatricule,
      infoscategorie,
      infosPrix,
      infosStatut,
      infosAction
    );


    listeVoitures.appendChild(ligne);
  });
}


afficherVoitures();






formulaire.addEventListener("submit", (event) => {
  event.preventDefault();


  const valeurMarque = marque.value.trim();
  const valeurModele = modele.value.trim();
  const valeurImmatricule = immatricule.value.trim();
  const valeurPrix = Number(prix.value);

  if (
    valeurMarque === "" ||
    valeurModele === "" ||
    valeurImmatricule === "" ||
    categorie.value === "" ||
    statut.value === "" ||
    prix.value.trim() === ""
  ) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  
 //prix est positif
  if (Number(prix.value) <= 0) {
    alert("Le prix doit être supérieur à zéro.");
    return;
  }
  // Verifier si la matricule exist deja
  const existe = voitures.some((voiture) => {
    return (
      voiture.immatriculation.toLowerCase() ===
        valeurImmatricule.toLowerCase() &&
      voiture.id !== idModifier
    );
  });

  if (existe) {
    alert("Cette immatriculation existe déjà.");
    return;
  }

  if (idModifier !== null) {
    // MODIFIER une voiture existante
    const voiture = voitures.find((vt) => vt.id === idModifier);

    if (!voiture) {
      alert("Voiture introuvable.");
      return;
    }

    voiture.marque = valeurMarque;
    voiture.modele = valeurModele;
    voiture.immatriculation = valeurImmatricule;
    voiture.categorie = categorie.value;
    voiture.prixJour = valeurPrix;
    voiture.statut = statut.value;

    alert("Voiture modifiée avec succès !");
  } else {
    // AJOUTER une nouvelle voiture
    const nouvelId =
      Math.max(0, ...voitures.map((voiture) => voiture.id)) + 1;

    const nouvellevoiture = {
      id: nouvelId,
      marque: valeurMarque,
      modele: valeurModele,
      immatriculation: valeurImmatricule,
      categorie: categorie.value,
      prixJour: valeurPrix,
      statut: statut.value,
    };

    voitures.push(nouvellevoiture);

    alert("Voiture ajoutée avec succès !");
  }

  // Actualiser le tableau
  afficherVoitures();
  formulaire.reset();
  idModifier = null;
  boutonEnregistrer.textContent = "Ajouter la voiture";
  boutonAnnuler.hidden = true;
});

// ANNULER LA MODIFICATION
boutonAnnuler.addEventListener("click", () => {
  formulaire.reset();
  idModifier = null;
  boutonEnregistrer.textContent = "Ajouter la voiture";
  boutonAnnuler.hidden = true;
});








