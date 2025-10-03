// FR : On importe Router depuis Express pour définir un sous-ensemble de routes
// EN : Import Router from Express to define a subset of routes
const router = require('express').Router();

// FR : On importe les fonctions login et logout depuis le contrôleur d’authentification
// EN : Import login and logout functions from the authentication controller
const { login, logout } = require('../controllers/auth.controller');

// FR : Déclare la route POST /login pour traiter les connexions
// EN : Declare POST /login route to handle logins
router.post('/login', login);

// FR : Déclare la route GET /logout pour gérer la déconnexion
// EN : Declare GET /logout route to handle logouts
router.get('/logout', logout);

// FR : On exporte le router pour l’utiliser dans l’app principale
// EN : Export the router to be used in the main app
module.exports = router;
