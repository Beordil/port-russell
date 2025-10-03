// FR : On importe mongoose pour définir un schéma et un modèle
// EN : Import mongoose to define a schema and a model
const mongoose = require('mongoose');

// FR : Définition du schéma Catway
// EN : Definition of the Catway schema
const catwaySchema = new mongoose.Schema({
  // FR : Numéro du catway (unique, requis, entier ≥ 1)
  // EN : Catway number (unique, required, integer ≥ 1)
  catwayNumber: { type: Number, required: true, unique: true, min: 1 },

  // FR : Type de catway (obligatoire, limité à deux valeurs : long ou short)
  // EN : Catway type (required, limited to two values: long or short)
  catwayType:   { type: String, required: true, enum: ['long', 'short'] },

  // FR : État du catway (obligatoire, texte de 2 à 300 caractères)
  // EN : Catway state (required, text length between 2 and 300 characters)
  catwayState:  { type: String, required: true, minlength: 2, maxlength: 300 }
}, { 
  // FR : Ajoute automatiquement createdAt et updatedAt
  // EN : Automatically adds createdAt and updatedAt
  timestamps: true 
});

// FR : Exporte le modèle "Catway" basé sur le schéma
// EN : Export the "Catway" model based on the schema
module.exports = mongoose.model('Catway', catwaySchema);
