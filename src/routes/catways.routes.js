const router = require('express').Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/catways.controller');

// GET - lecture
router.get('/catways', ctrl.list);

router.get(
  '/catways/:id',
  validate([
    param('id').isInt({ min: 1 }).withMessage('id doit être un entier >= 1'),
  ]),
  ctrl.getOne
);

// POST - création
router.post(
  '/catways',
  validate([
    body('catwayNumber').isInt({ min: 1 }).withMessage('catwayNumber entier >= 1'),
    body('catwayType').isIn(['long', 'short']).withMessage('catwayType: long|short'),
    body('catwayState').isString().isLength({ min: 2, max: 300 }).withMessage('catwayState longueur 2..300'),
  ]),
  ctrl.create
);

// PUT - mise à jour (seul type/state modifiables)
router.put(
  '/catways/:id',
  validate([
    param('id').isInt({ min: 1 }).withMessage('id entier >= 1'),
    body('catwayType').optional().isIn(['long', 'short']).withMessage('catwayType: long|short'),
    body('catwayState').optional().isString().isLength({ min: 2, max: 300 }).withMessage('catwayState longueur 2..300'),
  ]),
  ctrl.update
);

// DELETE - suppression
router.delete(
  '/catways/:id',
  validate([ param('id').isInt({ min: 1 }).withMessage('id entier >= 1') ]),
  ctrl.remove
);

module.exports = router;
