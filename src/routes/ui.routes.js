// src/routes/ui.routes.js
const router = require('express').Router();
const ui = require('../controllers/ui.controllers');
const { requireAuth } = require('../middleware/auth');

// Catways (UI)
router.get('/ui/catways', requireAuth, ui.catwaysList);
router.get('/ui/catways/new', requireAuth, ui.catwaysNewForm);
router.post('/ui/catways', requireAuth, ui.catwaysCreate);
router.get('/ui/catways/:id/edit', requireAuth, ui.catwaysEditForm);
router.post('/ui/catways/:id/update', requireAuth, ui.catwaysUpdate);
router.post('/ui/catways/:id/delete', requireAuth, ui.catwaysDelete);

module.exports = router;
