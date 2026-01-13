const db = require('../config/db');

const logActivity = async (action, description) => {
    try {
        await db.query(
            'INSERT INTO activity_logs (action, description) VALUES ($1, $2)',
            [action, description]
        );
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

module.exports = { logActivity };
