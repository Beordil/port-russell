// src/routes/reservations.routes.js
// -----------------------------------------------------------
// Reservations routes (flat + nested alias)
// Flat:
//   GET    /api/reservations
//   GET    /api/reservations/:id
//   POST   /api/reservations
//   PUT    /api/reservations/:id
//   DELETE /api/reservations/:id
//   GET    /api/reservations/availability
//
// Nested aliases (as required by the brief):
//   GET    /api/catways/:id/reservations
//   GET    /api/catways/:id/reservations/:resId
//   POST   /api/catways/:id/reservations
//   PUT    /api/catways/:id/reservations/:resId
//   DELETE /api/catways/:id/reservations/:resId
// -----------------------------------------------------------

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/reservations.controller');

// Helpers validations
const isMongoId = param('id').isMongoId().withMessage('id invalide');
const isResId   = param('resId').isMongoId().withMessage('idReservation invalide');
const isCatwayId = param('id').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1');

const createOrUpdateValidators = [
  body('catwayNumber').optional().isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
  body('clientName').isString().trim().isLength({ min: 2, max: 120 }).withMessage('clientName 2..120'),
  body('boatName').isString().trim().isLength({ min: 1, max: 120 }).withMessage('boatName 1..120'),
  body('startDate').isISO8601().withMessage('startDate ISO8601'),
  body('endDate').isISO8601().withMessage('endDate ISO8601'),
];

const updateValidators = [
  body('catwayNumber').optional().isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
  body('clientName').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('clientName 2..120'),
  body('boatName').optional().isString().trim().isLength({ min: 1, max: 120 }).withMessage('boatName 1..120'),
  body('startDate').optional().isISO8601().withMessage('startDate ISO8601'),
  body('endDate').optional().isISO8601().withMessage('endDate ISO8601'),
];

// IMPORTANT: declare "availability" BEFORE "/:id"
router.get(
  '/reservations/availability',
  [
    query('catwayNumber').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
    query('start').isISO8601().withMessage('start ISO8601'),
    query('end').isISO8601().withMessage('end ISO8601'),
  ],
  ctrl.availability
);

// ----- Flat CRUD -----
router.get('/reservations', ctrl.list);
router.get('/reservations/:id', isMongoId, ctrl.getOne);
router.post('/reservations', createOrUpdateValidators, ctrl.create);
router.put('/reservations/:id', isMongoId, updateValidators, ctrl.update);
router.delete('/reservations/:id', isMongoId, ctrl.remove);

// ----- Nested alias under catways -----
router.get('/catways/:id/reservations', isCatwayId, ctrl.list);
router.get('/catways/:id/reservations/:resId', isCatwayId, isResId, ctrl.getOne);
router.post('/catways/:id/reservations', isCatwayId, createOrUpdateValidators, ctrl.create);
router.put('/catways/:id/reservations/:resId', isCatwayId, isResId, updateValidators, ctrl.update);
router.delete('/catways/:id/reservations/:resId', isCatwayId, isResId, ctrl.remove);

module.exports = router;
