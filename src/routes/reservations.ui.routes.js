// -----------------------------------------------------------------------------
// FR : Routes pour l’interface utilisateur (UI) des réservations
// EN : Routes for the user interface (UI) of reservations
// -----------------------------------------------------------------------------
//
// FR : Ces routes affichent les pages EJS (listes, formulaires, etc.)
//      et interagissent avec le contrôleur UI (`ui.reservations.controller.js`).
//
// EN : These routes render EJS pages (lists, forms, etc.)
//      and interact with the UI controller (`ui.reservations.controller.js`).
//
// -----------------------------------------------------------------------------


const router = require('express').Router();
const ui = require('../controllers/ui.reservations.controller'); // FR : Import du contrôleur UI | EN : Import UI controller


// -----------------------------------------------------------------------------
// FR : LISTER LES RÉSERVATIONS
// EN : LIST RESERVATIONS
// -----------------------------------------------------------------------------
//
// FR : Route GET pour afficher la liste de toutes les réservations
// EN : GET route to display all reservations in the UI
router.get('/ui/reservations', ui.list);


// -----------------------------------------------------------------------------
// FR : CRÉER UNE NOUVELLE RÉSERVATION
// EN : CREATE A NEW RESERVATION
// -----------------------------------------------------------------------------
//
// FR : Affiche le formulaire de création
// EN : Displays the creation form
router.get('/ui/reservations/new', ui.newForm);

//
// FR : Soumet le formulaire et enregistre une nouvelle réservation
// EN : Submits the form and saves a new reservation
router.post('/ui/reservations', ui.create);


// -----------------------------------------------------------------------------
// FR : MODIFIER UNE RÉSERVATION EXISTANTE
// EN : EDIT AN EXISTING RESERVATION
// -----------------------------------------------------------------------------
//
// FR : Affiche le formulaire d’édition pour une réservation donnée (par ID)
// EN : Displays the edit form for a specific reservation (by ID)
router.get('/ui/reservations/:id/edit', ui.editForm);

//
// FR : Soumet les changements du formulaire et met à jour la réservation
// EN : Submits the form changes and updates the reservation
router.post('/ui/reservations/:id/edit', ui.update);


// -----------------------------------------------------------------------------
// FR : SUPPRIMER UNE RÉSERVATION
// EN : DELETE A RESERVATION
// -----------------------------------------------------------------------------
//
// FR : Supprime une réservation à partir de son ID
// EN : Deletes a reservation by its ID
router.post('/ui/reservations/:id/delete', ui.remove);


// -----------------------------------------------------------------------------
// FR : Export du routeur pour être utilisé dans le serveur principal
// EN : Export the router to be used in the main server
// -----------------------------------------------------------------------------
module.exports = router;
