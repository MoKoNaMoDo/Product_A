const express = require('express');
const router = express.Router();
const controller = require('../controllers/home-banners.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', controller.getAllBanners);
router.post('/', upload.single('image'), controller.addBanner);
router.delete('/:id', controller.deleteBanner);

module.exports = router;
