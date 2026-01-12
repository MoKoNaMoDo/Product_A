const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
// const adminRoutes = require('./routes/admin.routes'); // To be implemented

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Product Catalog API is running...');
});

app.use('/api/products', productRoutes);
// app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
