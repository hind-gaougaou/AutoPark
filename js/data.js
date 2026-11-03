// Données fictives fournies. Ne pas modifier ce tableau lors des opérations CRUD.
// Chaque voiture possède un identifiant unique.
export const voituresInitiales = [
  {
    "id": 1,
    "marque": "Dacia",
    "modele": "Sandero",
    "immatriculation": "AUTO-001",
    "categorie": "Citadine",
    "prixJour": 250,
    "statut": "Disponible"
  },
  {
    "id": 2,
    "marque": "Renault",
    "modele": "Mégane",
    "immatriculation": "AUTO-002",
    "categorie": "Berline",
    "prixJour": 380,
    "statut": "Louée"
  },
  {
    "id": 3,
    "marque": "Hyundai",
    "modele": "Tucson",
    "immatriculation": "AUTO-003",
    "categorie": "SUV",
    "prixJour": 550,
    "statut": "En maintenance"
  },
  {
    "id": 4,
    "marque": "Peugeot",
    "modele": "208",
    "immatriculation": "AUTO-004",
    "categorie": "Citadine",
    "prixJour": 280,
    "statut": "Disponible"
  },
  {
    "id": 5,
    "marque": "Toyota",
    "modele": "Corolla",
    "immatriculation": "AUTO-005",
    "categorie": "Berline",
    "prixJour": 420,
    "statut": "Louée"
  },
  {
    "id": 6,
    "marque": "Dacia",
    "modele": "Duster",
    "immatriculation": "AUTO-006",
    "categorie": "SUV",
    "prixJour": 450,
    "statut": "Disponible"
  }
];

bouttonsuprimer.addeventlisteninner("click",(event)=>{

let confirmation = confirm("tu essure pour la supprission");
if(!confirmation){
  return;
}


const voitures = voitures.filtrer((v), v.id !==voitures.id)

})


