require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../src/config/db');
const Catway = require('../src/models/Catway');

(async () => {
  try {
    // Connexion à MongoDB
    await connectDB(process.env.MONGODB_URI);

    // Charger les données depuis le JSON
    const catwaysPath = path.join(__dirname, '../catways.json');
    const catways = JSON.parse(fs.readFileSync(catwaysPath, 'utf-8'));

    // Réinitialiser la collection et insérer
    await Catway.deleteMany({});
    await Catway.insertMany(catways);

    console.log(`✅ Import Catways terminé (${catways.length} éléments)`);
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exit(1);
  }
})();
