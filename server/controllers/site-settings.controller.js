const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { deleteFile } = require('../utils/file-handler');

// Get all site settings
exports.getSettings = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM site_settings');
        // Convert array to object { key_name: value_content }
        const settings = rows.reduce((acc, row) => {
            acc[row.key_name] = row.value_content;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update site settings
exports.updateSettings = async (req, res) => {
    try {
        const settings = { ...req.body };

        // Handle uploaded files
        if (req.files) {
            // Fetch current settings to get old image URLs
            const { rows: currentRows } = await db.query("SELECT key_name, value_content FROM site_settings WHERE key_name IN ('hero_image', 'about_image')");
            const currentSettings = currentRows.reduce((acc, row) => {
                acc[row.key_name] = row.value_content;
                return acc;
            }, {});

            if (req.files['hero_image']) {
                if (currentSettings['hero_image']) {
                    deleteFile(currentSettings['hero_image']);
                }
                settings['hero_image'] = `${req.protocol}://${req.get('host')}/uploads/${req.files['hero_image'][0].filename}`;
            }
            if (req.files['about_image']) {
                if (currentSettings['about_image']) {
                    deleteFile(currentSettings['about_image']);
                }
                settings['about_image'] = `${req.protocol}://${req.get('host')}/uploads/${req.files['about_image'][0].filename}`;
            }
        }

        const promises = Object.keys(settings).map(key => {
            return db.query(
                'INSERT INTO site_settings (key_name, value_content) VALUES ($1, $2) ON CONFLICT (key_name) DO UPDATE SET value_content = $2',
                [key, settings[key]]
            );
        });

        await Promise.all(promises);
        await logActivity('UPDATE_SETTINGS', 'Updated site settings');
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
