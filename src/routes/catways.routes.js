/**
 * @openapi
 * /api/catways:
 *   get:
 *     tags: [Catways]
 *     summary: Liste des catways
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *   post:
 *     tags: [Catways]
 *     summary: Créer un catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CatwayCreateInput'
 *     responses:
 *       201:
 *         description: Créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *
 * /api/catways/{id}:
 *   get:
 *     tags: [Catways]
 *     summary: Obtenir un catway par numéro
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   put:
 *     tags: [Catways]
 *     summary: Modifier un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CatwayUpdateInput'
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   delete:
 *     tags: [Catways]
 *     summary: Supprimer un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200: { description: Supprimé }
 *       404: { description: Introuvable }
 */

// FR : On importe Router d’Express
// EN : Import Router from Express
const router = require('express').Router();

// FR : On importe les helpers de validation express-validator (body, param)
// EN : Import express-validator helpers (body, param)
const { body, param } = require('express-validator');

// FR : On importe notre middleware custom validate()
// EN : Import our custom validate() middleware
const { validate } = require('../middleware/validate');

// FR : On importe le contrôleur Catways
// EN : Import the Catways controller
const ctrl = require('../controllers/catways.controller');

// ---------------------------
// FR : ROUTES
// EN : ROUTES
// ---------------------------

// FR : GET /api/catways → liste de tous les catways
// EN : GET /api/catways → list all catways
router.get('/catways', ctrl.list);

// FR : GET /api/catways/:id → récupérer un catway spécifique par son numéro
// EN : GET /api/catways/:id → get a specific catway by number
router.get(
  '/catways/:id',
  validate([
    param('id').isInt({ min: 1 }).withMessage('id doit être un entier >= 1'),
  ]),
  ctrl.getOne
);

// FR : POST /api/catways → créer un nouveau catway
// EN : POST /api/catways → create a new catway
router.post(
  '/catways',
  validate([
    body('catwayNumber').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
    body('catwayType').isIn(['long', 'short']).withMessage('catwayType: long|short'),
    body('catwayState').isString().isLength({ min: 2, max: 300 }).withMessage('catwayState longueur 2..300'),
  ]),
  ctrl.create
);

// FR : PUT /api/catways/:id → modifier un catway existant
// EN : PUT /api/catways/:id → update an existing catway
router.put(
  '/catways/:id',
  validate([
    param('id').isInt({ min: 1 }).withMessage('id entier >= 1'),
    body('catwayType').optional().isIn(['long', 'short']).withMessage('catwayType: long|short'),
    body('catwayState').optional().isString().isLength({ min: 2, max: 300 }).withMessage('catwayState longueur 2..300'),
  ]),
  ctrl.update
);

// FR : DELETE /api/catways/:id → supprimer un catway
// EN : DELETE /api/catways/:id → delete a catway
router.delete(
  '/catways/:id',
  validate([ param('id').isInt({ min: 1 }).withMessage('id entier >= 1') ]),
  ctrl.remove
);

// FR : On exporte le router pour l’utiliser dans app.js
// EN : Export router to use in app.js
module.exports = router;
