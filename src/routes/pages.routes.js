// -----------------------------------------------------------------------------
// FR : Routes principales des pages (accueil et tableau de bord)
// EN : Main page routes (home and dashboard)
// -----------------------------------------------------------------------------

const router = require('express').Router();
const Reservation = require('../models/Reservation');

// -----------------------------------------------------------------------------
// FR : PAGE D’ACCUEIL
// EN : HOME PAGE
// -----------------------------------------------------------------------------
// FR : Route “/” — affiche la page d’accueil contenant :
//      - une courte présentation de l’application
//      - un formulaire de connexion
//      - un lien vers la documentation de l’API
// EN : Route “/” — displays the home page containing :
//      - a short presentation of the app
//      - a login form
//      - a link to the API documentation
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Port Russell',
    page: 'home',            // FR : utilisé pour appliquer un style spécifique (body.page-home)
                             // EN : used to apply a specific style (body.page-home)
  });
});

// -----------------------------------------------------------------------------
// FR : TABLEAU DE BORD
// EN : DASHBOARD
// -----------------------------------------------------------------------------
// FR : Route “/dashboard” — affiche :
//      - le nom et l’adresse e-mail de l’utilisateur connecté
//      - la date du jour
//      - la liste des réservations actuellement en cours
// EN : Route “/dashboard” — displays :
//      - connected user’s name and email
//      - today’s date
//      - list of currently active reservations
router.get('/dashboard', async (req, res) => {
  try {
    // FR : Date et heure actuelles
    // EN : Current date and time
    const now = new Date();

    // FR : Récupère les réservations “actives” (aujourd’hui inclus)
    // EN : Fetch reservations currently active (including today)
    const current = await Reservation.find({
      startDate: { $lte: now },
      endDate:   { $gte: now },
    })
      .sort({ endDate: 1 })
      .lean();

    // FR : Email utilisateur connecté (si middleware d’authentification)
    // EN : Logged-in user email (if authentication middleware is used)
    const userEmail = (req.user && req.user.email) ? req.user.email : null;

    // FR : Rend la vue EJS “dashboard.ejs” avec les données nécessaires
    // EN : Renders the EJS view “dashboard.ejs” with the required data
    res.render('dashboard', {
      title: 'Tableau de bord',
      page: 'dashboard',       // FR : utilisé pour la classe body.page-dashboard
                               // EN : used for the body.page-dashboard class
      today: now,
      userEmail,
      currentReservations: current,
      countCurrent: current.length, // FR : compteur de réservations actives
                                    // EN : count of active reservations
    });
  } catch (err) {
    console.error('dashboard error:', err);
    // FR : Message d’erreur générique si problème serveur
    // EN : Generic error message if server issue
    res.status(500).send('Erreur serveur');
  }
});

// -----------------------------------------------------------------------------
// FR : Export du routeur pour intégration dans server.js
// EN : Export router to be used in server.js
// -----------------------------------------------------------------------------
module.exports = router;
