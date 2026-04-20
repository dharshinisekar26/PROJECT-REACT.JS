const express = require('express');
const cors = require('cors');
require('dotenv').config();

const couponRoutes = require('./routes/couponRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/coupons', couponRoutes);

// Start server directly without Database
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (Using In-Memory Memory Array)`);
});
