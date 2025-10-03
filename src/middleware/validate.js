const { validationResult } = require('express-validator');

/**
 * Exécute les validations passées en tableau et renvoie 400 si erreurs.
 * Usage: router.post(..., validate([ body('x').notEmpty() ... ]), ctrl.create)
 */
function validate(validations) {
  return async (req, res, next) => {
    for (const v of validations) { // exécute chaque règle
      // eslint-disable-next-line no-await-in-loop
      await v.run(req);
    }
    const result = validationResult(req);
    if (result.isEmpty()) return next();
    return res.status(400).json({ errors: result.array() });
  };
}

module.exports = { validate };
