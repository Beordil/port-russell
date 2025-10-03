// src/routes/pages.routes.js
const router = require('express').Router();
const Reservation = require('../models/Reservation');

/**
 * Accueil (login simple + présentation)
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Port Russell',
  });
});

/**
 * Tableau de bord
 * - Affiche la date du jour
 * - Liste les réservations en cours (startDate <= now <= endDate)
 * - Affiche un résumé + liens utiles
 */
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();

    // Reservations "en cours" : start <= now <= end
    const current = await Reservation.find({
      startDate: { $lte: now },
      endDate:   { $gte: now },
    })
      .sort({ endDate: 1 })
      .lean();

    // On injecte un email si tu as un système d’auth (cookie/session)
    // Ici on tente req.user?.email si existant, sinon null
    const userEmail = (req.user && req.user.email) ? req.user.email : null;

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
