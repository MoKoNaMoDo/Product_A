const db = require('../config/db');

const initDb = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                action VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS visit_stats (
                id SERIAL PRIMARY KEY,
                page VARCHAR(50) DEFAULT 'home',
                count INTEGER DEFAULT 0
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS core_values (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url TEXT,
                order_index INTEGER DEFAULT 0,
                is_visible BOOLEAN DEFAULT TRUE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS home_banners (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Initialize visit counter if not exists
        const { rows } = await db.query("SELECT * FROM visit_stats WHERE page = 'home'");
        if (rows.length === 0) {
            await db.query("INSERT INTO visit_stats (page, count) VALUES ('home', 0)");
        }

        console.log('Database tables initialized (activity_logs, visit_stats)');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

module.exports = initDb;
