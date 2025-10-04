// -----------------------------------------------------------------------------
// FR : Routes pour l’interface utilisateur (UI) des Catways
// EN : Routes for the Catways user interface (UI)
// -----------------------------------------------------------------------------
//
// FR : Ces routes gèrent les pages côté interface utilisateur (EJS).
//      Elles utilisent le contrôleur `ui.controllers.js` et sont protégées
//      par le middleware d’authentification `requireAuth`.
//
// EN : These routes handle user interface (EJS) pages.
//      They use the `ui.controllers.js` controller and are protected
//      by the `requireAuth` authentication middleware.
//
// -----------------------------------------------------------------------------


const router = require('express').Router();
const ui = require('../controllers/ui.controllers'); // FR : Import du contrôleur UI | EN : Import UI controller
const { requireAuth } = require('../middleware/auth'); // FR : Middleware d’authentification | EN : Authentication middleware


// -----------------------------------------------------------------------------
// FR : LISTER LES CATWAYS
// EN : LIST CATWAYS
// -----------------------------------------------------------------------------
//
// FR : Affiche la page listant tous les catways disponibles
// EN : Displays a page listing all existing catways
router.get('/ui/catways', requireAuth, ui.catwaysList);


// -----------------------------------------------------------------------------
// FR : CRÉER UN NOUVEAU CATWAY
// EN : CREATE A NEW CATWAY
// -----------------------------------------------------------------------------
//
// FR : Affiche le formulaire de création d’un catway
// EN : Displays the form for creating a new catway
router.get('/ui/catways/new', requireAuth, ui.catwaysNewForm);

//
// FR : Soumet le formulaire et crée le catway en base de données
// EN : Submits the form and saves the new catway to the database
router.post('/ui/catways', requireAuth, ui.catwaysCreate);


// -----------------------------------------------------------------------------
// FR : MODIFIER UN CATWAY EXISTANT
// EN : EDIT AN EXISTING CATWAY
// -----------------------------------------------------------------------------
//
// FR : Affiche le formulaire d’édition pour un catway spécifique
// EN : Displays the edit form for a specific catway
router.get('/ui/catways/:id/edit', requireAuth, ui.catwaysEditForm);

//
// FR : Soumet les modifications et met à jour le catway
// EN : Submits the changes and updates the catway in the database
router.post('/ui/catways/:id/update', requireAuth, ui.catwaysUpdate);


// -----------------------------------------------------------------------------
// FR : SUPPRIMER UN CATWAY
// EN : DELETE A CATWAY
// -----------------------------------------------------------------------------
//
// FR : Supprime le catway correspondant à l’ID donné
// EN : Deletes the catway with the provided ID
router.post('/ui/catways/:id/delete', requireAuth, ui.catwaysDelete);


// -----------------------------------------------------------------------------
// FR : Export du routeur pour intégration dans le serveur principal
// EN : Export the router for integration into the main server
// -----------------------------------------------------------------------------
module.exports = router;
