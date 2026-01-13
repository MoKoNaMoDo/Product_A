const express = require('express');
const router = express.Router();
const coreValuesController = require('../controllers/core-values.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', coreValuesController.getAllValues);
router.post('/', upload.single('image'), coreValuesController.createValue);
router.put('/:id', upload.single('image'), coreValuesController.updateValue);
router.delete('/:id', coreValuesController.deleteValue);

module.exports = router;
