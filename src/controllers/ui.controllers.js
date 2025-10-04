// src/controllers/ui.controllers.js
const Catway = require('../models/Catway');

// -------- CATWAYS (UI) --------
exports.catwaysList = async (req, res) => {
  const items = await Catway.find().sort({ catwayNumber: 1 }).lean();
  res.render('catways_list', { title: 'Catways — CRUD', items, email: req.cookies?.userEmail || null });
};

exports.catwaysNewForm = (req, res) => {
  res.render('catways_form', {
    title: 'Nouveau catway',
    mode: 'create',
    item: { catwayNumber: '', catwayType: 'short', catwayState: '' },
    error: null,
    email: req.cookies?.userEmail || null,
  });
};

exports.catwaysCreate = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    await Catway.create({ catwayNumber, catwayType, catwayState });
    return res.redirect('/ui/catways');
  } catch (e) {
    return res.status(400).render('catways_form', {
      title: 'Nouveau catway',
      mode: 'create',
      item: req.body,
      error: e.message,
      email: req.cookies?.userEmail || null,
    });
  }
};

exports.catwaysEditForm = async (req, res) => {
  const id = Number(req.params.id);
  const item = await Catway.findOne({ catwayNumber: id }).lean();
  if (!item) return res.status(404).send('Catway introuvable');
  res.render('catways_form', { title: `Modifier catway #${id}`, mode: 'edit', item, error: null, email: req.cookies?.userEmail || null });
};

exports.catwaysUpdate = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { catwayType, catwayState } = req.body;
    await Catway.findOneAndUpdate({ catwayNumber: id }, { $set: { catwayType, catwayState } }, { runValidators: true });
    return res.redirect('/ui/catways');
  } catch (e) {
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

exports.catwaysDelete = async (req, res) => {
  const id = Number(req.params.id);
  await Catway.findOneAndDelete({ catwayNumber: id });
  return res.redirect('/ui/catways');
};