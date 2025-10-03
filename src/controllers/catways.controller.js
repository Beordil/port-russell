const Catway = require('../models/Catway');

/** GET /api/catways */
exports.list = async (req, res) => {
  const data = await Catway.find().sort({ catwayNumber: 1 }).lean();
  res.json(data);
};

/** GET /api/catways/:id (id = catwayNumber) */
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id doit être un nombre' });
  }
  const item = await Catway.findOne({ catwayNumber: id }).lean();
  if (!item) return res.status(404).json({ error: 'Catway introuvable' });
  res.json(item);
};

/** POST /api/catways  -> body: { catwayNumber, catwayType, catwayState } */
exports.create = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const created = await Catway.create({ catwayNumber, catwayType, catwayState });
    return res.status(201).json(created);
  } catch (e) {
    // doublon sur l’unicité de catwayNumber
    if (e?.code === 11000) {
      return res.status(409).json({ error: 'catwayNumber déjà utilisé' });
    }
    return res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
};

/** PUT /api/catways/:id -> body: { catwayType, catwayState } */
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id doit être un nombre' });

  const { catwayType, catwayState } = req.body;

  const updated = await Catway.findOneAndUpdate(
    { catwayNumber: id },
    { $set: { catwayType, catwayState } },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: 'Catway introuvable' });
  return res.json(updated);
};

/** DELETE /api/catways/:id */
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id doit être un nombre' });

  const deleted = await Catway.findOneAndDelete({ catwayNumber: id }).lean();
  if (!deleted) return res.status(404).json({ error: 'Catway introuvable' });
  return res.json({ ok: true, deleted });
};
