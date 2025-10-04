// src/routes/pages.routes.js
const router = require('express').Router();
const Reservation = require('../models/Reservation');
const { requireAuth } = require('../middleware/auth');

/**
 * Accueil (login simple + présentation)
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Port Russell' });
});

/**
 * Tableau de bord (protégé)
 * - Menu (liens CRUD + docs + logout)
 * - Email utilisateur (depuis cookie userEmail)
 * - Date du jour
 * - Réservations en cours
 */
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const now = new Date();

    const current = await Reservation.find({
      startDate: { $lte: now },
      endDate:   { $gte: now },
    })
      .sort({ endDate: 1 })
      .lean();

    const userEmail = req.cookies?.userEmail || null;

    res.render('dashboard', {
      title: 'Tableau de bord',
      today: now,
      userEmail,
      currentReservations: current,
      countCurrent: current.length,
    });
  } catch (err) {
    console.error('dashboard error:', err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
