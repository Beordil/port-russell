// -----------------------------------------------------------------------------
// src/controllers/ui.reservations.controller.js
// -----------------------------------------------------------------------------
// FR : Contrôleur pour la gestion des réservations dans l’interface utilisateur (UI)
// EN : Controller for managing reservations in the user interface (UI)
//
// ⚙️ Objectif : afficher, créer, modifier et supprimer des réservations
//    directement via les pages EJS (pas via l’API JSON).
//
// Routes principales :
// - GET  /ui/reservations           → Liste des réservations
// - GET  /ui/reservations/new       → Formulaire de création
// - POST /ui/reservations/new       → Création
// - GET  /ui/reservations/:id/edit  → Formulaire d’édition
// - POST /ui/reservations/:id/edit  → Mise à jour
// - POST /ui/reservations/:id/delete→ Suppression
// -----------------------------------------------------------------------------

const Reservation = require('../models/Reservation');

// -----------------------------------------------------------------------------
// FR : Affiche la liste complète des réservations
// EN : Displays the complete list of reservations
// -----------------------------------------------------------------------------
exports.list = async (req, res) => {
  const items = await Reservation.find().sort({ startDate: 1 }).lean();

  res.render('reservations/reservations_list', {
    title: 'Réservations — Port Russell',
    items,
  });
};

// -----------------------------------------------------------------------------
// FR : Affiche le formulaire de création d’une nouvelle réservation
// EN : Displays the form to create a new reservation
// -----------------------------------------------------------------------------
exports.newForm = (_req, res) => {
  res.render('reservations/reservations_form', {
    title: 'Nouvelle réservation — Port Russell',
    item: null, // FR : Pas encore de données à afficher | EN : No data yet
  });
};

// -----------------------------------------------------------------------------
// FR : Crée une nouvelle réservation après soumission du formulaire
// EN : Creates a new reservation after form submission
// -----------------------------------------------------------------------------
exports.create = async (req, res) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

  // FR : Enregistre la réservation dans MongoDB
  // EN : Save the reservation in MongoDB
  await Reservation.create({
    catwayNumber,
    clientName,
    boatName,
    startDate,
    endDate,
  });

  // FR : Redirige vers la liste des réservations après création
  // EN : Redirects to reservation list after creation
  res.redirect('/ui/reservations');
};

// -----------------------------------------------------------------------------
// FR : Affiche le formulaire d’édition d’une réservation existante
// EN : Displays the edit form for an existing reservation
// -----------------------------------------------------------------------------
exports.editForm = async (req, res) => {
  const item = await Reservation.findById(req.params.id).lean();

  // FR : Si la réservation n’existe pas → message d’erreur
  // EN : If reservation not found → show error message
  if (!item) return res.status(404).send('Réservation introuvable');

  res.render('reservations/reservations_form', {
    title: `Modifier réservation #${item._id} — Port Russell`,
    item,
  });
};

// -----------------------------------------------------------------------------
// FR : Met à jour une réservation existante
// EN : Updates an existing reservation
// -----------------------------------------------------------------------------
exports.update = async (req, res) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

  // FR : Met à jour la réservation avec les nouvelles données
  // EN : Update reservation with new values
  await Reservation.findByIdAndUpdate(req.params.id, {
    catwayNumber,
    clientName,
    boatName,
    startDate,
    endDate,
  });

  res.redirect('/ui/reservations');
};

// -----------------------------------------------------------------------------
// FR : Supprime une réservation existante
// EN : Deletes an existing reservation
// -----------------------------------------------------------------------------
exports.remove = async (req, res) => {
  // FR : Supprime la réservation par son ID
  // EN : Delete the reservation by its ID
  await Reservation.findByIdAndDelete(req.params.id);

  // FR : Retourne à la liste après suppression
  // EN : Redirects to list after deletion
  res.redirect('/ui/reservations');
};
