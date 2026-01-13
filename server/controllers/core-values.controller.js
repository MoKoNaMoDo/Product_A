const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { deleteFile } = require('../utils/file-handler');

exports.getAllValues = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM core_values ORDER BY order_index ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createValue = async (req, res) => {
    try {
        const { title, description, is_visible } = req.body;
        let image_url = '';

        if (req.file) {
            image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const { rows } = await db.query(
            'INSERT INTO core_values (title, description, image_url, is_visible) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, image_url, is_visible === undefined ? true : is_visible]
        );
        await logActivity('CREATE_CORE_VALUE', `Created core value: ${title}`);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateValue = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, is_visible } = req.body;

        let query = 'UPDATE core_values SET ';
        const values = [];
        let idx = 1;

        if (title !== undefined) { query += `title = $${idx++}, `; values.push(title); }
        if (description !== undefined) { query += `description = $${idx++}, `; values.push(description); }
        if (is_visible !== undefined) { query += `is_visible = $${idx++}, `; values.push(is_visible); }

        if (req.file) {
            // Fetch old image to delete
            const oldValRes = await db.query('SELECT image_url FROM core_values WHERE id = $1', [id]);
            if (oldValRes.rows.length > 0 && oldValRes.rows[0].image_url) {
                deleteFile(oldValRes.rows[0].image_url);
            }

            const image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            query += `image_url = $${idx++}, `;
            values.push(image_url);
        }

        if (values.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        query = query.slice(0, -2); // remove trailing comma
        query += ` WHERE id = $${idx} RETURNING *`;
        values.push(id);

        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Value not found' });
        }

        await logActivity('UPDATE_CORE_VALUE', `Updated core value ID: ${id}`);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteValue = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM core_values WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Value not found' });
        }

        if (rows[0].image_url) {
            deleteFile(rows[0].image_url);
        }

        await logActivity('DELETE_CORE_VALUE', `Deleted core value ID: ${id}`);
        res.json({ message: 'Core value deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
