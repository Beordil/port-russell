const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// GET / -> page de login (et lien doc plus tard)
router.get('/', (req, res) => {
  const { error } = req.query;
  res.render('index', {
    title: 'Port Russell',
    error,
    userEmail: req.cookies?.userEmail || null
  });
});

// GET /dashboard -> protégé
router.get('/dashboard', requireAuth, (req, res) => {
  const email = req.cookies?.userEmail || 'capitaine@port.local';
  res.render('dashboard', { title: 'Tableau de bord', email });
});

module.exports = router;
