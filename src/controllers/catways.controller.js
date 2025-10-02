const Catway = require('../models/Catway');

// GET /api/catways
exports.list = async (req, res) => {
  const data = await Catway.find().sort({ catwayNumber: 1 }).lean();
  res.json(data);
};

// GET /api/catways/:id
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id doit être un nombre' });
  }
  const item = await Catway.findOne({ catwayNumber: id }).lean();
  if (!item) return res.status(404).json({ error: 'Catway introuvable' });
  res.json(item);
};
