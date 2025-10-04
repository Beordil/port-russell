// -----------------------------------------------------------------------------
// FR : Routes API REST pour la gestion des utilisateurs
// EN : REST API routes for user management
// -----------------------------------------------------------------------------
//
// FR : Ces routes gèrent les opérations CRUD sur les utilisateurs :
//      - GET    /api/users           → liste complète
//      - GET    /api/users/:id       → récupérer un utilisateur
//      - POST   /api/users           → créer un utilisateur
//      - PUT    /api/users/:id       → mettre à jour un utilisateur
//      - DELETE /api/users/:id       → supprimer un utilisateur
//
// EN : These routes handle CRUD operations for users:
//      - GET    /api/users           → list all users
//      - GET    /api/users/:id       → get a single user
//      - POST   /api/users           → create a new user
//      - PUT    /api/users/:id       → update an existing user
//      - DELETE /api/users/:id       → delete a user
//
// -----------------------------------------------------------------------------
// FR : Documentation OpenAPI (Swagger)
// EN : OpenAPI (Swagger) documentation
// -----------------------------------------------------------------------------
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Liste des utilisateurs / List all users
 *     responses:
 *       200: { description: OK }
 *
 *   post:
 *     tags: [Users]
 *     summary: Créer un utilisateur / Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role]
 *             properties:
 *               name:  { type: string, example: "Alice" }
 *               email: { type: string, example: "alice@example.com" }
 *               role:  { type: string, enum: [user, admin], example: "user" }
 *     responses:
 *       201: { description: Créé / Created }
 *       409: { description: Email déjà utilisé / Email already used }
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtenir un utilisateur / Get a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable / Not found }
 *
 *   put:
 *     tags: [Users]
 *     summary: Mettre à jour un utilisateur / Update a user
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
 *               name:  { type: string }
 *               email: { type: string }
 *               role:  { type: string, enum: [user, admin] }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable / Not found }
 *
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur / Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Supprimé / Deleted }
 *       404: { description: Introuvable / Not found }
 */

// -----------------------------------------------------------------------------
// FR : Imports nécessaires
// EN : Required imports
// -----------------------------------------------------------------------------
const router = require('express').Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/users.controller');

// -----------------------------------------------------------------------------
// FR : Récupérer tous les utilisateurs
// EN : Get all users
// -----------------------------------------------------------------------------
router.get('/users', ctrl.list);

// -----------------------------------------------------------------------------
// FR : Récupérer un utilisateur spécifique par ID
// EN : Get a specific user by ID
// -----------------------------------------------------------------------------
router.get(
  '/users/:id',
  validate([ param('id').isMongoId().withMessage('id invalide / invalid id') ]),
  ctrl.getOne
);

// -----------------------------------------------------------------------------
// FR : Créer un nouvel utilisateur
// EN : Create a new user
// -----------------------------------------------------------------------------
router.post(
  '/users',
  validate([
    body('name')
      .isString().trim()
      .isLength({ min: 2, max: 120 })
      .withMessage('Nom entre 2 et 120 caractères / Name 2..120 chars'),
    body('email')
      .isEmail().normalizeEmail()
      .withMessage('Email invalide / Invalid email'),
    body('role')
      .isIn(['user', 'admin'])
      .withMessage('Rôle invalide / Invalid role'),
  ]),
  ctrl.create
);

// -----------------------------------------------------------------------------
// FR : Mettre à jour un utilisateur existant
// EN : Update an existing user
// -----------------------------------------------------------------------------
router.put(
  '/users/:id',
  validate([
    param('id').isMongoId().withMessage('id invalide / invalid id'),
    body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['user', 'admin']),
  ]),
  ctrl.update
);

// -----------------------------------------------------------------------------
// FR : Supprimer un utilisateur
// EN : Delete a user
// -----------------------------------------------------------------------------
router.delete(
  '/users/:id',
  validate([ param('id').isMongoId().withMessage('id invalide / invalid id') ]),
  ctrl.remove
);

// -----------------------------------------------------------------------------
// FR : Export du routeur pour l'utiliser dans le serveur principal
// EN : Export the router for use in the main server
// -----------------------------------------------------------------------------
module.exports = router;
