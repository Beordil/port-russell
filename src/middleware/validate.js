// FR : On importe validationResult depuis express-validator
// EN : Import validationResult from express-validator
const { validationResult } = require('express-validator');

/**
 * FR : Exécute les validations passées en tableau et renvoie 400 si erreurs.
 *      Exemple d’utilisation :
 *      router.post(..., validate([ body('x').notEmpty() ... ]), ctrl.create)
 *
 * EN : Runs the given array of validations and returns 400 if errors occur.
 *      Example usage:
 *      router.post(..., validate([ body('x').notEmpty() ... ]), ctrl.create)
 */
function validate(validations) {
  return async (req, res, next) => {
    // FR : On exécute chaque règle de validation sur la requête
    // EN : Execute each validation rule on the request
    for (const v of validations) {
      // eslint-disable-next-line no-await-in-loop
      await v.run(req);
    }

    // FR : Récupère le résultat des validations
    // EN : Collects the result of the validations
    const result = validationResult(req);

    // FR : Si aucune erreur → on passe au middleware suivant
    // EN : If no errors → proceed to next middleware
    if (result.isEmpty()) return next();

    // FR : Sinon, on renvoie un statut 400 avec la liste des erreurs
    // EN : Otherwise, return status 400 with the list of errors
    return res.status(400).json({ errors: result.array() });
  };
}

// FR : On exporte la fonction validate pour l’utiliser dans les routes
// EN : Export the validate function to use in routes
module.exports = { validate };
