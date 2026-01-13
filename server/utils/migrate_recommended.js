const db = require('../config/db');

const migrateRecommended = async () => {
    try {
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE;
        `);
        console.log('Added is_recommended column to products table');
    } catch (error) {
        console.error('Error migrating products table:', error);
    } finally {
        // We don't close the pool here because it might be used by the app, 
        // but for a standalone script we would. 
        // Since we will run this temporarily via node, we should probably exit.
        process.exit();
    }
};

migrateRecommended();
