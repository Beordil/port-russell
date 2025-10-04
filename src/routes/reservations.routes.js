// -----------------------------------------------------------------------------
// FR : Routes pour les réservations (API REST + alias imbriqués)
// EN : Reservations routes (REST API + nested aliases)
// -----------------------------------------------------------------------------
//
// FR : Deux types de routes sont disponibles :
//      - Routes "plates" : /api/reservations...
//      - Routes "imbriquées" : /api/catways/:id/reservations...
//
// EN : Two types of routes are supported:
//      - Flat routes: /api/reservations...
//      - Nested routes: /api/catways/:id/reservations...
//
// -----------------------------------------------------------------------------
// Exemple de routes (brief du projet) / Example routes (project brief):
//
// FLAT ROUTES:
//   GET    /api/reservations
//   GET    /api/reservations/:id
//   POST   /api/reservations
//   PUT    /api/reservations/:id
//   DELETE /api/reservations/:id
//   GET    /api/reservations/availability
//
// NESTED ROUTES (sous catways / under catways):
//   GET    /api/catways/:id/reservations
//   GET    /api/catways/:id/reservations/:resId
//   POST   /api/catways/:id/reservations
//   PUT    /api/catways/:id/reservations/:resId
//   DELETE /api/catways/:id/reservations/:resId
// -----------------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/reservations.controller');

// -----------------------------------------------------------------------------
// FR : VALIDATEURS — Sécurisent les données entrantes
// EN : VALIDATORS — Validate and sanitize incoming data
// -----------------------------------------------------------------------------

// FR : Vérifie si l’ID de réservation est un ID MongoDB valide
// EN : Validates if reservation ID is a valid MongoDB ObjectId
const isMongoId = param('id').isMongoId().withMessage('id invalide');

// FR : Vérifie si l’ID spécifique d’une réservation imbriquée est valide
// EN : Validates if nested reservation ID is valid
const isResId = param('resId').isMongoId().withMessage('idReservation invalide');

// FR : Vérifie si le numéro de catway est un entier ≥ 1
// EN : Validates that catwayNumber is an integer ≥ 1
const isCatwayId = param('id').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1');

// FR : Validation pour la création ou mise à jour complète d’une réservation
// EN : Validation rules for creating or fully updating a reservation
const createOrUpdateValidators = [
  body('catwayNumber').optional().isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
  body('clientName').isString().trim().isLength({ min: 2, max: 120 }).withMessage('clientName 2..120'),
  body('boatName').isString().trim().isLength({ min: 1, max: 120 }).withMessage('boatName 1..120'),
  body('startDate').isISO8601().withMessage('startDate ISO8601'),
  body('endDate').isISO8601().withMessage('endDate ISO8601'),
];

// FR : Validation partielle (pour PUT)
// EN : Partial validation for PUT requests
const updateValidators = [
  body('catwayNumber').optional().isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
  body('clientName').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('clientName 2..120'),
  body('boatName').optional().isString().trim().isLength({ min: 1, max: 120 }).withMessage('boatName 1..120'),
  body('startDate').optional().isISO8601().withMessage('startDate ISO8601'),
  body('endDate').optional().isISO8601().withMessage('endDate ISO8601'),
];

// -----------------------------------------------------------------------------
// FR : ROUTE DISPONIBILITÉ (à déclarer avant les routes avec “:id”)
// EN : AVAILABILITY ROUTE (must be declared before “:id” routes)
// -----------------------------------------------------------------------------
//
// FR : Vérifie si un catway est libre pour une période donnée
// EN : Checks if a catway is available during a given time range
router.get(
  '/reservations/availability',
  [
    query('catwayNumber').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
    query('start').isISO8601().withMessage('start ISO8601'),
    query('end').isISO8601().withMessage('end ISO8601'),
  ],
  ctrl.availability
);

// -----------------------------------------------------------------------------
// FR : ROUTES CRUD "PLATES" (accès direct à /api/reservations)
// EN : FLAT CRUD ROUTES (direct access to /api/reservations)
// -----------------------------------------------------------------------------
router.get('/reservations', ctrl.list);                       // FR : Liste toutes les réservations | EN : List all reservations
router.get('/reservations/:id', isMongoId, ctrl.getOne);      // FR : Récupère une réservation      | EN : Get one reservation
router.post('/reservations', createOrUpdateValidators, ctrl.create);  // FR : Crée une réservation | EN : Create a new reservation
router.put('/reservations/:id', isMongoId, updateValidators, ctrl.update); // FR : Met à jour une réservation | EN : Update a reservation
router.delete('/reservations/:id', isMongoId, ctrl.remove);   // FR : Supprime une réservation      | EN : Delete a reservation

// -----------------------------------------------------------------------------
// FR : ROUTES CRUD IMBRIQUÉES (alias sous /api/catways/:id/...)
// EN : NESTED CRUD ROUTES (alias under /api/catways/:id/...)
// -----------------------------------------------------------------------------
router.get('/catways/:id/reservations', isCatwayId, ctrl.list);                         // FR : Liste réservations d’un catway | EN : List reservations of a catway
router.get('/catways/:id/reservations/:resId', isCatwayId, isResId, ctrl.getOne);       // FR : Récupère une réservation liée | EN : Get one reservation for a catway
router.post('/catways/:id/reservations', isCatwayId, createOrUpdateValidators, ctrl.create); // FR : Crée une réservation liée | EN : Create reservation linked to catway
router.put('/catways/:id/reservations/:resId', isCatwayId, isResId, updateValidators, ctrl.update); // FR : Met à jour une réservation liée | EN : Update linked reservation
router.delete('/catways/:id/reservations/:resId', isCatwayId, isResId, ctrl.remove);    // FR : Supprime une réservation liée | EN : Delete linked reservation

// -----------------------------------------------------------------------------
// FR : Export du routeur
// EN : Export router
// -----------------------------------------------------------------------------
module.exports = router;
