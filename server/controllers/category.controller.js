const db = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const { rows } = await db.query(
            'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
            [name, slug]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ message: 'Category already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a category (Rename and Cascade)
exports.updateCategory = async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // 1. Get old category name
        const oldCatRes = await client.query('SELECT name FROM categories WHERE id = $1', [id]);
        if (oldCatRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Category not found' });
        }
        const oldName = oldCatRes.rows[0].name;

        // 2. Update Category List
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const { rows } = await client.query(
            'UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *',
            [name, slug, id]
        );

        // 3. Update Products that used this category
        await client.query('UPDATE products SET category = $1 WHERE category = $2', [name, oldName]);

        await client.query('COMMIT');
        res.json(rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
