const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

router.post('/', contactController.submitMessage);
router.get('/', contactController.getAllMessages);
router.put('/:id/read', contactController.toggleReadStatus);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;
