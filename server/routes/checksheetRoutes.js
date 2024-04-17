const express = require('express');
const router = express.Router();
const checksheetController = require('../controllers/checksheetController');

router.get('/', checksheetController.getAll);
router.get('/:id', checksheetController.getOne);
router.post('/', checksheetController.create);
router.patch('/:id', checksheetController.update);
router.delete('/:id', checksheetController.delete);
router.post('/create', checksheetController.create);

module.exports = router;