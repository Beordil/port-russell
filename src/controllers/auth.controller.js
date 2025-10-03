/**
 * FR : Affiche le formulaire (utilisé dans pages.routes via "/")
 *      Ici, ce fichier gère uniquement POST /login et GET /logout
 * EN : Displays the form (used in pages.routes with "/")
 *      Here, this file only handles POST /login and GET /logout
 */
exports.login = (req, res) => {
  // FR : On récupère l'email et le mot de passe envoyés dans le corps de la requête
  // EN : Retrieve the email and password sent in the request body
  const { email, password } = req.body;

  // FR : Étape 2 : on accepte tout tant que ce n’est pas vide → on simule un login réussi
  // EN : Step 2: accept any non-empty values → simulate a successful login
  if (!email || !password) {
    // FR : Si un champ est manquant, on redirige vers la page d’accueil avec un paramètre d’erreur
    // EN : If a field is missing, redirect to the homepage with an error parameter
    return res.redirect('/?error=missing');
  }

  // FR : On crée un cookie de démonstration "tokenDemo" valable 2 heures
  //      - httpOnly: inaccessible en JS côté client
  //      - sameSite: limite l’envoi aux contextes "lax"
  //      - maxAge: durée de vie en millisecondes (2h)
  // EN : Set a demo cookie "tokenDemo" valid for 2 hours
  //      - httpOnly: not accessible via client-side JS
  //      - sameSite: restricts sending to "lax" contexts
  //      - maxAge: lifespan in milliseconds (2h)
  res.cookie('tokenDemo', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000
  });

  // FR : On peut aussi stocker l’email dans un cookie visible côté client (non httpOnly)
  // EN : Optionally store the email in a non-httpOnly cookie to display it client-side
  res.cookie('userEmail', email, { sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 });

  // FR : Enfin, on redirige vers le tableau de bord
  // EN : Finally, redirect to the dashboard
  return res.redirect('/dashboard');
};

// FR : Fonction de déconnexion
// EN : Logout function
exports.logout = (req, res) => {
  // FR : Supprime les cookies de session
  // EN : Clears session cookies
  res.clearCookie('tokenDemo');
  res.clearCookie('userEmail');

  // FR : Redirige vers la page d’accueil après déconnexion
  // EN : Redirects to the homepage after logout
  return res.redirect('/');
};
