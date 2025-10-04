// -----------------------------------------------------------------------------
// src/controllers/catways.ui.controller.js
// -----------------------------------------------------------------------------
// FR : Contrôleur UI pour gérer les pages Catways (CRUD via EJS + API)
// EN : UI Controller to manage Catways pages (CRUD via EJS + API)
// -----------------------------------------------------------------------------

const axios = require('axios');

// -----------------------------------------------------------------------------
// FR : Fonction utilitaire pour construire l'URL de base
//      - Si BASE_URL est défini (ex: Render), on l'utilise
//      - Sinon, on reconstruit à partir de la requête courante
// EN : Utility function to build the base URL
//      - If BASE_URL is defined (e.g., Render), use it
//      - Otherwise, rebuild from the current request
// -----------------------------------------------------------------------------
function baseUrl(req) {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// -----------------------------------------------------------------------------
// GET /ui/catways
// FR : Liste tous les catways en appelant l’API puis rend la vue "list"
// EN : List all catways by calling the API, then render the "list" view
// -----------------------------------------------------------------------------
exports.list = async (req, res) => {
  try {
    const { data: items } = await axios.get(`${baseUrl(req)}/api/catways`);
    res.render('catways/list', { title: 'Catways — CRUD', items, error: null });
  } catch (e) {
    res.render('catways/list', { title: 'Catways — CRUD', items: [], error: e.message || 'Erreur' });
  }
};

// -----------------------------------------------------------------------------
// GET /ui/catways/new
// FR : Affiche un formulaire vide pour créer un nouveau catway
// EN : Display an empty form to create a new catway
// -----------------------------------------------------------------------------
exports.newForm = (req, res) => {
  res.render('catways/form', {
    title: 'Nouveau catway',
    mode: 'create',
    item: { catwayNumber: '', catwayType: 'short', catwayState: '' },
    error: null
  });
};

// -----------------------------------------------------------------------------
// POST /ui/catways/new
// FR : Envoie le formulaire à l’API pour créer un nouveau catway
// EN : Submit the form to the API to create a new catway
// -----------------------------------------------------------------------------
exports.create = async (req, res) => {
  try {
    await axios.post(`${baseUrl(req)}/api/catways`, {
      catwayNumber: Number(req.body.catwayNumber),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    });
    res.redirect('/ui/catways'); // FR : Retour à la liste | EN : Back to list
  } catch (e) {
    res.render('catways/form', {
      title: 'Nouveau catway',
      mode: 'create',
      item: req.body,
      error: e.response?.data?.error || e.message
    });
  }
};

// -----------------------------------------------------------------------------
// GET /ui/catways/:id/edit
// FR : Récupère un catway via l’API et affiche le formulaire de modification
// EN : Fetch a catway via API and display the edit form
// -----------------------------------------------------------------------------
exports.editForm = async (req, res) => {
  try {
    const { data: item } = await axios.get(`${baseUrl(req)}/api/catways/${req.params.id}`);
    res.render('catways/form', { title: `Modifier #${req.params.id}`, mode: 'edit', item, error: null });
  } catch (e) {
    res.redirect('/ui/catways');
  }
};

// -----------------------------------------------------------------------------
// POST /ui/catways/:id/update
// FR : Met à jour un catway existant via l’API
// EN : Update an existing catway via the API
// -----------------------------------------------------------------------------
exports.update = async (req, res) => {
  try {
    await axios.put(`${baseUrl(req)}/api/catways/${req.params.id}`, {
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    });
    res.redirect('/ui/catways');
  } catch (e) {
    // FR : Si erreur, renvoie les données dans le formulaire pour correction
    // EN : If error, re-render the form with provided data for correction
    const item = {
      _id: req.params.id,
      catwayNumber: Number(req.params.id),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    };
    res.render('catways/form', {
      title: `Modifier #${req.params.id}`,
      mode: 'edit',
      item,
      error: e.response?.data?.error || e.message
    });
  }
};

// -----------------------------------------------------------------------------
// POST /ui/catways/:id/delete
// FR : Supprime un catway via l’API
// EN : Delete a catway via the API
// -----------------------------------------------------------------------------
exports.remove = async (req, res) => {
  try {
    await axios.delete(`${baseUrl(req)}/api/catways/${req.params.id}`);
    res.redirect('/ui/catways');
  } catch (e) {
    res.redirect('/ui/catways');
  }
};
