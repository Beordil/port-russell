// FR : On importe le modèle Mongoose "Catway"
// EN : Import the Mongoose model "Catway"
const Catway = require('../models/Catway');

/** GET /api/catways */
// FR : Liste tous les catways, triés par numéro croissant
// EN : Lists all catways, sorted by ascending number
exports.list = async (req, res) => {
  const data = await Catway.find().sort({ catwayNumber: 1 }).lean();
  res.json(data);
};

/** GET /api/catways/:id (id = catwayNumber) */
// FR : Récupère un catway par son numéro
// EN : Retrieves a catway by its number
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);

  // FR : Vérifie que l'id est bien un nombre
  // EN : Checks if the id is a valid number
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id doit être un nombre' });
  }

  // FR : Recherche du catway correspondant
  // EN : Looks up the corresponding catway
  const item = await Catway.findOne({ catwayNumber: id }).lean();

  // FR : Si introuvable, on renvoie une 404
  // EN : If not found, return 404
  if (!item) return res.status(404).json({ error: 'Catway introuvable' });

  // FR : Sinon, on renvoie le catway
  // EN : Otherwise, return the catway
  res.json(item);
};

/** POST /api/catways  -> body: { catwayNumber, catwayType, catwayState } */
// FR : Crée un nouveau catway
// EN : Creates a new catway
exports.create = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // FR : Insertion du catway en base
    // EN : Insert the catway into the database
    const created = await Catway.create({ catwayNumber, catwayType, catwayState });

    return res.status(201).json(created);
  } catch (e) {
    // FR : Gère le cas où catwayNumber est déjà utilisé (erreur MongoDB code 11000)
    // EN : Handles duplicate catwayNumber error (MongoDB error code 11000)
    if (e?.code === 11000) {
      return res.status(409).json({ error: 'catwayNumber déjà utilisé' });
    }

    // FR : Autres erreurs (erreur serveur générique)
    // EN : Other errors (generic server error)
    return res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
};

/** PUT /api/catways/:id -> body: { catwayType, catwayState } */
// FR : Met à jour un catway existant par son numéro
// EN : Updates an existing catway by its number
exports.update = async (req, res) => {
  const id = Number(req.params.id);

  // FR : Vérifie que l'id est un nombre
  // EN : Checks if id is a number
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id doit être un nombre' });

  const { catwayType, catwayState } = req.body;

  // FR : Recherche et mise à jour en un seul appel
  // EN : Finds and updates in a single call
  const updated = await Catway.findOneAndUpdate(
    { catwayNumber: id },
    { $set: { catwayType, catwayState } },
    { new: true, runValidators: true } // FR : retourne le document mis à jour et applique les validateurs
                                       // EN : returns the updated document and applies validators
  ).lean();

  // FR : Si non trouvé → 404
  // EN : If not found → 404
  if (!updated) return res.status(404).json({ error: 'Catway introuvable' });

  return res.json(updated);
};

/** DELETE /api/catways/:id */
// FR : Supprime un catway par son numéro
// EN : Deletes a catway by its number
exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  // FR : Vérifie que l'id est bien un nombre
  // EN : Checks if id is a valid number
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id doit être un nombre' });

  // FR : Suppression du catway
  // EN : Deletes the catway
  const deleted = await Catway.findOneAndDelete({ catwayNumber: id }).lean();

  // FR : Si introuvable → 404
  // EN : If not found → 404
  if (!deleted) return res.status(404).json({ error: 'Catway introuvable' });

  // FR : Sinon, on renvoie un succès avec l’élément supprimé
  // EN : Otherwise, return success with the deleted element
  return res.json({ ok: true, deleted });
};
