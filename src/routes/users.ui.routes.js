// FR : Routes UI pour gérer les écrans Users (liste + formulaire)
// EN : UI routes for Users screens (list + form)
const router = require('express').Router();
const axios = require('axios');

// Base URL de l'API (local ou Render). Par défaut, on réutilise la même origine.
function apiBase(req) {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// Liste
router.get('/ui/users', async (req, res) => {
  try {
    const { data: items } = await axios.get(`${apiBase(req)}/api/users`);
    res.render('users/list', { title: 'Utilisateurs', items });
  } catch (e) {
    res.status(500).send('Erreur UI users (list)');
  }
});

// Formulaire création
router.get('/ui/users/new', (_req, res) => {
  res.render('users/form', { title: 'Nouvel utilisateur', mode: 'create', item: { name:'', email:'', role:'user' }, error: null });
});

// Création
router.post('/ui/users/new', async (req, res) => {
  try {
    await axios.post(`${apiBase(req)}/api/users`, req.body);
    res.redirect('/ui/users');
  } catch (e) {
    const msg = e?.response?.data?.error || 'Erreur création';
    res.status(400).render('users/form', { title: 'Nouvel utilisateur', mode: 'create', item: req.body, error: msg });
  }
});

// Formulaire édition
router.get('/ui/users/:id/edit', async (req, res) => {
  try {
    const { data: item } = await axios.get(`${apiBase(req)}/api/users/${req.params.id}`);
    res.render('users/form', { title: 'Modifier utilisateur', mode: 'edit', item, error: null });
  } catch (e) {
    res.status(404).send('Utilisateur introuvable');
  }
});

// Mise à jour
router.post('/ui/users/:id/update', async (req, res) => {
  try {
    await axios.put(`${apiBase(req)}/api/users/${req.params.id}`, req.body);
    res.redirect('/ui/users');
  } catch (e) {
    const msg = e?.response?.data?.error || 'Erreur mise à jour';
    // On recharge l'item actuel pour réafficher le formulaire
    const { data: item } = await axios.get(`${apiBase(req)}/api/users/${req.params.id}`).catch(() => ({ data: req.body }));
    res.status(400).render('users/form', { title: 'Modifier utilisateur', mode: 'edit', item, error: msg });
  }
});

// Suppression
router.post('/ui/users/:id/delete', async (req, res) => {
  try {
    await axios.delete(`${apiBase(req)}/api/users/${req.params.id}`);
    res.redirect('/ui/users');
  } catch (e) {
    res.status(400).send('Suppression impossible');
  }
});

module.exports = router;
