const router = require('express').Router();
const ctrl = require('../controllers/catways.controller');

router.get('/catways', ctrl.list);
router.get('/catways/:id', ctrl.getOne);

module.exports = router;
