/**
 * Affiche le formulaire (on utilise / pour ça dans pages.routes)
 * Ici on gère seulement POST /login et GET /logout
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Étape 2 : on accepte tout (juste non vide) -> on simulera un login réussi
  if (!email || !password) {
    return res.redirect('/?error=missing');
  }

  // On pose un cookie de démo pour 2 heures
  res.cookie('tokenDemo', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000
  });

  // On pourrait stocker l'email dans un autre cookie non httpOnly si on veut l'afficher
  res.cookie('userEmail', email, { sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 });

  return res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  res.clearCookie('tokenDemo');
  res.clearCookie('userEmail');
  return res.redirect('/');
};
