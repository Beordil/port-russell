// FR : Contrôleur CRUD Users (API REST)
// EN : Users CRUD controller (REST API)
const User = require('../models/User');

exports.list = async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 }).lean();
  res.json(items);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const item = await User.findById(id).lean();
  if (!item) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(item);
};

exports.create = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const created = await User.create({ name, email, role });
    res.status(201).json(created);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Email déjà utilisé' });
    res.status(400).json({ error: 'Création impossible', details: e.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(updated);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Email déjà utilisé' });
    res.status(400).json({ error: 'Mise à jour impossible', details: e.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id).lean();
  if (!deleted) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ ok: true, deleted });
};
