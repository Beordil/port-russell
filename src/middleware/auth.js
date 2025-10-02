// Très simple : on vérifie juste la présence d'un cookie "tokenDemo"
function requireAuth(req, res, next) {
  const token = req.cookies?.tokenDemo;
  if (!token) {
    // pas connecté -> retour à l'accueil avec un message
    return res.redirect('/?error=login');
  }
  next();
}

module.exports = { requireAuth };
