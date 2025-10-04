/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Liste des utilisateurs
 *     responses:
 *       200: { description: OK }
 *   post:
 *     tags: [Users]
 *     summary: Créer un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role]
 *             properties:
 *               name: { type: string, example: "Alice" }
 *               email: { type: string, example: "alice@example.com" }
 *               role: { type: string, enum: [user, admin], example: "user" }
 *     responses:
 *       201: { description: Créé }
 *       409: { description: Email déjà utilisé }
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtenir un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   put:
 *     tags: [Users]
 *     summary: Mettre à jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Supprimé }
 *       404: { description: Introuvable }
 */

const router = require('express').Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/users.controller');

router.get('/users', ctrl.list);

router.get('/users/:id',
  validate([ param('id').isMongoId().withMessage('id invalide') ]),
  ctrl.getOne
);

router.post('/users',
  validate([
    body('name').isString().trim().isLength({ min: 2, max: 120 }),
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(['user', 'admin'])
  ]),
  ctrl.create
);

router.put('/users/:id',
  validate([
    param('id').isMongoId(),
    body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['user', 'admin'])
  ]),
  ctrl.update
);

router.delete('/users/:id',
  validate([ param('id').isMongoId() ]),
  ctrl.remove
);

module.exports = router;
