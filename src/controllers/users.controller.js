// -----------------------------------------------------------------------------
// src/controllers/users.controller.js
// -----------------------------------------------------------------------------
// FR : Contrôleur CRUD pour la gestion des utilisateurs (API REST)
// EN : CRUD Controller for user management (REST API)
//
// ⚙️ Objectif : gérer les utilisateurs via des requêtes API
//    - Liste des utilisateurs
//    - Lecture d’un utilisateur spécifique
//    - Création / Mise à jour / Suppression
//
// Routes principales :
// - GET    /api/users           → Liste de tous les utilisateurs
// - GET    /api/users/:id       → Détails d’un utilisateur
// - POST   /api/users           → Création d’un utilisateur
// - PUT    /api/users/:id       → Mise à jour d’un utilisateur
// - DELETE /api/users/:id       → Suppression d’un utilisateur
// -----------------------------------------------------------------------------

const User = require('../models/User');

// -----------------------------------------------------------------------------
// FR : Récupère la liste de tous les utilisateurs (triés du plus récent au plus ancien)
// EN : Retrieves all users (sorted newest to oldest)
// -----------------------------------------------------------------------------
exports.list = async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 }).lean();
  res.json(items);
};

// -----------------------------------------------------------------------------
// FR : Récupère un utilisateur spécifique par son ID
// EN : Retrieves a specific user by ID
// -----------------------------------------------------------------------------
exports.getOne = async (req, res) => {
  const { id } = req.params;

  // FR : Cherche l'utilisateur dans la base
  // EN : Find the user in the database
  const item = await User.findById(id).lean();

  if (!item) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  res.json(item);
};

// -----------------------------------------------------------------------------
// FR : Crée un nouvel utilisateur
// EN : Creates a new user
// -----------------------------------------------------------------------------
exports.create = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // FR : Crée un document dans MongoDB
    // EN : Create a new document in MongoDB
    const created = await User.create({ name, email, role });

    res.status(201).json(created);
  } catch (e) {
    // FR : Gestion d’un conflit (email déjà existant)
    // EN : Handle conflict (email already exists)
    if (e?.code === 11000) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    res.status(400).json({ error: 'Création impossible', details: e.message });
  }
};

// -----------------------------------------------------------------------------
// FR : Met à jour un utilisateur existant
// EN : Updates an existing user
// -----------------------------------------------------------------------------
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    // FR : Met à jour les champs fournis, en validant le schéma
    // EN : Update provided fields while validating schema
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    res.json(updated);
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    res.status(400).json({ error: 'Mise à jour impossible', details: e.message });
  }
};

// -----------------------------------------------------------------------------
// FR : Supprime un utilisateur existant
// EN : Deletes an existing user
// -----------------------------------------------------------------------------
exports.remove = async (req, res) => {
  const { id } = req.params;

  // FR : Supprime le document correspondant à l’ID
  // EN : Delete document matching the ID
  const deleted = await User.findByIdAndDelete(id).lean();

  if (!deleted) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  res.json({ ok: true, deleted });
};
