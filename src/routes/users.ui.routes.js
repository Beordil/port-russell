// -----------------------------------------------------------------------------
// FR : Routes UI pour la gestion des utilisateurs (interface graphique EJS)
// EN : UI routes for user management (EJS interface)
// -----------------------------------------------------------------------------
//
// FR : Ces routes utilisent axios pour communiquer avec l’API REST des users.
// EN : These routes use axios to communicate with the REST API for users.
//
// Objectif : permettre la gestion complète des utilisateurs depuis le navigateur
//             - Liste complète des utilisateurs
//             - Création d’un utilisateur
//             - Modification d’un utilisateur
//             - Suppression d’un utilisateur
//
// -----------------------------------------------------------------------------

const router = require('express').Router();
const axios = require('axios');

// -----------------------------------------------------------------------------
// FR : Détermine la base URL de l’API, selon que l’app tourne en local ou Render
// EN : Determines the API base URL depending on whether the app runs locally or on Render
// -----------------------------------------------------------------------------
function apiBase(req) {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// -----------------------------------------------------------------------------
// FR : Page — Liste des utilisateurs
// EN : Page — List of users
// -----------------------------------------------------------------------------
//
// FR : Récupère la liste complète via l’API /api/users puis rend la vue EJS correspondante.
// EN : Fetches all users from /api/users and renders the matching EJS template.
//
router.get('/ui/users', async (req, res) => {
  try {
    const { data: items } = await axios.get(`${apiBase(req)}/api/users`);
    res.render('users/list', { title: 'Utilisateurs', items });
  } catch (e) {
    console.error('❌ Erreur UI users (list):', e.message);
    res.status(500).send('Erreur UI users (list)');
  }
});

// -----------------------------------------------------------------------------
// FR : Formulaire de création d’un utilisateur
// EN : User creation form
// -----------------------------------------------------------------------------
//
// FR : Affiche un formulaire vide pour créer un nouvel utilisateur.
// EN : Displays an empty form to create a new user.
//
router.get('/ui/users/new', (_req, res) => {
  res.render('users/form', {
    title: 'Nouvel utilisateur',
    mode: 'create',
    item: { name: '', email: '', role: 'user' },
    error: null,
  });
});

// -----------------------------------------------------------------------------
// FR : Création d’un nouvel utilisateur
// EN : Create a new user
// -----------------------------------------------------------------------------
//
// FR : Envoie les données du formulaire à l’API via POST /api/users.
// EN : Sends form data to the API using POST /api/users.
//
router.post('/ui/users/new', async (req, res) => {
  try {
    await axios.post(`${apiBase(req)}/api/users`, req.body);
    res.redirect('/ui/users');
  } catch (e) {
    const msg = e?.response?.data?.error || 'Erreur création';
    res.status(400).render('users/form', {
      title: 'Nouvel utilisateur',
      mode: 'create',
      item: req.body,
      error: msg,
    });
  }
});

// -----------------------------------------------------------------------------
// FR : Formulaire d’édition d’un utilisateur existant
// EN : Edit form for an existing user
// -----------------------------------------------------------------------------
//
// FR : Charge les infos actuelles depuis l’API puis affiche la vue “edit”.
// EN : Loads current user data from API and renders the “edit” view.
//
router.get('/ui/users/:id/edit', async (req, res) => {
  try {
    const { data: item } = await axios.get(`${apiBase(req)}/api/users/${req.params.id}`);
    res.render('users/form', {
      title: 'Modifier utilisateur',
      mode: 'edit',
      item,
      error: null,
    });
  } catch (e) {
    console.error('❌ Erreur chargement utilisateur:', e.message);
    res.status(404).send('Utilisateur introuvable');
  }
});

// -----------------------------------------------------------------------------
// FR : Mise à jour d’un utilisateur existant
// EN : Update an existing user
// -----------------------------------------------------------------------------
//
// FR : Envoie les nouvelles données vers l’API via PUT /api/users/:id.
// EN : Sends updated data to the API using PUT /api/users/:id.
//
router.post('/ui/users/:id/update', async (req, res) => {
  try {
    await axios.put(`${apiBase(req)}/api/users/${req.params.id}`, req.body);
    res.redirect('/ui/users');
  } catch (e) {
    const msg = e?.response?.data?.error || 'Erreur mise à jour';
    // FR : Recharge l’utilisateur pour réafficher les valeurs correctes
    // EN : Reload user to re-display proper form values
    const { data: item } =
      (await axios.get(`${apiBase(req)}/api/users/${req.params.id}`).catch(() => ({
        data: req.body,
      })));
    res.status(400).render('users/form', {
      title: 'Modifier utilisateur',
      mode: 'edit',
      item,
      error: msg,
    });
  }
});

// -----------------------------------------------------------------------------
// FR : Suppression d’un utilisateur
// EN : Delete a user
// -----------------------------------------------------------------------------
//
// FR : Envoie une requête DELETE à l’API pour supprimer l’utilisateur.
// EN : Sends a DELETE request to the API to remove the user.
//
router.post('/ui/users/:id/delete', async (req, res) => {
  try {
    await axios.delete(`${apiBase(req)}/api/users/${req.params.id}`);
    res.redirect('/ui/users');
  } catch (e) {
    console.error('❌ Erreur suppression utilisateur:', e.message);
    res.status(400).send('Suppression impossible');
  }
});

// -----------------------------------------------------------------------------
// FR : Export du routeur pour intégration dans le serveur principal
// EN : Export the router to be mounted in the main Express server
// -----------------------------------------------------------------------------
module.exports = router;
