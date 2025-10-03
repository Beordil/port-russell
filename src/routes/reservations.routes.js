const router = require('express').Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/reservations.controller');

router.get('/reservations', ctrl.list);

router.get(
  '/reservations/:id',
  validate([ param('id').isMongoId().withMessage('id invalide') ]),
  ctrl.getOne
);

router.post(
  '/reservations',
  validate([
    body('catwayNumber').isInt({ min: 1 }),
    body('clientName').isString().isLength({ min: 2, max: 100 }),
    body('boatName').isString().isLength({ min: 2, max: 100 }),
    body('startDate').isISO8601().withMessage('startDate ISO8601'),
    body('endDate').isISO8601().withMessage('endDate ISO8601')
  ]),
  ctrl.create
);

module.exports = router;
// PUT
router.put(
  '/reservations/:id',
  validate([
    param('id').isMongoId(),
    body('catwayNumber').isInt({ min: 1 }),
    body('clientName').isString().isLength({ min: 2, max: 100 }),
    body('boatName').isString().isLength({ min: 2, max: 100 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601()
  ]),
  ctrl.update
);

// DELETE
router.delete(
  '/reservations/:id',
  validate([ param('id').isMongoId() ]),
  ctrl.remove
);
