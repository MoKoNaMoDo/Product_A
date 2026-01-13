const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const initDb = require('./utils/init-db');

// Initialize DB Tables
initDb();

const productRoutes = require('./routes/product.routes');
const siteSettingsRoutes = require('./routes/site-settings.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const coreValuesRoutes = require('./routes/core-values.routes');
const homeBannersRoutes = require('./routes/home-banners.routes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Visit Counter Middleware (simple implementation)
app.use(async (req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    // Only count page loads if served by express? 
    // Actually user loads Next.js app, which calls API. 
    // Let's count calls to /api/products as a proxy for "Visits" since homepage calls it?
    // Wait, homepage calls /api/products? Not yet. 
    // But products page does. 
    // Let's just create a specific endpoint for tracking or just track any API call?
    // Let's track when 'api/products' is hit for now, or just add a global counter.
  }
  next();
});

// Explicit track visit endpoint or middleware for fetching products
app.use('/api/products', async (req, res, next) => {
  if (req.method === 'GET' && req.path === '/') {
    // Increment visit count when products list is fetched (Proxy for valid visitor)
    try {
      await db.query("UPDATE visit_stats SET count = count + 1 WHERE page = 'home'");
    } catch (err) {
      console.error('Visit update error', err);
    }
  }
  next();
}, productRoutes);

app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/core-values', coreValuesRoutes);
app.use('/api/home-banners', homeBannersRoutes);
// app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
