const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { deleteFile } = require('../utils/file-handler');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, is_recommended } = req.body;
        let { image_url } = req.body;

        if (req.file) {
            image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const { rows } = await db.query(
            'INSERT INTO products (name, description, price, image_url, category, is_recommended) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, image_url, category, is_recommended || false]
        );
        await logActivity('CREATE_PRODUCT', `Created product: ${name}`);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, is_recommended } = req.body;
        let { image_url } = req.body;

        if (req.file) {
            // Fetch old image
            const oldProductRes = await db.query('SELECT image_url FROM products WHERE id = $1', [id]);
            if (oldProductRes.rows.length > 0 && oldProductRes.rows[0].image_url) {
                deleteFile(oldProductRes.rows[0].image_url);
            }

            image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else {
            // If no new image, keep the existing one
            // Check if image_url is provided in body (e.g. explicitly clearing it), otherwise fetch existing
            if (image_url === undefined) {
                const oldProductRes = await db.query('SELECT image_url FROM products WHERE id = $1', [id]);
                if (oldProductRes.rows.length > 0) {
                    image_url = oldProductRes.rows[0].image_url;
                }
            }
        }

        const { rows } = await db.query(
            'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, is_recommended = $6 WHERE id = $7 RETURNING *',
            [name, description, price, image_url, category, is_recommended, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await logActivity('UPDATE_PRODUCT', `Updated product ID: ${id}`);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (rows[0].image_url) {
            deleteFile(rows[0].image_url);
        }

        await logActivity('DELETE_PRODUCT', `Deleted product ID: ${id}`);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
