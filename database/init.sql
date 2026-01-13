-- Create Users Table (for Admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In real app, store hashed passwords
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Site Settings Table (for dynamic site content)
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(50) UNIQUE NOT NULL,
    value_content TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2), -- Optional if showing price
    image_url TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_recommended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Core Values Table
CREATE TABLE IF NOT EXISTS core_values (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Home Banners Table
CREATE TABLE IF NOT EXISTS home_banners (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Visit Stats Table
CREATE TABLE IF NOT EXISTS visit_stats (
    id SERIAL PRIMARY KEY,
    visit_date DATE UNIQUE DEFAULT CURRENT_DATE,
    count INTEGER DEFAULT 1
);

-- Create Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA (ข้อมูลตัวอย่าง)

-- Default Admin (Password: admin123 - *bcrypt hash placeholder*)
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2b$10$EpOy0q.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0r.Z0')
ON CONFLICT (username) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key_name, value_content) VALUES 
('site_title', 'My Awesome Catalog'),
('contact_email', 'contact@example.com'),
('contact_phone', '02-123-4567'),
('about_us', 'เราคือผู้นำเข้าสินค้าคุณภาพดีเยี่ยม...'),
('hero_image', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop')
ON CONFLICT (key_name) DO NOTHING;

-- Sample Categories
INSERT INTO categories (name, slug) VALUES 
('Electronics', 'electronics'),
('Furniture', 'furniture')
ON CONFLICT (name) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, image_url, category, is_recommended) VALUES
('หูฟังไร้สาย Premium', 'เสียงดี ตัดเสียงรบกวน ใส่สบาย', 2990.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', 'Electronics', TRUE),
('เก้าอี้ทำงาน Ergonomic', 'นั่งนานไม่ปวดหลัง ปรับระดับได้', 5500.00, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop', 'Furniture', FALSE),
('นาฬิกา Smart Watch', 'วัดชีพจร นับก้าว กันน้ำ', 1500.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop', 'Electronics', FALSE)
ON CONFLICT DO NOTHING;
