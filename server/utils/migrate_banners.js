const db = require('../config/db');

const migrate = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS home_banners (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Migration successful: home_banners table created.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
