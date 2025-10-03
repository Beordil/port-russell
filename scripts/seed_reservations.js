// FR : Charge les variables d'environnement depuis le fichier .env
// EN : Loads environment variables from the .env file
require('dotenv').config();

// FR : Importe le module natif "fs" (file system) pour lire/écrire des fichiers
// EN : Imports the built-in "fs" (file system) module to read/write files
const fs = require('fs');

// FR : Importe le module "path" pour gérer les chemins de fichiers de manière portable
// EN : Imports the "path" module to handle file paths in a cross-platform way
const path = require('path');

// FR : Importe la fonction de connexion à la base de données définie dans le projet
// EN : Imports the database connection function defined in the project
const { connectDB } = require('../src/config/db');

// FR : Importe le modèle Reservation (schéma MongoDB/Mongoose pour la collection Reservations)
// EN : Imports the Reservation model (MongoDB/Mongoose schema for the Reservations collection)
const Reservation = require('../src/models/Reservation');

// FR : Fonction auto-exécutée (IIFE) pour lancer le script immédiatement
// EN : Immediately Invoked Function Expression (IIFE) to run the script instantly
(async () => {
  try {
    // FR : Connexion à la base de données avec l'URI MongoDB défini dans les variables d'environnement
    // EN : Connects to the database using the MongoDB URI from environment variables
    await connectDB(process.env.MONGODB_URI);

    // FR : Lit le fichier reservations.json et parse son contenu en JSON
    // EN : Reads the reservations.json file and parses its content as JSON
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../reservations.json'), 'utf-8'));

    // FR : Supprime toutes les réservations existantes dans la collection
    // EN : Deletes all existing reservations from the collection
    await Reservation.deleteMany({});

    // FR : Insère toutes les nouvelles données dans la collection Reservations
    // EN : Inserts all new data into the Reservations collection
    await Reservation.insertMany(data);

    // FR : Affiche un message de succès avec le nombre d’éléments insérés
    // EN : Logs a success message with the number of inserted items
    console.log(`✅ Import Reservations terminé (${data.length} éléments)`);

    // FR : Termine le processus avec un code de succès (0)
    // EN : Exits the process with a success code (0)
    process.exit(0);
  } catch (e) {
    // FR : Affiche une erreur si l'import échoue
    // EN : Logs an error if the import fails
    console.error('❌ Seed reservations error:', e);

    // FR : Termine le processus avec un code d'échec (1)
    // EN : Exits the process with a failure code (1)
    process.exit(1);
  }
})();
