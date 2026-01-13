const db = require('../config/db');

const migrate = async () => {
    try {
        await db.query(`ALTER TABLE core_values ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;`);
        console.log('Migration successful: is_visible column added.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
