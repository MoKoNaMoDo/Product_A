const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { deleteFile } = require('../utils/file-handler');

exports.getAllBanners = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM home_banners ORDER BY order_index ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addBanner = async (req, res) => {
    try {
        // Check limit
        const countRes = await db.query('SELECT COUNT(*) FROM home_banners');
        const count = parseInt(countRes.rows[0].count);

        if (count >= 5) {
            return res.status(400).json({ message: 'Maximum 5 banners allowed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const { rows } = await db.query(
            'INSERT INTO home_banners (image_url, order_index) VALUES ($1, $2) RETURNING *',
            [image_url, count]
        );

        await logActivity('ADD_BANNER', `Added new home banner ID: ${rows[0].id}`);
        res.status(201).json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM home_banners WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Delete file
        deleteFile(rows[0].image_url);

        await logActivity('DELETE_BANNER', `Deleted home banner ID: ${id}`);
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
