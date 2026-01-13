const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/site-settings.controller');

router.get('/', siteSettingsController.getSettings);
router.put('/', siteSettingsController.updateSettings);

module.exports = router;
