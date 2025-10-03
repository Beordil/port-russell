// FR : On importe mongoose pour définir un schéma et un modèle
// EN : Import mongoose to define a schema and a model
const mongoose = require('mongoose');

// FR : Définition du schéma Reservation
// EN : Definition of the Reservation schema
const reservationSchema = new mongoose.Schema(
  {
    // FR : Numéro du catway associé à la réservation (≥ 1, requis)
    // EN : Catway number linked to the reservation (≥ 1, required)
    catwayNumber: { type: Number, required: true, min: 1 },

    // FR : Nom du client (obligatoire, longueur entre 2 et 100 caractères)
    // EN : Client name (required, length between 2 and 100 characters)
    clientName:   { type: String, required: true, minlength: 2, maxlength: 100 },

    // FR : Nom du bateau (obligatoire, longueur entre 2 et 100 caractères)
    // EN : Boat name (required, length between 2 and 100 characters)
    boatName:     { type: String, required: true, minlength: 2, maxlength: 100 },

    // FR : Date de début de la réservation (requis)
    // EN : Start date of the reservation (required)
    startDate:    { type: Date,   required: true },

    // FR : Date de fin de la réservation (requis)
    // EN : End date of the reservation (required)
    endDate:      { type: Date,   required: true }

    // FR : Champ optionnel (ex: email du client) si besoin plus tard
    // EN : Optional field (e.g., customer email) if needed later
    // customerEmail: { type: String }
  },
  { 
    // FR : Ajoute automatiquement createdAt et updatedAt
    // EN : Automatically adds createdAt and updatedAt
    timestamps: true 
  }
);

// FR : Exporte le modèle "Reservation" basé sur ce schéma
// EN : Export the "Reservation" model based on this schema
module.exports = mongoose.model('Reservation', reservationSchema);
