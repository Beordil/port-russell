// -----------------------------------------------------------------------------
// FR : Routes UI pour la gestion des Catways (pages EJS)
// EN : UI routes for managing Catways (EJS pages)
// -----------------------------------------------------------------------------

const express = require('express');
const router = express.Router();

// FR : Contrôleur côté UI (rendu EJS + appels API si nécessaire)
// EN : UI-side controller (renders EJS + may call the API)
const ui = require('../controllers/catways.ui.controller');

// -----------------------------------------------------------------------------
// FR : LISTE
// EN : LIST
// -----------------------------------------------------------------------------
// FR : Affiche la liste des catways (tableau + actions)
// EN : Displays the list of catways (table + actions)
router.get('/ui/catways', ui.list);

// -----------------------------------------------------------------------------
// FR : CRÉATION
// EN : CREATE
// -----------------------------------------------------------------------------
// FR : Affiche le formulaire de création d’un catway
// EN : Shows the creation form for a catway
router.get('/ui/catways/new', ui.newForm);

// FR : Traite la soumission du formulaire de création
// EN : Handles the submitted creation form
router.post('/ui/catways/new', ui.create);

// -----------------------------------------------------------------------------
// FR : ÉDITION / MISE À JOUR
// EN : EDIT / UPDATE
// -----------------------------------------------------------------------------
// FR : Affiche le formulaire d’édition pour le catway {id}
// EN : Shows the edit form for catway {id}
router.get('/ui/catways/:id/edit', ui.editForm);

// FR : Traite la soumission du formulaire d’édition
// EN : Handles the submitted edit form
router.post('/ui/catways/:id/update', ui.update);

// -----------------------------------------------------------------------------
// FR : SUPPRESSION
// EN : DELETE
// -----------------------------------------------------------------------------
// FR : Supprime le catway {id} puis redirige vers la liste
// EN : Deletes catway {id} then redirects back to the list
router.post('/ui/catways/:id/delete', ui.remove);

// -----------------------------------------------------------------------------
// FR : Export du routeur pour l’utiliser dans server.js
// EN : Export the router to be mounted in server.js
// -----------------------------------------------------------------------------
module.exports = router;
