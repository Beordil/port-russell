// FR : Importe le module mongoose pour interagir avec MongoDB
// EN : Imports the mongoose module to interact with MongoDB
const mongoose = require('mongoose');

// FR : Fonction asynchrone pour se connecter à la base MongoDB
// EN : Asynchronous function to connect to the MongoDB database
async function connectDB(uri) {
  // FR : Active le mode strictQuery pour éviter les requêtes ambiguës (bonne pratique avec Mongoose)
  // EN : Enables strictQuery mode to avoid ambiguous queries (best practice with Mongoose)
  mongoose.set('strictQuery', true);

  // FR : Connexion à MongoDB avec l'URI donné. autoIndex: true permet de créer les index automatiquement.
  // EN : Connects to MongoDB with the given URI. autoIndex: true automatically builds indexes.
  await mongoose.connect(uri, { autoIndex: true });

  // FR : Affiche un message de confirmation si la connexion réussit
  // EN : Logs a confirmation message if the connection succeeds
  console.log('✅ MongoDB connecté');
}

// FR : Exporte la fonction pour l’utiliser dans d’autres fichiers
// EN : Exports the function so it can be used in other files
module.exports = { connectDB };
