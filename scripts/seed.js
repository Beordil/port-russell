// FR : Charge les variables d'environnement depuis le fichier .env
// EN : Loads environment variables from the .env file
require('dotenv').config();

// FR : Importe le module "fs" (système de fichiers) pour lire/écrire des fichiers
// EN : Imports the "fs" (file system) module to read/write files
const fs = require('fs');

// FR : Importe le module "path" pour gérer les chemins de fichiers de manière portable
// EN : Imports the "path" module to handle file paths in a cross-platform way
const path = require('path');

// FR : Importe la fonction de connexion à la base MongoDB définie dans le projet
// EN : Imports the MongoDB connection function defined in the project
const { connectDB } = require('../src/config/db');

// FR : Importe le modèle Catway (schéma Mongoose représentant la collection Catways)
// EN : Imports the Catway model (Mongoose schema representing the Catways collection)
const Catway = require('../src/models/Catway');

// FR : Fonction auto-exécutée (IIFE) pour lancer le script immédiatement
// EN : Immediately Invoked Function Expression (IIFE) to run the script instantly
(async () => {
  try {
    // FR : Connexion à la base de données MongoDB avec l'URI dans les variables d'environnement
    // EN : Connects to MongoDB using the URI from environment variables
    await connectDB(process.env.MONGODB_URI);

    // FR : Construit le chemin vers le fichier catways.json et lit son contenu en JSON
    // EN : Builds the path to the catways.json file and reads its content as JSON
    const catwaysPath = path.join(__dirname, '../catways.json');
    const catways = JSON.parse(fs.readFileSync(catwaysPath, 'utf-8'));

    // FR : Supprime toutes les données existantes dans la collection Catways
    // EN : Deletes all existing documents in the Catways collection
    await Catway.deleteMany({});

    // FR : Insère les nouvelles données du fichier JSON dans la collection
    // EN : Inserts the new data from the JSON file into the collection
    await Catway.insertMany(catways);

    // FR : Affiche un message de succès avec le nombre d’éléments insérés
    // EN : Logs a success message with the number of inserted items
    console.log(`✅ Import Catways terminé (${catways.length} éléments)`);

    // FR : Termine le processus avec un code de succès (0)
    // EN : Exits the process with a success code (0)
    process.exit(0);
  } catch (e) {
    // FR : Affiche une erreur si l'import échoue
    // EN : Logs an error if the import fails
    console.error('❌ Seed error:', e);

    // FR : Termine le processus avec un code d'échec (1)
    // EN : Exits the process with a failure code (1)
    process.exit(1);
  }
})();
