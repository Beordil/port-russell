const Reservation = require('../models/Reservation');

// util: chevauchement entre [a1,a2] et [b1,b2] (bornes inclusives)
function overlaps(a1, a2, b1, b2) {
  return a1 <= b2 && b1 <= a2;
}

// GET /api/reservations
exports.list = async (_req, res) => {
  const data = await Reservation.find().sort({ startDate: 1 }).lean();
  res.json(data);
};

// GET /api/reservations/:id (id = _id Mongo)
exports.getOne = async (req, res) => {
  const { id } = req.params;
  const item = await Reservation.findById(id).lean();
  if (!item) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(item);
};

// POST /api/reservations
// body: { catwayNumber, clientName, boatName, startDate, endDate }
exports.create = async (req, res) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

  const s = new Date(startDate);
  const e = new Date(endDate);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || s > e) {
    return res.status(400).json({ error: 'Dates invalides (startDate <= endDate requis)' });
  }

  // conflit : même catway, période qui se chevauche
  const sameCatway = await Reservation.find({ catwayNumber }).lean();
  const conflict = sameCatway.some(r =>
    overlaps(s, e, new Date(r.startDate), new Date(r.endDate))
  );
  if (conflict) {
    return res.status(409).json({ error: 'Conflit : catway déjà réservé sur cette période' });
  }

  const created = await Reservation.create({
    catwayNumber, clientName, boatName, startDate: s, endDate: e
  });
  res.status(201).json(created);
};
/** PUT /api/reservations/:id */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

  // validations simples
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || s > e) {
    return res.status(400).json({ error: 'Dates invalides (startDate <= endDate requis)' });
  }

  // contrôle de conflit avec les AUTRES réservations du même catway
  const others = await Reservation.find({
    _id: { $ne: id },
    catwayNumber
  }).lean();

  const conflict = others.some(r =>
    s <= new Date(r.endDate) && new Date(r.startDate) <= e
  );
  if (conflict) {
    return res.status(409).json({ error: 'Conflit : catway déjà réservé sur cette période' });
  }

  const updated = await Reservation.findByIdAndUpdate(
    id,
    { catwayNumber, clientName, boatName, startDate: s, endDate: e },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: 'Réservation introuvable' });
  return res.json(updated);
};

/** DELETE /api/reservations/:id */
exports.remove = async (req, res) => {
  const { id } = req.params;
  const deleted = await Reservation.findByIdAndDelete(id).lean();
  if (!deleted) return res.status(404).json({ error: 'Réservation introuvable' });
  return res.json({ ok: true, deleted });
};
