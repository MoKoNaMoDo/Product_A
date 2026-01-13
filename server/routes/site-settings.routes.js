const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/site-settings.controller');

const upload = require('../middlewares/upload.middleware');

router.get('/', siteSettingsController.getSettings);
router.put('/', upload.fields([
    { name: 'hero_image', maxCount: 1 },
    { name: 'about_image', maxCount: 1 }
]), siteSettingsController.updateSettings);

module.exports = router;
