const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // Get visit count
        const visitResult = await db.query("SELECT count FROM visit_stats WHERE page = 'home'");
        const visitCount = visitResult.rows[0] ? visitResult.rows[0].count : 0;

        // Get total products
        const productResult = await db.query("SELECT COUNT(*) FROM products");
        const productCount = productResult.rows[0].count;

        // Get recent activities
        const logsResult = await db.query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10");
        const activities = logsResult.rows;

        res.json({
            visitCount,
            productCount,
            activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
