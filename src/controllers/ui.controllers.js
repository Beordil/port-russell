// -----------------------------------------------------------------------------
// src/controllers/ui.controllers.js
// -----------------------------------------------------------------------------
// FR : Contrôleur pour gérer la partie "interface utilisateur" (UI) des Catways.
// EN : Controller handling the user interface (UI) for Catways management.
//
// ⚙️ Ce fichier gère uniquement l’affichage et les formulaires (EJS),
//     pas l’API. L’objectif est de permettre la gestion via navigateur.
//
// Routes principales :
// - GET  /ui/catways           → Liste des catways
// - GET  /ui/catways/new       → Formulaire de création
// - POST /ui/catways/new       → Création
// - GET  /ui/catways/:id/edit  → Formulaire d’édition
// - POST /ui/catways/:id/edit  → Mise à jour
// - POST /ui/catways/:id/delete→ Suppression
// -----------------------------------------------------------------------------

const Catway = require('../models/Catway');

// -----------------------------------------------------------------------------
// FR : Affiche la liste complète des catways (page principale CRUD)
// EN : Displays the complete list of catways (main CRUD page)
// -----------------------------------------------------------------------------
exports.catwaysList = async (req, res) => {
  const items = await Catway.find().sort({ catwayNumber: 1 }).lean();

  // FR : Rend la vue avec les données
  // EN : Render the view with fetched data
  res.render('catways_list', {
    title: 'Catways — CRUD',
    items,
    email: req.cookies?.userEmail || null,
  });
};

// -----------------------------------------------------------------------------
// FR : Affiche le formulaire de création d’un nouveau catway
// EN : Displays the form for creating a new catway
// -----------------------------------------------------------------------------
exports.catwaysNewForm = (req, res) => {
  res.render('catways_form', {
    title: 'Nouveau catway',
    mode: 'create', // FR : mode création | EN : creation mode
    item: { catwayNumber: '', catwayType: 'short', catwayState: '' },
    error: null,
    email: req.cookies?.userEmail || null,
  });
};

// -----------------------------------------------------------------------------
// FR : Crée un nouveau catway après soumission du formulaire
// EN : Creates a new catway after form submission
// -----------------------------------------------------------------------------
exports.catwaysCreate = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // FR : Enregistre en base de données
    // EN : Save to the database
    await Catway.create({ catwayNumber, catwayType, catwayState });

    return res.redirect('/ui/catways'); // FR : Redirige vers la liste | EN : Redirect to list
  } catch (e) {
    // FR : Si erreur, réaffiche le formulaire avec message
    // EN : If error, re-render form with error message
    return res.status(400).render('catways_form', {
      title: 'Nouveau catway',
      mode: 'create',
      item: req.body,
      error: e.message,
      email: req.cookies?.userEmail || null,
    });
  }
};

// -----------------------------------------------------------------------------
// FR : Affiche le formulaire d’édition d’un catway existant
// EN : Displays edit form for an existing catway
// -----------------------------------------------------------------------------
exports.catwaysEditForm = async (req, res) => {
  const id = Number(req.params.id);
  const item = await Catway.findOne({ catwayNumber: id }).lean();

  if (!item) {
    return res.status(404).send('Catway introuvable'); // EN : Catway not found
  }

  res.render('catways_form', {
    title: `Modifier catway #${id}`,
    mode: 'edit',
    item,
    error: null,
    email: req.cookies?.userEmail || null,
  });
};

// -----------------------------------------------------------------------------
// FR : Met à jour un catway existant après soumission du formulaire
// EN : Updates an existing catway after form submission
// -----------------------------------------------------------------------------
exports.catwaysUpdate = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { catwayType, catwayState } = req.body;

    // FR : Met à jour en base
    // EN : Update in database
    await Catway.findOneAndUpdate(
      { catwayNumber: id },
      { $set: { catwayType, catwayState } },
      { runValidators: true }
    );

    return res.redirect('/ui/catways');
  } catch (e) {
    // FR : En cas d’erreur, recharge la page avec message d’erreur
    // EN : On error, reload page with error message
    const item = await Catway.findOne({ catwayNumber: id }).lean();

    return res.status(400).render('catways_form', {
      title: `Modifier catway #${id}`,
      mode: 'edit',
      item,
      error: e.message,
      email: req.cookies?.userEmail || null,
    });
  }
};

// -----------------------------------------------------------------------------
// FR : Supprime un catway existant (via bouton ou formulaire)
// EN : Deletes an existing catway (via button or form)
// -----------------------------------------------------------------------------
exports.catwaysDelete = async (req, res) => {
  const id = Number(req.params.id);

  // FR : Supprime en base
  // EN : Delete from database
  await Catway.findOneAndDelete({ catwayNumber: id });

  return res.redirect('/ui/catways');
};
