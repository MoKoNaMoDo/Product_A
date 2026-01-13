const db = require('../config/db');

async function migrateCategories() {
    try {
        console.log('Starting migration: Categories Table...');

        // 1. Create Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tables created or already exist.');

        // 2. Seed from existing products
        const productsRes = await db.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != \'\'');
        const existingCategories = productsRes.rows.map(row => row.category);

        if (existingCategories.length === 0) {
            console.log('No existing categories found in products to seed.');
        } else {
            console.log(`Found ${existingCategories.length} categories to seed:`, existingCategories);
            for (const catName of existingCategories) {
                // Simple slug generation: "Hello World" -> "hello-world"
                const slug = catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

                // Insert if not exists
                await db.query(`
                    INSERT INTO categories (name, slug) 
                    VALUES ($1, $2) 
                    ON CONFLICT (name) DO NOTHING
                `, [catName, slug]);
            }
            console.log('Categories seeded successfully.');
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateCategories();
