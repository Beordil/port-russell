// FR : Middleware très simple : vérifie seulement la présence d’un cookie "tokenDemo"
// EN : Very simple middleware: just checks for the presence of a "tokenDemo" cookie
function requireAuth(req, res, next) {
  // FR : Récupère le cookie "tokenDemo" si présent
  // EN : Retrieves the "tokenDemo" cookie if present
  const token = req.cookies?.tokenDemo;

  // FR : Si le cookie est absent → utilisateur non connecté → redirection vers la page d’accueil
  // EN : If the cookie is missing → user not logged in → redirect to homepage
  if (!token) {
    return res.redirect('/?error=login');
  }

  // FR : Sinon, l’utilisateur est considéré comme connecté → on passe au middleware suivant
  // EN : Otherwise, the user is considered logged in → continue to the next middleware
  next();
}

// FR : On exporte le middleware pour l’utiliser dans les routes protégées
// EN : Export the middleware to use it in protected routes
module.exports = { requireAuth };
