// src/controllers/reservations.controller.js
// -----------------------------------------------------------
// Reservations controller (FR/EN)
// - Works for flat routes  : /api/reservations...
// - Works for nested alias : /api/catways/:id/reservations...
//
// Notes:
// - If a catwayNumber is provided via route param `:id`, it is used.
// - Overlap check: a reservation overlaps if (startA <= endB) && (endA >= startB).
// -----------------------------------------------------------

const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');

// Small helper to standardize validation errors
function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return null;
}

// GET /api/reservations
// GET /api/catways/:id/reservations
exports.list = async (req, res) => {
  try {
    // if nested route, filter by catwayNumber
    const filter = {};
    if (req.params && req.params.id) {
      filter.catwayNumber = parseInt(req.params.id, 10);
    }

    const reservations = await Reservation.find(filter).sort({ startDate: 1 }).lean();
    return res.json(reservations);
  } catch (err) {
    console.error('list reservations error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET /api/reservations/:id
// GET /api/catways/:id/reservations/:resId
exports.getOne = async (req, res) => {
  try {
    const reservationId = req.params.resId || req.params.id;

    const reservation = await Reservation.findById(reservationId).lean();
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    // if nested route, ensure it belongs to that catway
    if (req.params && req.params.id) {
      const catwayNumber = parseInt(req.params.id, 10);
      if (reservation.catwayNumber !== catwayNumber) {
        return res.status(404).json({ error: 'Réservation introuvable pour ce catway' });
      }
    }

    return res.json(reservation);
  } catch (err) {
    console.error('get reservation error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST /api/reservations
// POST /api/catways/:id/reservations
exports.create = async (req, res) => {
  // validation errors
  if (sendValidationErrors(req, res)) return;

  try {
    // catwayNumber can come from nested route or from body
    const catwayNumber = req.params.id ? parseInt(req.params.id, 10) : parseInt(req.body.catwayNumber, 10);
    const { clientName, boatName, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(422).json({ error: 'Dates invalides (start < end requis)' });
    }

    // overlap check for the same catway
    const overlap = await Reservation.findOne({
      catwayNumber,
      startDate: { $lte: end },
      endDate: { $gte: start },
    }).lean();

    if (overlap) {
      return res.status(409).json({ error: 'Conflit : catway déjà réservé sur cette période' });
    }

    const created = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('create reservation error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT /api/reservations/:id
// PUT /api/catways/:id/reservations/:resId
exports.update = async (req, res) => {
  if (sendValidationErrors(req, res)) return;

  try {
    const reservationId = req.params.resId || req.params.id;

    // Build partial update
    const update = {};
    if (req.body.clientName !== undefined) update.clientName = String(req.body.clientName).trim();
    if (req.body.boatName !== undefined) update.boatName = String(req.body.boatName).trim();
    if (req.body.startDate !== undefined) update.startDate = new Date(req.body.startDate);
    if (req.body.endDate !== undefined) update.endDate = new Date(req.body.endDate);

    // If nested route, force/lock the catwayNumber to the route param
    if (req.params && req.params.id) {
      update.catwayNumber = parseInt(req.params.id, 10);
    } else if (req.body.catwayNumber !== undefined) {
      update.catwayNumber = parseInt(req.body.catwayNumber, 10);
    }

    // Check we have a document
    const existing = await Reservation.findById(reservationId);
    if (!existing) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    // If dates or catwayNumber change, check overlap (exclude current id)
    const newCatway = update.catwayNumber ?? existing.catwayNumber;
    const newStart = update.startDate ?? existing.startDate;
    const newEnd = update.endDate ?? existing.endDate;

    if (!(newStart instanceof Date) || isNaN(newStart) || !(newEnd instanceof Date) || isNaN(newEnd) || newStart >= newEnd) {
      return res.status(422).json({ error: 'Dates invalides (start < end requis)' });
    }

    const overlap = await Reservation.findOne({
      _id: { $ne: reservationId },
      catwayNumber: newCatway,
      startDate: { $lte: newEnd },
      endDate: { $gte: newStart },
    }).lean();

    if (overlap) {
      return res.status(409).json({ error: 'Conflit : catway déjà réservé sur cette période' });
    }

    existing.catwayNumber = newCatway;
    existing.clientName = update.clientName ?? existing.clientName;
    existing.boatName = update.boatName ?? existing.boatName;
    existing.startDate = newStart;
    existing.endDate = newEnd;

    await existing.save();
    return res.json(existing);
  } catch (err) {
    console.error('update reservation error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE /api/reservations/:id
// DELETE /api/catways/:id/reservations/:resId
exports.remove = async (req, res) => {
  try {
    const reservationId = req.params.resId || req.params.id;

    // If nested, ensure it belongs to that catway
    if (req.params && req.params.id) {
      const catwayNumber = parseInt(req.params.id, 10);
      const doc = await Reservation.findOne({ _id: reservationId, catwayNumber }).lean();
      if (!doc) {
        return res.status(404).json({ error: 'Réservation introuvable pour ce catway' });
      }
    }

    const deleted = await Reservation.findByIdAndDelete(reservationId).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    return res.json({ ok: true, deleted });
  } catch (err) {
    console.error('delete reservation error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET /api/reservations/availability?catwayNumber=5&start=YYYY-MM-DD&end=YYYY-MM-DD
exports.availability = async (req, res) => {
  if (sendValidationErrors(req, res)) return;

  try {
    const catwayNumber = parseInt(req.query.catwayNumber, 10);
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);

    const overlap = await Reservation.findOne({
      catwayNumber,
      startDate: { $lte: end },
      endDate: { $gte: start },
    }).lean();

    return res.json({
      available: !overlap,
      catwayNumber,
      start,
      end,
    });
  } catch (err) {
    console.error('availability error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
