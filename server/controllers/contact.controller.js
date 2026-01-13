const db = require('../config/db');
const { logActivity } = require('../utils/logger');

// Submit a new message
exports.submitMessage = async (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;

        const { rows } = await db.query(
            'INSERT INTO contact_messages (name, phone, email, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, phone, email, subject, message]
        );

        // Optional: notification logic here

        res.status(201).json({ message: 'Message sent successfully', data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all messages (Admin)
exports.getAllMessages = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Toggle Read Status
exports.toggleReadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_read } = req.body;

        const { rows } = await db.query(
            'UPDATE contact_messages SET is_read = $1 WHERE id = $2 RETURNING *',
            [is_read, id]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM contact_messages WHERE id = $1', [id]);

        await logActivity('DELETE_MESSAGE', `Deleted message ID: ${id}`);

        res.json({ message: 'Message deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
