// -----------------------------------------------------------------------------
// FR : Chargement des variables d'environnement (.env)
// EN : Load environment variables from .env
// -----------------------------------------------------------------------------
require('dotenv').config();

// -----------------------------------------------------------------------------
// FR : Import de la fonction de connexion à MongoDB et du modèle User
// EN : Import the MongoDB connection function and User model
// -----------------------------------------------------------------------------
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');

// -----------------------------------------------------------------------------
// FR : Fonction asynchrone auto-exécutée pour lancer le script de seed
// EN : Self-invoking async function to run the seed script
// -----------------------------------------------------------------------------
(async () => {
  try {
    // -------------------------------------------------------------------------
    // FR : Connexion à MongoDB en utilisant l'URI définie dans .env
    // EN : Connect to MongoDB using the URI defined in .env
    // -------------------------------------------------------------------------
    await connectDB(process.env.MONGODB_URI);

    // -------------------------------------------------------------------------
    // FR : Suppression de tous les utilisateurs existants dans la collection
    // EN : Delete all existing users in the collection
    // -------------------------------------------------------------------------
    await User.deleteMany({});

    // -------------------------------------------------------------------------
    // FR : Insertion de données initiales (utilisateurs par défaut)
    // EN : Insert initial data (default users)
    // -------------------------------------------------------------------------
    const docs = await User.insertMany([
      { name: 'Alice Martin', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob Dupont',   email: 'bob@example.com',   role: 'user'  },
    ]);

    // -------------------------------------------------------------------------
    // FR : Confirmation du succès avec le nombre d'utilisateurs insérés
    // EN : Confirm success with number of users inserted
    // -------------------------------------------------------------------------
    console.log(`✅ Users seed OK (${docs.length})`);

    // -------------------------------------------------------------------------
    // FR : Fermer le processus avec succès
    // EN : Exit the process successfully
    // -------------------------------------------------------------------------
    process.exit(0);

  } catch (e) {
    // -------------------------------------------------------------------------
    // FR : Affiche une erreur si le seed échoue
    // EN : Display error if seeding fails
    // -------------------------------------------------------------------------
    console.error('❌ Seed users error:', e);

    // -------------------------------------------------------------------------
    // FR : Fermer le processus avec un code d'erreur
    // EN : Exit the process with error code
    // -------------------------------------------------------------------------
    process.exit(1);
  }
})();
